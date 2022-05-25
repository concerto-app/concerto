import AsyncLock from "async-lock";
import { RTCPeerConnection, RTCSessionDescription } from "react-native-webrtc";
import RTCDataChannel from "react-native-webrtc/lib/typescript/RTCDataChannel";

type EventCallback = Parameters<
  InstanceType<typeof RTCDataChannel>["addEventListener"]
>[1];

export default class PeerConnection {
  private readonly iceServers: RTCIceServer[];
  private peerConnection?: RTCPeerConnection;
  private dataChannel?: RTCDataChannel;
  private lock: AsyncLock = new AsyncLock();
  private callbacks: Map<string, EventCallback> = new Map<
    string,
    EventCallback
  >();

  constructor(iceServers: RTCIceServer[] = []) {
    this.iceServers = iceServers;
  }

  static async setLocalDescription(
    peerConnection: RTCPeerConnection,
    description: RTCSessionDescription
  ) {
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

    await peerConnection.setLocalDescription(description);
    await gathering;

    return peerConnection.localDescription?.sdp as string;
  }

  off(event: string) {
    const callback = this.callbacks.get(event);
    if (callback !== undefined) {
      if (this.dataChannel !== undefined)
        this.dataChannel.removeEventListener(event, callback);
      this.callbacks.delete(event);
    }
  }

  on(event: string, callback: EventCallback) {
    this.off(event);
    this.callbacks.set(event, callback);
    if (this.dataChannel !== undefined)
      this.dataChannel.addEventListener(event, callback);
  }

  async setup(): Promise<void> {
    await this.lock.acquire("lock", async () => {
      const peerConnection = new RTCPeerConnection(
        this.getPeerConnectionConfig()
      );
      const dataChannel = peerConnection.createDataChannel(
        "data",
        this.getDataChannelConfig()
      );

      this.callbacks.forEach((callback, event) =>
        dataChannel.addEventListener(event, callback)
      );

      this.peerConnection = peerConnection;
      this.dataChannel = dataChannel;
    });
  }

  async destroy(): Promise<void> {
    await this.lock.acquire("lock", async () => {
      this.dataChannel?.close();

      this.callbacks.forEach((_, event) => this.off(event));
      this.callbacks.clear();

      this.dataChannel = undefined;

      this.peerConnection?.close();
      this.peerConnection = undefined;
    });
  }

  async createOffer(): Promise<string> {
    return await this.lock.acquire("lock", async () => {
      const peerConnection = this.peerConnection;

      if (peerConnection === undefined)
        throw Error("Can't create offer before setup");

      const offer = (await peerConnection.createOffer(
        {}
      )) as RTCSessionDescription;

      return await PeerConnection.setLocalDescription(peerConnection, offer);
    });
  }

  async createAnswer(): Promise<string> {
    return await this.lock.acquire("lock", async () => {
      const peerConnection = this.peerConnection;

      if (peerConnection === undefined)
        throw Error("Can't create answer before setup");

      const answer = (await peerConnection.createAnswer(
        {}
      )) as RTCSessionDescription;

      return await PeerConnection.setLocalDescription(peerConnection, answer);
    });
  }

  async processAnswer(description: string): Promise<void> {
    await this.lock.acquire("lock", async () => {
      const peerConnection = this.peerConnection;

      if (peerConnection === undefined)
        throw Error("Can't process answer before setup");

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({
          sdp: description,
          // @ts-ignore
          type: "answer",
        })
      );
    });
  }

  async processOffer(description: string): Promise<void> {
    await this.lock.acquire("lock", async () => {
      const peerConnection = this.peerConnection;

      if (peerConnection === undefined)
        throw Error("Can't process offer before setup");

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({
          sdp: description,
          // @ts-ignore
          type: "offer",
        })
      );
    });
  }

  send(message: string) {
    if (this.dataChannel === undefined) return;
    this.dataChannel.send(message);
  }

  private getPeerConnectionConfig() {
    return {
      iceCandidatePoolSize: 5,
      iceServers: this.iceServers,
    };
  }

  private getDataChannelConfig() {
    return {
      ordered: false,
      maxRetransmits: 0,
      negotiated: true,
      id: 0,
    };
  }
}
