import { downloadNetworkAsset } from "../utils";
import * as FileSystem from "expo-file-system";
import Sound from "./Sound";

export default class Player {
  private readonly sounds: Map<string, Sound>;
  private decayTimers: Map<string, NodeJS.Timeout> = new Map<
    string,
    NodeJS.Timeout
  >();
  private unloadTimers: Map<string, NodeJS.Timeout> = new Map<
    string,
    NodeJS.Timeout
  >();

  constructor(sounds: Map<string, Sound>) {
    this.sounds = sounds;
  }

  async _decaySound(
    sound: Sound,
    note: string,
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

    this.decayTimers.set(
      note,
      setTimeout(
        async () =>
          await this._decaySound(
            sound,
            note,
            duration - interval,
            interval,
            gainDecrement
          ),
        interval
      )
    );
  }

  async _playSound(note: string, velocity: number) {
    const sound = this.sounds.get(note);
    if (!sound) return;

    const decayTimer = this.decayTimers.get(note);
    if (decayTimer !== undefined) {
      clearTimeout(decayTimer);
      this.decayTimers.delete(note);
    }

    const unloadTimer = this.unloadTimers.get(note);
    if (unloadTimer !== undefined) {
      clearTimeout(unloadTimer);
      this.unloadTimers.delete(note);
    }

    await sound.setVolume(velocity);
    await sound.play();
  }

  async _stopSound(note: string, velocity: number) {
    const sound = this.sounds.get(note);
    if (!sound) return;

    await this._decaySound(sound, note, 100 + (1 - velocity) * 400);

    this.unloadTimers.set(
      note,
      setTimeout(async () => await sound.unload(), 2000)
    );
  }

  async destroy() {
    await Promise.all([...this.sounds.values()].map((sound) => sound.unload()));
  }

  async start(note: string, velocity: number = 1, when: number = 0) {
    if (!this.sounds.has(note)) {
      if (__DEV__)
        console.warn("Failed to start. Note is not mapped to sound: " + note);
      return;
    }

    when > 0
      ? setTimeout(async () => await this._playSound(note, velocity), when)
      : await this._playSound(note, velocity);

    return this;
  }

  async stop(note: string, velocity: number = 1, when: number = 0) {
    if (!this.sounds.has(note)) {
      if (__DEV__)
        console.warn("Failed to stop. Note is not mapped to sound: " + note);
      return;
    }

    when > 0
      ? setTimeout(async () => await this._stopSound(note, velocity), when)
      : await this._stopSound(note, velocity);

    return this;
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

  const sounds = new Map(
    noteFiles.map(({ note, uri }) => [note, new Sound(uri)])
  );

  return new Player(sounds);
}
