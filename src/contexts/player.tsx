import React from "react";
import Player, { getAvailableInstruments } from "../sound/Player";
import { baseInstruments } from "../constants";
import useCancellable from "../hooks/useCancellable";
import { camelCase, startCase } from "lodash";

const PlayerContext = React.createContext<
  | {
      player: Player;
      instruments: { label: string; value: string }[];
    }
  | undefined
>(undefined);

export function PlayerProvider(props: { children: React.ReactNode }) {
  const [availableInstruments, setAvailableInstruments] =
    React.useState(baseInstruments);

  useCancellable((cancelInfo) => {
    getAvailableInstruments().then((instruments) => {
      if (cancelInfo.cancelled) return;
      const newInstruments = instruments.map((instrument) => ({
        label: startCase(camelCase(instrument)),
        value: instrument,
      }));
      setAvailableInstruments(newInstruments);
    });
  }, []);

  const player = React.useMemo(() => new Player(), []);

  return (
    <PlayerContext.Provider
      value={{
        player: player,
        instruments: availableInstruments,
      }}
      children={props.children}
    />
  );
}

export function usePlayer() {
  const context = React.useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
