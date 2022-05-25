import {
  AnswerMessage,
  ConnectedMessage,
  ConnectResponseMessage,
  DisconnectedMessage,
  OfferMessage,
  User,
} from "./models";
import AsyncLock from "async-lock";
import ServerConnection from "./ServerConnection";
import PeerConnection from "./PeerConnection";

export type Action = {
  note: number;
  type: "press" | "release";
  velocity: number;
};

export type RoomEvent = {
  user: string;
  action: Action;
};

export default class Room {
  private readonly url: string;
  private readonly iceServers: RTCIceServer[];
  private currentUser?: string;
  private serverConnection?: ServerConnection;
  private peerConnections: Map<string, PeerConnection> = new Map<
    string,
    PeerConnection
  >();
  private onEvent?: (event: RoomEvent) => any;
  private lock: AsyncLock = new AsyncLock();

  constructor(url: string, iceServers: RTCIceServer[] = []) {
    this.url = url;
    this.iceServers = iceServers;
  }

  async connect(
    code: Array<string>,
    onConnected: (user: User) => any = () => {},
    onUserConnect: (user: User) => any = () => {},
    onUserDisconnect: (id: string) => any = () => {},
    onEvent: (event: RoomEvent) => any = () => {}
  ) {
    await this.lock.acquire("connection", async () => {
      const serverConnection = new ServerConnection();

      const handlePeerMessage = (data: string) => {
        const message = JSON.parse(data);
        onEvent(message);
      };

      const handleConnectResponse = (message: ConnectResponseMessage) => {
        if (this.currentUser !== undefined) return;

        this.currentUser = message.user.id;
        onConnected(message.user);
        message.other_users.forEach((user) => onUserConnect(user));
      };

      const handleConnected = async (message: ConnectedMessage) => {
        if (this.currentUser === undefined) return;
        if (this.peerConnections.has(message.user.id)) return;

        const peerConnection = new PeerConnection(this.iceServers);
        await peerConnection.setup();

        peerConnection.on("message", (event) => {
          handlePeerMessage((event as MessageEvent).data);
        });

        const offerMessage: OfferMessage = {
          type: "offer",
          from_user: this.currentUser,
          to_user: message.user.id,
          session: {
            description: await peerConnection.createOffer(),
          },
        };

        serverConnection.send(JSON.stringify(offerMessage));

        this.peerConnections.set(message.user.id, peerConnection);
        onUserConnect(message.user);
      };

      const handleDisconnected = async (message: DisconnectedMessage) => {
        const peerConnection = this.peerConnections.get(message.user);
        await peerConnection?.destroy();
        this.peerConnections.delete(message.user);
        onUserDisconnect(message.user);
      };

      const handleOffer = async (message: OfferMessage) => {
        if (this.currentUser === undefined) return;
        if (this.peerConnections.has(message.from_user)) return;

        const peerConnection = new PeerConnection(this.iceServers);
        await peerConnection.setup();

        peerConnection.on("message", (event) => {
          handlePeerMessage((event as MessageEvent).data);
        });

        await peerConnection.processOffer(message.session.description);

        const answerMessage: AnswerMessage = {
          type: "answer",
          from_user: this.currentUser,
          to_user: message.from_user,
          session: {
            description: await peerConnection.createAnswer(),
          },
        };

        serverConnection.send(JSON.stringify(answerMessage));

        this.peerConnections.set(message.from_user, peerConnection);
      };

      const handleAnswer = async (message: AnswerMessage) => {
        const peerConnection = this.peerConnections.get(message.from_user);
        if (peerConnection === undefined) return;
        await peerConnection.processAnswer(message.session.description);
      };

      const handleServerMessage = (data: string) => {
        const message = JSON.parse(data);
        switch (message.type) {
          case "connect-response":
            handleConnectResponse(message);
            break;
          case "connected":
            handleConnected(message);
            break;
          case "disconnected":
            handleDisconnected(message);
            break;
          case "offer":
            handleOffer(message);
            break;
          case "answer":
            handleAnswer(message);
            break;
        }
      };

      serverConnection.on("message", (event) =>
        handleServerMessage((event as MessageEvent).data)
      );

      await serverConnection.connect(this.url, code);

      this.serverConnection = serverConnection;
      this.onEvent = onEvent;
    });
  }

  async disconnect() {
    await this.lock.acquire("connection", async () => {
      if (this.serverConnection === undefined) return;
      for (const [, peerConnection] of this.peerConnections) {
        await peerConnection.destroy();
      }
      this.peerConnections.clear();
      await this.serverConnection.disconnect();
      this.serverConnection = undefined;
      this.currentUser = undefined;
      this.onEvent = undefined;
    });
  }

  dispatch(action: Action) {
    setTimeout(() => {
      if (this.currentUser === undefined) return;

      this.peerConnections.forEach((connection) => {
        const message = {
          user: this.currentUser,
          action: action,
        };

        connection.send(JSON.stringify(message));
      });

      this.onEvent &&
        this.onEvent({
          user: this.currentUser,
          action: action,
        });
    });
  }
}
