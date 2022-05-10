import RNSound from "react-native-sound";

export default class Sound {
  private readonly uri: string;
  private player: RNSound | undefined;

  constructor(uri: string) {
    this.uri = uri;
  }

  async load() {
    this.player = await new Promise((resolve, reject) => {
      const player: RNSound = new RNSound(this.uri, undefined, (error) =>
        error ? reject(error) : resolve(player)
      );
    });
  }

  async unload() {
    this.player?.release();
    await new Promise((resolve) => {
      while (true)
        if (this.player?.isLoaded() === false) return resolve(this.player);
    });
  }

  async getVolume() {
    if (!this.player?.isLoaded()) await this.load();
    return this.player?.getVolume();
  }

  async setVolume(volume: number) {
    if (!this.player?.isLoaded()) await this.load();
    this.player?.setVolume(volume);
  }

  async play(callback = () => {}) {
    if (!this.player?.isLoaded()) await this.load();
    this.player?.play(async () => {
      await this.unload();
      callback();
    });
  }

  async stop() {
    if (!this.player?.isLoaded()) return;
    await new Promise((resolve) =>
      this.player?.stop(async () => {
        resolve(this.player);
      })
    );
    await this.unload();
  }
}
