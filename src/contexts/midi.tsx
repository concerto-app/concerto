import React from "react";
import MidiController, { DeviceInfo } from "../sound/MidiController";
import { useSettings } from "./settings";
import Midi from "react-native-midi";
import { baseMidiInputs } from "../constants";
import useCancellable from "../hooks/useCancellable";

const MidiContext = React.createContext<
  | { controller: MidiController; inputs: { label: string; value: string }[] }
  | undefined
>(undefined);

export function MidiProvider(props: { children: React.ReactNode }) {
  const [availableInputs, setAvailableInputs] = React.useState(baseMidiInputs);

  const settings = useSettings();

  useCancellable((cancelInfo) => {
    Midi.on(Midi.INPUT_DEVICE_ATTACHED, (device: DeviceInfo) => {
      if (cancelInfo.cancelled) return;
      setAvailableInputs((previous) => [
        ...previous,
        {
          value: device.id.toString(),
          label: `${device.productName} (${device.id})`,
        },
      ]);
      settings.midiInput.setValue((previous) => {
        if (previous === "none") return device.id.toString();
        return previous;
      });
    });

    Midi.on(Midi.INPUT_DEVICE_DETACHED, (device: DeviceInfo) => {
      setAvailableInputs((previous) =>
        previous.filter((input) => input.value !== device.id.toString())
      );
      settings.midiInput.setValue((previous) => {
        if (previous === device.id.toString()) return "none";
        return previous;
      });
    });
  }, []);

  const controller = React.useMemo(() => new MidiController(), []);

  useCancellable(
    (cancelInfo) => {
      MidiController.getDevices().then((devices) => {
        if (cancelInfo.cancelled) return;
        setAvailableInputs([
          ...baseMidiInputs,
          ...devices.map((device) => ({
            value: device.id.toString(),
            label: `${device.productName} (${device.id})`,
          })),
        ]);
        settings.midiInput.setValue((previous) => {
          if (previous === "none") return previous;
          const device = devices.find(
            (device) => device.id.toString() === previous
          );
          if (!device) return "none";
          return previous;
        });
      });
    },
    [controller]
  );

  return (
    <MidiContext.Provider
      value={{
        controller: controller,
        inputs: availableInputs,
      }}
      children={props.children}
    />
  );
}

export function useMidi() {
  const context = React.useContext(MidiContext);
  if (context === undefined) {
    throw new Error("useMidi must be used within a MidiProvider");
  }
  return context;
}
