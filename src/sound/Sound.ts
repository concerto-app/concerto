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

  async reload() {
    try {
      await this.unload();
    } catch (error) {
      console.log(error());
    }
    await this.load();
  }

  async getVolume() {
    if (!this.player?.isLoaded()) await this.load();
    return this.player?.getVolume();
  }

  async setVolume(volume: number) {
    if (!this.player?.isLoaded()) await this.load();
    this.player?.setVolume(volume);
    if (this.player && this.player.getVolume() !== volume) await this.reload();
  }

  async play() {
    if (!this.player?.isLoaded()) await this.load();
    if (this.player?.isPlaying()) await this.stop();
    this.player?.play(async (success) => {
      if (!success) await this.reload();
    });
  }

  async stop() {
    if (!this.player?.isLoaded()) await this.load();
    await new Promise((resolve) =>
      this.player?.stop(() => resolve(this.player))
    );
  }
}
