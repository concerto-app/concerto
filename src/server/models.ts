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

export type ConnectRequest = {
  code: Code;
  session: Session;
};

export type ConnectResponse = {
  user: User;
  connected_users: User[];
  session: Session;
};

export type OutgoingMessage = {
  type: string;
  data: object;
};

export type IncomingUserMessage = {
  user: string;
  type: string;
  data: object;
};

export type IncomingServerMessage = {
  type: string;
  data: object;
};
