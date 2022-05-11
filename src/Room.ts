export type Action = {
  key: Key;
  type: "press" | "release";
  velocity: number;
};

export type RoomEvent = {
  user: UserId;
  action: Action;
};

export default class Room {
  public readonly currentUser: UserId;
  private readonly code: Code;
  private readonly onConnected: (id: UserId, emoji: EmojiId) => any;
  private readonly onUserConnect: (id: UserId, emoji: EmojiId) => any;
  private readonly onUserDisconnect: (id: UserId) => any;
  private readonly onEvent: (event: RoomEvent) => any;

  constructor(
    code: Code,
    onConnected: (id: UserId, emoji: EmojiId) => any = () => {},
    onUserConnect: (id: UserId, emoji: EmojiId) => any = () => {},
    onUserDisconnect: (id: UserId) => any = () => {},
    onEvent: (event: RoomEvent) => any = () => {}
  ) {
    this.code = code;
    this.onConnected = onConnected;
    this.onUserConnect = onUserConnect;
    this.onUserDisconnect = onUserDisconnect;
    this.onEvent = onEvent;

    const connection = this._connect(code);
    this.currentUser = connection.userId;

    setTimeout(() => onConnected(this.currentUser, connection.emoji));
  }

  _connect(code: Code) {
    return {
      userId: "me",
      emoji: "1f349",
    };
  }

  disconnect() {}

  dispatch(action: Action) {
    this.onEvent({
      user: this.currentUser,
      action: action,
    });
  }
}
