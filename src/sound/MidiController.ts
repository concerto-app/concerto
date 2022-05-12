import Midi from "react-native-midi";

export type DeviceInfo = {
  id: number;
  class: number;
  subclass: number;
  protocol: number;
  serialNumber: number;
  vendorId: number;
  productId: number;
  manufacturerName: string;
  name: string;
  productName: string;
  version: string;
};

export default class MidiController {
  connected: boolean = false;

  static async getDevices(): Promise<DeviceInfo[]> {
    return await Midi.getDevices();
  }

  connect(
    deviceId: number,
    onNoteOn: (note: number, velocity: number) => any = () => {},
    onNoteOff: (note: number, velocity: number) => any = () => {}
  ) {
    if (this.connected) return;

    Midi.on(
      Midi.NOTE_ON,
      (event: { device: number; note: number; velocity: number }) => {
        if (event.device !== deviceId) return;
        onNoteOn(event.note, event.velocity / 127);
      }
    );

    Midi.on(
      Midi.NOTE_OFF,
      (event: { device: number; note: number; velocity: number }) => {
        if (event.device !== deviceId) return;
        onNoteOff(event.note, event.velocity / 127);
      }
    );

    this.connected = true;
  }

  disconnect() {
    if (!this.connected) return;

    Midi.off(Midi.NOTE_ON);
    Midi.off(Midi.NOTE_OFF);

    this.connected = false;
  }
}
