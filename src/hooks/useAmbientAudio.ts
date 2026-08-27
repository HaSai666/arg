import { useEffect } from "react";

const AudioContextClass =
  window.AudioContext ??
  (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

export const useAmbientAudio = (enabled: boolean): void => {
  useEffect(() => {
    if (!enabled || !AudioContextClass) return;

    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.value = 0.025;
    master.connect(context.destination);

    const notes = [220, 277.18, 329.63, 246.94, 196, 246.94];
    let cursor = 0;
    let disposed = false;

    const playNote = () => {
      if (disposed) return;
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = notes[cursor % notes.length] ?? 220;
      cursor += 1;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.5, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.35);
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(now);
      oscillator.stop(now + 1.4);
    };

    void context.resume().then(playNote);
    const interval = window.setInterval(playNote, 1600);

    return () => {
      disposed = true;
      window.clearInterval(interval);
      void context.close();
    };
  }, [enabled]);
};
