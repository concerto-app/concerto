import { downloadNetworkAsset } from "../utils";
import * as FileSystem from "expo-file-system";
import Sound from "./Sound";
import { getFullName } from "./utils";

export default class Player {
  private loaded: boolean = false;

  private readonly noteFiles: Map<number, string> = new Map<number, string>();
  private readonly playingSounds: Map<number, Sound> = new Map<number, Sound>();
  private readonly timeouts: Set<NodeJS.Timeout> = new Set<NodeJS.Timeout>();

  async load(instrument: string, notes: number[]) {
    if (this.loaded) return;

    const noteFiles = await downloadNotes(instrument, notes);
    noteFiles.forEach((noteFile) =>
      this.noteFiles.set(noteFile.note, noteFile.uri)
    );

    this.loaded = true;
  }

  async unload() {
    if (!this.loaded) return;

    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts.clear();
    await Promise.all(
      [...this.playingSounds.values()].map((sound) => sound.unload())
    );
    this.playingSounds.clear();

    this.loaded = false;
  }

  _timeout(callback: () => {}, interval: number = 0) {
    const timeout = setTimeout(() => {
      this.timeouts.delete(timeout);
      callback();
    }, interval);
    this.timeouts.add(timeout);
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

  async _playSound(note: number, velocity: number) {
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

  async _stopSound(note: number, velocity: number) {
    const file = this.noteFiles.get(note);
    if (!file) return;

    const sound = this.playingSounds.get(note);
    if (!sound) return;

    this.playingSounds.delete(note);

    this._timeout(
      async () => await this._decaySound(sound, 100 + (1 - velocity) * 400)
    );
  }

  async start(note: number, velocity: number = 1) {
    if (!this.noteFiles.has(note)) return;

    await this._playSound(note, velocity);
  }

  async stop(note: number, velocity: number = 1) {
    if (!this.noteFiles.has(note)) return;

    await this._stopSound(note, velocity);
  }
}

function getNoteUrl(instrument: string, note: number) {
  const noteName = getFullName(note);
  return `https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/FatBoy/${instrument}-mp3/${noteName}.mp3`;
}

async function downloadNotes(instrument: string, notes: number[]) {
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
