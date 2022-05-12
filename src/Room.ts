export type Action = {
  note: number;
  type: "press" | "release";
  velocity: number;
};

export type RoomEvent = {
  user: UserId;
  action: Action;
};

export default class Room {
  public currentUser?: UserId;
  private connected: boolean = false;
  private code?: Code;
  private onEvent?: (event: RoomEvent) => any;

  connect(
    code: Code,
    onConnected: (id: UserId, emoji: EmojiId) => any = () => {},
    onUserConnect: (id: UserId, emoji: EmojiId) => any = () => {},
    onUserDisconnect: (id: UserId) => any = () => {},
    onEvent: (event: RoomEvent) => any = () => {}
  ) {
    if (this.connected) return;

    this.code = code;
    this.onEvent = onEvent;

    const connection = this._connect(code);
    this.currentUser = connection.userId;

    setTimeout(() => onConnected(connection.userId, connection.emoji));

    this.connected = true;
  }

  _connect(code: Code) {
    return {
      userId: "me",
      emoji: "1f349",
    };
  }

  disconnect() {
    if (!this.connected) return;

    this.currentUser = undefined;
    this.code = undefined;

    this.connected = false;
  }

  dispatch(action: Action) {
    this.currentUser &&
      this.onEvent &&
      this.onEvent({
        user: this.currentUser,
        action: action,
      });
  }
}
