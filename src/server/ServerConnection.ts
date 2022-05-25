import AsyncLock from "async-lock";
import { ConnectRequestMessage } from "./models";

type EventCallback = Parameters<
  InstanceType<typeof WebSocket>["addEventListener"]
>[1];

export default class ServerConnection {
  private ws?: WebSocket;
  private lock: AsyncLock = new AsyncLock();
  private callbacks: Map<string, EventCallback> = new Map<
    string,
    EventCallback
  >();

  private static createRequestMessage(
    code: Array<string>
  ): ConnectRequestMessage {
    return {
      type: "connect-request",
      code: {
        entries: code.map((id) => ({
          emoji: {
            id: id,
          },
        })),
      },
    };
  }

  off(event: string) {
    const callback = this.callbacks.get(event);
    if (callback !== undefined) {
      if (this.ws !== undefined) this.ws.removeEventListener(event, callback);
      this.callbacks.delete(event);
    }
  }

  on(event: string, callback: EventCallback) {
    this.off(event);
    this.callbacks.set(event, callback);
    if (this.ws !== undefined) this.ws.addEventListener(event, callback);
  }

  async connect(url: string, code: Array<string>): Promise<void> {
    return await this.lock.acquire("connection", async () => {
      const ws = new WebSocket(url);

      const open = new Promise<void>((resolve, reject) => {
        const onOpen = () => {
          ws.send(JSON.stringify(ServerConnection.createRequestMessage(code)));
          ws.removeEventListener("open", onOpen);
          ws.removeEventListener("error", onError);
          resolve();
        };

        const onError = (e: Event) => {
          ws.removeEventListener("error", onError);
          ws.removeEventListener("open", onOpen);
          reject(e);
        };

        ws.addEventListener("open", onOpen);
        ws.addEventListener("error", onError);

        this.callbacks.forEach((callback, event) =>
          ws.addEventListener(event, callback)
        );
      });

      await open;

      this.ws = ws;
    });
  }

  async disconnect(): Promise<void> {
    await this.lock.acquire("connection", async () => {
      const ws = this.ws;

      if (ws === undefined) return;

      const closed = new Promise<void>((resolve) => {
        if (ws.readyState === 3) resolve();

        const onClose = () => {
          ws.removeEventListener("close", onClose);
          resolve();
        };

        ws.addEventListener("close", onClose);
        ws.close();
      });

      await closed;

      this.callbacks.forEach((_callback, event) => this.off(event));
      this.callbacks.clear();

      this.ws = undefined;
    });
  }

  send(message: string) {
    if (this.ws === undefined) return;
    this.ws.send(message);
  }
}
