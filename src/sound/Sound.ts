import RNSound from "react-native-sound";
import AsyncLock from "async-lock";

export default class Sound {
  private readonly uri: string;
  private player: RNSound | undefined;
  private readonly lock: AsyncLock;

  constructor(uri: string) {
    this.uri = uri;
    this.lock = new AsyncLock();
  }

  async load() {
    await this.lock.acquire("lock", async () => await this.loadInternal());
  }

  async unload() {
    await this.lock.acquire("lock", async () => await this.unloadInternal());
  }

  async getVolume() {
    return await this.lock.acquire("lock", async () => {
      if (!this.player?.isLoaded()) await this.loadInternal();
      return this.player?.getVolume();
    });
  }

  async setVolume(volume: number) {
    await this.lock.acquire("lock", async () => {
      if (!this.player?.isLoaded()) await this.loadInternal();
      this.player?.setVolume(volume);
    });
  }

  async play(callback = () => {}) {
    await this.lock.acquire("lock", async () => {
      if (!this.player?.isLoaded()) await this.loadInternal();
    });
    this.player?.play(async () => {
      await this.lock.acquire("lock", async () => {
        await this.unloadInternal();
      });
      callback();
    });
  }

  async stop() {
    await this.lock.acquire("lock", async () => {
      if (!this.player?.isLoaded()) return;
      await new Promise((resolve) =>
        this.player?.stop(async () => {
          resolve(this.player);
        })
      );
      await this.unloadInternal();
    });
  }

  private async loadInternal() {
    this.player = await new Promise((resolve, reject) => {
      const player: RNSound = new RNSound(this.uri, undefined, (error) =>
        error ? reject(error) : resolve(player)
      );
    });
  }

  private async unloadInternal() {
    this.player?.release();
    await new Promise((resolve) => {
      while (true)
        if (this.player?.isLoaded() === false) return resolve(this.player);
    });
  }
}
