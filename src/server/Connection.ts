import { RTCPeerConnection, RTCSessionDescription } from "react-native-webrtc";
import axios from "axios";
import {
  ConnectRequest,
  ConnectResponse,
  IncomingServerMessage,
  IncomingUserMessage,
  OutgoingMessage,
} from "./models";
import RTCDataChannel from "react-native-webrtc/lib/typescript/RTCDataChannel";
import AsyncLock from "async-lock";

export default class Connection {
  private readonly url: string;
  private peerConnection?: RTCPeerConnection;
  private dataChannel?: RTCDataChannel;
  private lock: AsyncLock = new AsyncLock();
  private cleanupDataChannel?: () => void;

  constructor(url: string) {
    this.url = url;
  }

  private static createConnection() {
    const config = {
      iceCandidatePoolSize: 4,
      iceServers: [{ url: "stun:stun.l.google.com:19302" }],
    };
    return new RTCPeerConnection(config);
  }

  private static createDataChannel(
    peerConnection: RTCPeerConnection,
    onMessage: (
      message: IncomingUserMessage | IncomingServerMessage
    ) => any = () => {},
    onOpen: () => any = () => {},
    onClose: () => any = () => {}
  ) {
    const config = {
      ordered: false,
      maxRetransmits: 0,
    };

    const dataChannel = peerConnection.createDataChannel("data", config);

    const messageCallback = (event: Event) => {
      // @ts-ignore
      onMessage(JSON.parse(event.data));
    };

    const openCallback = onOpen;

    const closeCallback = onClose;

    dataChannel.addEventListener("close", closeCallback);
    dataChannel.addEventListener("open", openCallback);
    dataChannel.addEventListener("message", messageCallback);

    const cleanup = () => {
      dataChannel.removeEventListener("close", closeCallback);
      dataChannel.removeEventListener("open", openCallback);
      dataChannel.removeEventListener("message", messageCallback);
    };

    return {
      dataChannel: dataChannel,
      cleanup: cleanup,
    };
  }

  private static async negotiate(
    url: string,
    peerConnection: RTCPeerConnection,
    code: Array<string>
  ) {
    const offer = (await peerConnection.createOffer(
      {}
    )) as RTCSessionDescription;
    const gathering = new Promise<void>((resolve) => {
      const checkState = () => {
        if (peerConnection.iceGatheringState === "complete") {
          peerConnection.removeEventListener(
            "icegatheringstatechange",
            checkState
          );
          resolve();
        }
      };
      peerConnection.addEventListener("icegatheringstatechange", checkState);
    });
    await peerConnection.setLocalDescription(offer);
    await gathering;
    const response = await axios.post<ConnectResponse>(
      url,
      Connection.createPayload(
        code,
        peerConnection.localDescription?.sdp as string
      )
    );
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription({
        sdp: response.data.session.description,
        // @ts-ignore
        type: "answer",
      })
    );
    return {
      user: response.data.user,
      connectedUsers: response.data.connected_users,
    };
  }

  private static createPayload(
    code: Array<string>,
    sdp: string
  ): ConnectRequest {
    return {
      code: {
        entries: code.map((id) => ({
          emoji: {
            id: id,
          },
        })),
      },
      session: {
        description: sdp,
      },
    };
  }

  async connect(
    code: Array<string>,
    onMessage: (
      message: IncomingUserMessage | IncomingServerMessage
    ) => any = () => {},
    onOpen: () => any = () => {},
    onClose: () => any = () => {}
  ) {
    return await this.lock.acquire("connection", async () => {
      const peerConnection = Connection.createConnection();
      const { dataChannel, cleanup } = Connection.createDataChannel(
        peerConnection,
        onMessage,
        onOpen,
        onClose
      );
      const response = await Connection.negotiate(
        this.url,
        peerConnection,
        code
      );
      this.peerConnection = peerConnection;
      this.dataChannel = dataChannel;
      this.cleanupDataChannel = cleanup;

      return response;
    });
  }

  async disconnect() {
    await this.lock.acquire("connection", async () => {
      const dataChannelClosed = new Promise<void>((resolve) => {
        this.dataChannel === undefined ||
        this.dataChannel.readyState === "closed"
          ? resolve()
          : this.dataChannel.addEventListener("close", () => resolve());
      });
      this.dataChannel?.close();
      this.cleanupDataChannel && this.cleanupDataChannel();
      await dataChannelClosed;
      this.dataChannel = undefined;

      this.peerConnection?.close();
      this.peerConnection = undefined;
    });
  }

  send(message: OutgoingMessage) {
    if (this.dataChannel === undefined) return;
    this.dataChannel.send(JSON.stringify(message));
  }
}
