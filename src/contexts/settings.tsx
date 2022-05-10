import React from "react";
import useSetting from "../hooks/useSetting";
import { defaultMidiInput } from "../constants";

type Setting = ReturnType<typeof useSetting>;

type Settings = {
  noteOnVelocity: Setting;
  noteOffVelocity: Setting;
  instrument: Setting;
  midiInput: Setting;
};

const SettingsContext = React.createContext<Settings | undefined>(undefined);

export function SettingsProvider(props: { children: React.ReactNode }) {
  const value = {
    noteOnVelocity: useSetting("noteOnVelocity", "1.0"),
    noteOffVelocity: useSetting("noteOffVelocity", "1.0"),
    instrument: useSetting("instrument", defaultMidiInput),
    midiInput: useSetting("midiInput", defaultMidiInput),
  };
  return <SettingsContext.Provider value={value} children={props.children} />;
}

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
