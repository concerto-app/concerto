import Connection from "./Connection";
import { IncomingServerMessage, IncomingUserMessage, User } from "./models";
import AsyncLock from "async-lock";

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
  private connection?: Connection;
  private currentUser?: string;
  private onEvent?: (event: RoomEvent) => any;
  private lock: AsyncLock = new AsyncLock();

  constructor(url: string) {
    this.url = url;
  }

  async connect(
    code: Array<string>,
    onConnected: (user: User, connectedUsers: User[]) => any = () => {},
    onUserConnect: (user: User) => any = () => {},
    onUserDisconnect: (id: string) => any = () => {},
    onEvent: (event: RoomEvent) => any = () => {}
  ) {
    await this.lock.acquire("connection", async () => {
      if (this.connection !== undefined) return;

      this.onEvent = onEvent;

      this.connection = new Connection(this.url);
      const response = await this.connection.connect(code, (message) => {
        switch (message.type) {
          case "connect":
            {
              const data = (message as IncomingServerMessage).data as {
                user: User;
              };
              onUserConnect(data.user);
            }
            break;
          case "disconnect":
            {
              const data = (message as IncomingServerMessage).data as {
                user: string;
              };
              onUserDisconnect(data.user);
            }
            break;
          case "press":
          case "release":
            {
              const user = (message as IncomingUserMessage).user;
              const data = (message as IncomingUserMessage).data as {
                note: number;
                velocity: number;
              };
              onEvent({
                user: user,
                action: {
                  type: message.type,
                  note: data.note,
                  velocity: data.velocity,
                },
              });
            }
            break;
        }
      });
      this.currentUser = response.user.id;
      setTimeout(() => onConnected(response.user, response.connectedUsers));
    });
  }

  async disconnect() {
    await this.lock.acquire("connection", async () => {
      if (this.connection === undefined) return;

      await this.connection.disconnect();

      this.currentUser = undefined;
      this.connection = undefined;
    });
  }

  dispatch(action: Action) {
    setTimeout(() => {
      if (this.currentUser === undefined) return;

      this.onEvent &&
        this.onEvent({
          user: this.currentUser,
          action: action,
        });
    });

    setTimeout(() => {
      if (this.currentUser === undefined) return;

      this.connection?.send({
        type: action.type,
        data: {
          note: action.note,
          velocity: action.velocity,
        },
      });
    });
  }
}
