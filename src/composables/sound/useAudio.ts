import { AudioManager } from '@/plugins/audio/manager';

// Singleton instance
const _manager = new AudioManager();

export function useAudio() {
  return {
    register: (
      map: Record<string, string | string[]>,
      opts?: { overwrite?: boolean }
    ) => _manager.register(map, opts),
    unregister: (ids: string | string[]) => _manager.unregister(ids),
    play: (
      id: string,
      opts?: { volume?: number; loop?: boolean; srcIndex?: number }
    ) => _manager.play(id, opts),
    stop: (id?: string) => _manager.stop(id),
    preload: (id?: string) => _manager.preload(id),
    setVolume: (v: number) => _manager.setVolume(v),
    getVolume: () => _manager.getVolume(),
    setMuted: (m: boolean) => _manager.setMuted(m),
    getMuted: () => _manager.muted,
    registered: () => _manager.registered,
    isPlaying: (id: string) => _manager.isPlaying(id),
  };
}
