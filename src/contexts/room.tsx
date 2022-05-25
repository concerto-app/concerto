import React from "react";
import Room from "../server/Room";

const RoomContext = React.createContext<Room | undefined>(undefined);

export function RoomProvider(props: {
  url: string;
  iceServers: RTCIceServer[];
  children: React.ReactNode;
}) {
  const room = React.useMemo(() => new Room(props.url, props.iceServers), []);
  return <RoomContext.Provider value={room} children={props.children} />;
}

export function useRoom() {
  const context = React.useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
}
