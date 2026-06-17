import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import {
  DEFAULT_OSCILLATOR,
  MAX_GAIN,
  SMOOTH_IN_INTERVAL,
  SMOOTH_OUT_INTERVAL,
  MAX_OCTAVE,
  PITCH_CLASSES,
  Waveforms,
} from "../constants";
import { Pitches, pitchToFrequency } from "../pitches";

export namespace Audio {
  export type FrequencyState = {
    oscillator: Waveforms.Oscillator;
    gain: number;
    hz: number;
    playing: boolean;
    touched: boolean;
  };

  export type SetOptions = {
    oscillator?: Waveforms.Oscillator;
    gain?: number;
    attack?: number;
    decay?: number;
  };
}

type UseKeyboardProps = Audio.SetOptions & {
  initialFrequencyStates?: Audio.FrequencyState[];
  audioContext?: AudioContext;
  analyserNode?: AnalyserNode;
};

export const useMusicNotes = ({
  oscillator: defaultOscillator = DEFAULT_OSCILLATOR,
  gain: defaultMaxGain = MAX_GAIN,
  attack: initialAttack = SMOOTH_IN_INTERVAL,
  decay: initialDecay = SMOOTH_OUT_INTERVAL,
  audioContext,
  analyserNode,
}: UseKeyboardProps = {}) => {
  const [attack, setAttack] = useState(initialAttack);
  const [decay, setDecay] = useState(initialDecay);
  const [gain, setGain] = useState(defaultMaxGain);
  const [oscillator, setOscillator] = useState(defaultOscillator);
  const [playingNotes, setPlayingNotes] = useState<Pitches.Pitch[]>([]);

  // Ref to track active voices (oscillator and gain nodes per Pitch)
  const activeVoicesRef = useRef<Record<string, { osc: OscillatorNode; gainNode: GainNode }>>({});

  // Ref to hold a local AudioContext if none was supplied
  const localAudioContextRef = useRef<AudioContext | null>(null);

  // Helper to get the correct active AudioContext
  const getAudioContext = useCallback((): AudioContext | null => {
    if (audioContext) return audioContext;
    if (analyserNode?.context) return analyserNode.context as AudioContext;
    if (localAudioContextRef.current) return localAudioContextRef.current;

    // Create a local context on-demand only when a note is played
    try {
      const DefinedAudioContext =
        window.AudioContext ||
        ("webkitAudioContext" in window && window.webkitAudioContext);
      if (DefinedAudioContext) {
        const ctx = new DefinedAudioContext();
        localAudioContextRef.current = ctx;
        return ctx;
      }
    } catch (e) {
      console.error("Failed to create AudioContext:", e);
    }
    return null;
  }, [audioContext, analyserNode]);

  // Clean up all active nodes and local context on unmount
  useEffect(() => {
    return () => {
      // Disconnect and stop all active voices
      Object.keys(activeVoicesRef.current).forEach((note) => {
        const voice = activeVoicesRef.current[note];
        if (voice) {
          try {
            voice.osc.stop();
            voice.osc.disconnect();
            voice.gainNode.disconnect();
          } catch (e) {
            // Node might already be stopped/disconnected
          }
        }
      });
      activeVoicesRef.current = {};

      // Close the local context if one was created
      if (localAudioContextRef.current) {
        localAudioContextRef.current.close();
        localAudioContextRef.current = null;
      }
    };
  }, []);

  const start = useCallback((note: Pitches.Pitch) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume the context if suspended (browser autoplay policy)
    if (ctx.state === "suspended") {
      ctx.resume().catch((e) => console.warn("Failed to resume AudioContext:", e));
    }

    // Stop and clean up the old voice for this note if it was already playing
    if (activeVoicesRef.current[note]) {
      try {
        activeVoicesRef.current[note].osc.stop();
        activeVoicesRef.current[note].osc.disconnect();
        activeVoicesRef.current[note].gainNode.disconnect();
      } catch (e) {}
      delete activeVoicesRef.current[note];
    }

    try {
      const oscNode = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscNode.type = oscillator;
      oscNode.frequency.value = pitchToFrequency(note);

      // Connect nodes: Oscillator -> Gain -> Destination (+ optional Analyser)
      oscNode.connect(gainNode);
      gainNode.connect(ctx.destination);
      if (analyserNode) {
        gainNode.connect(analyserNode);
      }

      const now = ctx.currentTime;
      // Apply the attack envelope on the gain node
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(gain, now + attack);

      oscNode.start(now);
      activeVoicesRef.current[note] = { osc: oscNode, gainNode };

      setPlayingNotes((prev) => (prev.includes(note) ? prev : [...prev, note]));
    } catch (e) {
      console.error(`Failed to play note ${note}:`, e);
    }
  }, [getAudioContext, analyserNode, oscillator, gain, attack]);

  const stop = useCallback((note: Pitches.Pitch) => {
    const voice = activeVoicesRef.current[note];
    if (!voice) return;

    const ctx = getAudioContext();
    const now = ctx ? ctx.currentTime : 0;
    const { osc, gainNode } = voice;

    if (ctx) {
      try {
        // Cancel any pending changes and schedule the decay envelope
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);
        
        osc.stop(now + decay);

        // Disconnect nodes and delete voice references once decay is complete
        const timeoutMs = decay * 1000 + 100;
        setTimeout(() => {
          try {
            osc.disconnect();
            gainNode.disconnect();
          } catch (e) {}
          delete activeVoicesRef.current[note];
        }, timeoutMs);
      } catch (e) {
        console.error(`Error stopping note ${note}:`, e);
        delete activeVoicesRef.current[note];
      }
    } else {
      try {
        osc.stop();
        osc.disconnect();
        gainNode.disconnect();
      } catch (e) {}
      delete activeVoicesRef.current[note];
    }

    setPlayingNotes((prev) => prev.filter((n) => n !== note));
  }, [getAudioContext, decay]);

  const stopAll = useCallback(() => {
    Object.keys(activeVoicesRef.current).forEach((note) => {
      const voice = activeVoicesRef.current[note];
      if (voice) {
        try {
          voice.osc.stop();
          voice.osc.disconnect();
          voice.gainNode.disconnect();
        } catch (e) {}
      }
    });
    activeVoicesRef.current = {};
    setPlayingNotes([]);
  }, []);

  const set = useCallback(({ oscillator: newOsc, gain: newGain, attack: newAttack, decay: newDecay }: Audio.SetOptions) => {
    if (newOsc) {
      setOscillator(newOsc);
      // Update the wave type of any currently active oscillators
      Object.values(activeVoicesRef.current).forEach(({ osc }) => {
        osc.type = newOsc;
      });
    }
    if (newGain !== undefined) {
      setGain(newGain);
    }
    if (newAttack !== undefined) {
      setAttack(newAttack);
    }
    if (newDecay !== undefined) {
      setDecay(newDecay);
    }
  }, []);

  const controlValues = useMemo(
    () => ({
      gain,
      oscillator,
      attack,
      decay,
    }),
    [gain, oscillator, attack, decay]
  );

  // Reconstruct a reactive state array matching FrequencyState[] for API compatibility
  const frequenciesState = useMemo(() => {
    const keys = [...Array(MAX_OCTAVE).keys()].flatMap((octave) =>
      PITCH_CLASSES.map((note) => `${note}${octave}` as Pitches.Pitch)
    );

    return keys.map((key) => {
      const isPlaying = playingNotes.includes(key);
      return {
        hz: pitchToFrequency(key),
        gain,
        oscillator,
        playing: isPlaying,
        touched: isPlaying,
      };
    });
  }, [playingNotes, oscillator, gain]);

  return {
    start,
    stop,
    stopAll,
    set,
    state: frequenciesState,
    controlValues,
    playingNotes,
  };
};

export type UseMusicNotes = ReturnType<typeof useMusicNotes>;
