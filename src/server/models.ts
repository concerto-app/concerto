export type Session = {
  description: string;
};

export type Emoji = {
  id: string;
};

export type CodeEntry = {
  emoji: Emoji;
};

export type Code = {
  entries: CodeEntry[];
};

export type Avatar = {
  emoji: Emoji;
};

export type User = {
  id: string;
  avatar: Avatar;
};

export type EntriesResponse = {
  available: Emoji[];
};

export type ConnectRequestMessage = {
  type: "connect-request";
  code: Code;
};

export type ConnectResponseMessage = {
  type: "connect-response";
  user: User;
  other_users: User[];
};

export type ConnectedMessage = {
  type: "connected";
  user: User;
};

export type DisconnectedMessage = {
  type: "disconnected";
  user: string;
};

export type OfferMessage = {
  type: "offer";
  from_user: string;
  to_user: string;
  session: Session;
};

export type AnswerMessage = {
  type: "answer";
  from_user: string;
  to_user: string;
  session: Session;
};
