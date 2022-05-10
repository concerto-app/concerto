import { downloadNetworkAsset } from "../utils";
import * as FileSystem from "expo-file-system";
import Sound from "./Sound";

export default class Player {
  private readonly noteFiles: Map<string, string>;
  private playingSounds: Map<string, Sound> = new Map<string, Sound>();
  private timeouts: NodeJS.Timeout[] = [];

  constructor(noteFiles: Map<string, string>) {
    this.noteFiles = noteFiles;
  }

  _timeout(callback: () => {}, interval: number = 0) {
    this.timeouts = [...this.timeouts, setTimeout(callback, interval)];
  }

  async _decaySound(
    sound: Sound,
    duration: number,
    interval: number = 10,
    gainDecrement?: number
  ) {
    const volume = await sound.getVolume();

    if (!volume) return;

    if (duration <= 0 || volume <= 0) {
      await sound.setVolume(0);
      await sound.stop();
      return;
    }

    gainDecrement = gainDecrement || volume / (duration / interval);
    await sound.setVolume(volume - gainDecrement);

    this._timeout(
      async () =>
        await this._decaySound(
          sound,
          duration - interval,
          interval,
          gainDecrement
        ),
      interval
    );
  }

  async _playSound(note: string, velocity: number) {
    const file = this.noteFiles.get(note);
    if (!file) return;

    const previousSound = this.playingSounds.get(note);

    const sound = new Sound(file);

    this.playingSounds.set(note, sound);

    await sound.setVolume(velocity);
    await sound.play(() => {
      if (this.playingSounds.get(note) === sound)
        this.playingSounds.delete(note);
    });

    if (previousSound)
      this._timeout(async () => await this._decaySound(previousSound, 100));
  }

  async _stopSound(note: string, velocity: number) {
    const file = this.noteFiles.get(note);
    if (!file) return;

    const sound = this.playingSounds.get(note);
    if (!sound) return;

    this.playingSounds.delete(note);

    this._timeout(
      async () => await this._decaySound(sound, 100 + (1 - velocity) * 400)
    );
  }

  async destroy() {
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts = [];
    await Promise.all(
      [...this.playingSounds.values()].map((sound) => sound.unload())
    );
    this.playingSounds = new Map<string, Sound>();
  }

  async start(note: string, velocity: number = 1) {
    if (!this.noteFiles.has(note)) {
      if (__DEV__)
        console.warn("Failed to start. Note is not mapped to sound: " + note);
      return;
    }

    await this._playSound(note, velocity);
  }

  async stop(note: string, velocity: number = 1) {
    if (!this.noteFiles.has(note)) {
      if (__DEV__)
        console.warn("Failed to stop. Note is not mapped to sound: " + note);
      return;
    }

    await this._stopSound(note, velocity);
  }
}

function getNoteUrl(instrument: string, note: string) {
  return `https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/FatBoy/${instrument}-mp3/${note}.mp3`;
}

async function downloadNotes(instrument: string, notes: string[]) {
  const networkUrls = notes.map((note) => getNoteUrl(instrument, note));

  const directory = (FileSystem.documentDirectory || "") + instrument;

  const fileUris = await Promise.all(
    networkUrls.map((url) => downloadNetworkAsset(url, directory))
  );

  return notes.map((note, index) => ({
    note: note,
    uri: fileUris[index],
  }));
}

export async function loadPlayer(instrument: string, notes: string[]) {
  const noteFiles = await downloadNotes(instrument, notes);
  return new Player(new Map(noteFiles.map(({ note, uri }) => [note, uri])));
}
