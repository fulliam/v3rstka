type SoundMap = Record<string, string | string[]>;

export class AudioManager {
  private library = new Map<string, string[]>();
  private pools = new Map<string, HTMLAudioElement[]>();
  private globalVolume = 1;
  private _muted = false;
  private maxPerSound = 6;

  register(map: SoundMap, { overwrite = false }: { overwrite?: boolean } = {}) {
    for (const [id, src] of Object.entries(map)) {
      const arr = Array.isArray(src) ? [...src] : [src];
      if (!overwrite && this.library.has(id)) {
        const existing = this.library.get(id) || [];
        this.library.set(id, Array.from(new Set([...existing, ...arr])));
      } else {
        this.library.set(id, arr);
      }
    }
  }

  unregister(ids: string | string[]) {
    const list = Array.isArray(ids) ? ids : [ids];
    for (const id of list) {
      this.library.delete(id);
      const pool = this.pools.get(id);
      if (pool) {
        pool.forEach((a) => {
          a.pause();
          a.src = '';
        });
        this.pools.delete(id);
      }
    }
  }

  get registered() {
    return Array.from(this.library.entries()).reduce<Record<string, string[]>>(
      (acc, [k, v]) => {
        acc[k] = v;
        return acc;
      },
      {}
    );
  }

  setVolume(v: number) {
    this.globalVolume = Math.max(0, Math.min(1, v));
  }

  getVolume() {
    return this.globalVolume;
  }

  setMuted(v: boolean) {
    this._muted = !!v;
  }

  get muted() {
    return this._muted;
  }

  async preload(id?: string) {
    const ids = id ? [id] : Array.from(this.library.keys());
    const promises: Promise<void>[] = [];
    for (const key of ids) {
      const srcs = this.library.get(key) || [];
      for (const src of srcs) {
        promises.push(
          new Promise<void>((resolve) => {
            const a = new Audio(src);
            a.preload = 'auto';
            a.addEventListener('canplaythrough', () => resolve(), {
              once: true,
            });
            a.addEventListener('error', () => resolve(), { once: true });
          })
        );
      }
    }
    await Promise.all(promises);
  }

  play(
    id: string,
    opts: { volume?: number; loop?: boolean; srcIndex?: number } = {}
  ): HTMLAudioElement | null {
    const sources = this.library.get(id);
    if (!sources || sources.length === 0) {
      console.warn(`[AudioManager] unknown sound id: ${id}`);
      return null;
    }

    const idx =
      typeof opts.srcIndex === 'number'
        ? opts.srcIndex
        : Math.floor(Math.random() * sources.length);
    const src = sources[Math.min(idx, sources.length - 1)];

    const pool = this.pools.get(id) || [];
    let audio = pool.find((a) => a.paused || a.ended);

    if (!audio) {
      if (pool.length < this.maxPerSound) {
        audio = this._createAudio(src);
        pool.push(audio);
        this.pools.set(id, pool);
      } else {
        audio = pool.shift()!;
        audio.pause();
        audio.currentTime = 0;
        audio.src = src;
        pool.push(audio);
      }
    } else {
      if (audio.src !== src) audio.src = src;
    }

    audio.loop = !!opts.loop;
    audio.volume = (opts.volume ?? 1) * this.globalVolume;
    if (this._muted) audio.volume = 0;

    audio.play().catch(() => {
      // autoplay policy
    });

    return audio;
  }

  stop(id?: string) {
    if (!id) {
      this.pools.forEach((pool) => {
        pool.forEach((a) => {
          a.pause();
          a.currentTime = 0;
        });
      });
      return;
    }
    const pool = this.pools.get(id);
    if (pool) {
      pool.forEach((a) => {
        a.pause();
        a.currentTime = 0;
      });
    }
  }

  isPlaying(id: string): boolean {
    const pool = this.pools.get(id);
    return !!pool?.some((a) => !a.paused && !a.ended);
  }

  private _createAudio(src: string) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.addEventListener('error', () => {
      // ignore
    });
    return audio;
  }
}
