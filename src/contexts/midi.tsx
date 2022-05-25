import React from "react";
import MidiController, { DeviceInfo } from "../sound/MidiController";
import { useSettings } from "./settings";
import Midi from "react-native-midi";
import useCancellable from "../hooks/useCancellable";
import { midiInputs } from "../constants";

const MidiContext = React.createContext<
  | { controller: MidiController; inputs: { label: string; value: string }[] }
  | undefined
>(undefined);

export function MidiProvider(props: { children: React.ReactNode }) {
  const [availableInputs, setAvailableInputs] = React.useState(midiInputs.base);

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
        if (previous === midiInputs.default) return device.id.toString();
        return previous;
      });
    });

    Midi.on(Midi.INPUT_DEVICE_DETACHED, (device: DeviceInfo) => {
      setAvailableInputs((previous) =>
        previous.filter((input) => input.value !== device.id.toString())
      );
      settings.midiInput.setValue((previous) => {
        if (previous === device.id.toString()) return midiInputs.default;
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
          ...midiInputs.base,
          ...devices.map((device) => ({
            value: device.id.toString(),
            label: `${device.productName} (${device.id})`,
          })),
        ]);
        settings.midiInput.setValue((previous) => {
          if (previous === midiInputs.default) return previous;
          const device = devices.find(
            (device) => device.id.toString() === previous
          );
          if (!device) return midiInputs.default;
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
