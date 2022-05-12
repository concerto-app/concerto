import React from "react";
import Player from "../sound/Player";

const PlayerContext = React.createContext<Player | undefined>(undefined);

export function PlayerProvider(props: { children: React.ReactNode }) {
  const player = React.useMemo(() => new Player(), []);
  return <PlayerContext.Provider value={player} children={props.children} />;
}

export function usePlayer() {
  const context = React.useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
