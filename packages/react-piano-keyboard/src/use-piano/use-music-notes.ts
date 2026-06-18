import { useEffect, useMemo, useReducer, useState, useRef, useCallback } from "react";
import {
  DEFAULT_OSCILLATOR_CONFIG,
  DEFAULT_OSCILLATOR_COUNT,
  type OscillatorConfig,
  MAX_GAIN,
  SMOOTH_IN_INTERVAL,
  SMOOTH_OUT_INTERVAL,
  MAX_OCTAVE,
  PITCH_CLASSES,
  Waveforms,
  DEFAULT_FILTER_CUTOFF,
  DEFAULT_FILTER_RESONANCE,
  DEFAULT_FILTER_TYPE,
  DEFAULT_SUSTAIN,
  DEFAULT_RELEASE,
  DEFAULT_LFO_RATE,
  DEFAULT_LFO_DEPTH,
  DEFAULT_LFO_WAVEFORM,
  DEFAULT_LFO_TARGET,
  DEFAULT_ANALOG_CLIP_DRIVE,
  DEFAULT_ANALOG_CLIP_INPUT,
  type LfoTarget,
} from "../constants";
import { Pitches, pitchToFrequency } from "../pitches";
import { createAudioEngine, type ActiveVoice } from "./use-music-notes/engine";

export namespace Audio {
  export type FrequencyState = {
    oscillators: Waveforms.Oscillator[];
    gain: number;
    hz: number;
    playing: boolean;
    touched: boolean;
  };

  export type SetOptions = {
    oscillatorCount?: 1 | 2;
    oscillators?: OscillatorConfig[];
    gain?: number;
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
    filterCutoff?: number;
    filterResonance?: number;
    filterType?: BiquadFilterType;
    lfoRate?: number;
    lfoDepth?: number;
    lfoTarget?: LfoTarget;
    lfoWaveform?: OscillatorType;
    analogClipDrive?: number;
    analogClipInput?: number;
  };
}

type UseKeyboardProps = Audio.SetOptions & {
  initialFrequencyStates?: Audio.FrequencyState[];
  audioContext?: AudioContext;
  analyserNode?: AnalyserNode;
};

const DEFAULT_OSCS = [DEFAULT_OSCILLATOR_CONFIG, DEFAULT_OSCILLATOR_CONFIG];

type SynthAction = Partial<Required<Audio.SetOptions>>;

function synthReducer(
  state: Required<Audio.SetOptions>,
  action: SynthAction,
): Required<Audio.SetOptions> {
  return { ...state, ...action };
}

const UI_INITIAL_STATE: Required<Audio.SetOptions> = {
  oscillatorCount: DEFAULT_OSCILLATOR_COUNT,
  oscillators: DEFAULT_OSCS,
  gain: MAX_GAIN,
  attack: SMOOTH_IN_INTERVAL,
  decay: SMOOTH_OUT_INTERVAL,
  sustain: DEFAULT_SUSTAIN,
  release: DEFAULT_RELEASE,
  filterCutoff: DEFAULT_FILTER_CUTOFF,
  filterResonance: DEFAULT_FILTER_RESONANCE,
  filterType: DEFAULT_FILTER_TYPE,
  lfoRate: DEFAULT_LFO_RATE,
  lfoDepth: DEFAULT_LFO_DEPTH,
  lfoTarget: DEFAULT_LFO_TARGET,
  lfoWaveform: DEFAULT_LFO_WAVEFORM,
  analogClipDrive: DEFAULT_ANALOG_CLIP_DRIVE,
  analogClipInput: DEFAULT_ANALOG_CLIP_INPUT,
};

export const useMusicNotes = ({
  oscillatorCount: defaultOscCount = DEFAULT_OSCILLATOR_COUNT,
  oscillators: defaultOscConfigs = DEFAULT_OSCS,
  gain: defaultMaxGain = MAX_GAIN,
  attack: initialAttack = SMOOTH_IN_INTERVAL,
  decay: initialDecay = SMOOTH_OUT_INTERVAL,
  sustain: initialSustain = DEFAULT_SUSTAIN,
  release: initialRelease = DEFAULT_RELEASE,
  filterCutoff: defaultFilterCutoff = DEFAULT_FILTER_CUTOFF,
  filterResonance: defaultFilterResonance = DEFAULT_FILTER_RESONANCE,
  filterType: defaultFilterType = DEFAULT_FILTER_TYPE,
  lfoRate: defaultLfoRate = DEFAULT_LFO_RATE,
  lfoDepth: defaultLfoDepth = DEFAULT_LFO_DEPTH,
  lfoTarget: defaultLfoTarget = DEFAULT_LFO_TARGET,
  lfoWaveform: defaultLfoWaveform = DEFAULT_LFO_WAVEFORM,
  analogClipDrive: defaultAnalogClipDrive = DEFAULT_ANALOG_CLIP_DRIVE,
  analogClipInput: defaultAnalogClipInput = DEFAULT_ANALOG_CLIP_INPUT,
  audioContext,
  analyserNode,
}: UseKeyboardProps = {}) => {
  const initSynthState: Required<Audio.SetOptions> = {
    ...UI_INITIAL_STATE,
    oscillatorCount: defaultOscCount,
    oscillators: defaultOscConfigs,
    gain: defaultMaxGain,
    attack: initialAttack,
    decay: initialDecay,
    sustain: initialSustain,
    release: initialRelease,
    filterCutoff: defaultFilterCutoff,
    filterResonance: defaultFilterResonance,
    filterType: defaultFilterType,
    lfoRate: defaultLfoRate,
    lfoDepth: defaultLfoDepth,
    lfoTarget: defaultLfoTarget,
    lfoWaveform: defaultLfoWaveform,
    analogClipDrive: defaultAnalogClipDrive,
    analogClipInput: defaultAnalogClipInput,
  };

  const [synthUI, dispatch] = useReducer(synthReducer, initSynthState);
  const optsRef = useRef(initSynthState);
  const [playingNotes, setPlayingNotes] = useState<Pitches.Pitch[]>([]);

  const engineRef = useRef<ReturnType<typeof createAudioEngine> | null>(null);
  if (!engineRef.current) engineRef.current = createAudioEngine();
  const engine = engineRef.current;

  const activeVoicesRef = useRef<ActiveVoice[]>([]);
  const voiceIdCounter = useRef(0);
  const envelopeActivityRef = useRef<
    Record<
      number,
      {
        note: string;
        noteOnAt: number;
        noteOffAt: number | null;
        releaseAtStop?: number;
      }
    >
  >({});
  const [envelopeActivity, setEnvelopeActivity] = useState<
    Record<
      number,
      {
        note: string;
        noteOnAt: number;
        noteOffAt: number | null;
        releaseAtStop?: number;
      }
    >
  >({});

  const getAudioContext = useCallback((): AudioContext | null => {
    if (audioContext) return audioContext;
    if (analyserNode?.context) return analyserNode.context as AudioContext;
    return null;
  }, [audioContext, analyserNode]);

  useEffect(() => {
    return () => {
      activeVoicesRef.current.forEach((voice) => {
        if (voice.timeoutId) clearTimeout(voice.timeoutId);
        engine.disconnectVoiceNodes(voice);
      });
      activeVoicesRef.current = [];
      envelopeActivityRef.current = {};
      setEnvelopeActivity({});

      engine.disconnectLfo();
      engine.disconnectAnalogClip();
    };
  }, [engine]);

  const start = useCallback(
    (note: Pitches.Pitch) => {
      const ctx = getAudioContext();
      if (!ctx) return;

      if (ctx.state === "suspended") {
        ctx
          .resume()
          .catch((e) => console.warn("Failed to resume AudioContext:", e));
      }

      try {
        const opts = optsRef.current;
        const freq = pitchToFrequency(note);

        const nodes = engine.createVoiceNodes(
          ctx,
          freq,
          opts.oscillatorCount,
          opts.oscillators,
          opts.filterCutoff,
          opts.filterResonance,
          opts.filterType,
          opts.gain,
          opts.attack,
          opts.decay,
          opts.sustain,
        );

        const clipNodes = engine.ensureAnalogClip(ctx, analyserNode, {
          drive: opts.analogClipDrive,
          input: opts.analogClipInput,
        });
        nodes.tremoloGain.connect(clipNodes.input);

        const voiceId = ++voiceIdCounter.current;
        const voice: ActiveVoice = {
          voiceId,
          note,
          released: false,
          oscillators: nodes.oscillators,
          filterNode: nodes.filterNode,
          envGain: nodes.envGain,
          tremoloGain: nodes.tremoloGain,
          timeoutId: null,
        };
        activeVoicesRef.current.push(voice);

        envelopeActivityRef.current[voiceId] = {
          note,
          noteOnAt: performance.now(),
          noteOffAt: null,
        };
        setEnvelopeActivity({ ...envelopeActivityRef.current });

        engine.ensureLfo(ctx, {
          waveform: opts.lfoWaveform,
          rate: opts.lfoRate,
          depth: opts.lfoDepth,
        });
        engine.connectLfoToVoice(voice, opts.lfoTarget);

        setPlayingNotes((prev) =>
          prev.includes(note) ? prev : [...prev, note],
        );
      } catch (e) {
        console.error(`Failed to play note ${note}:`, e);
      }
    },
    [getAudioContext, analyserNode, engine],
  );

  const stop = useCallback(
    (note: Pitches.Pitch) => {
      const voices = activeVoicesRef.current.filter(
        (v) => v.note === note && !v.released,
      );
      if (voices.length === 0) return;

      const ctx = getAudioContext();
      const releaseVal = optsRef.current.release;
      let hasActivity = false;

      voices.forEach((voice) => {
        voice.released = true;

        engine.disconnectLfoFromVoice(voice);

        const entry = envelopeActivityRef.current[voice.voiceId];
        if (entry) {
          entry.noteOffAt = performance.now();
          entry.releaseAtStop = releaseVal;
          hasActivity = true;
        }

        if (ctx) {
          try {
            const timeoutMs = engine.scheduleRelease(
              ctx,
              voice.envGain,
              voice.oscillators,
              releaseVal,
            );
            voice.timeoutId = setTimeout(() => {
              engine.disconnectVoiceNodes(voice);
              const idx = activeVoicesRef.current.indexOf(voice);
              if (idx !== -1) {
                activeVoicesRef.current.splice(idx, 1);
                delete envelopeActivityRef.current[voice.voiceId];
                setEnvelopeActivity({ ...envelopeActivityRef.current });
              }
            }, timeoutMs);
          } catch (e) {
            console.error(`Error stopping note ${note}:`, e);
            const idx = activeVoicesRef.current.indexOf(voice);
            if (idx !== -1) {
              activeVoicesRef.current.splice(idx, 1);
              delete envelopeActivityRef.current[voice.voiceId];
              setEnvelopeActivity({ ...envelopeActivityRef.current });
            }
          }
        } else {
          engine.disconnectVoiceNodes(voice);
          const idx = activeVoicesRef.current.indexOf(voice);
          if (idx !== -1) {
            activeVoicesRef.current.splice(idx, 1);
            delete envelopeActivityRef.current[voice.voiceId];
            setEnvelopeActivity({ ...envelopeActivityRef.current });
          }
        }
      });

      if (hasActivity) {
        setEnvelopeActivity({ ...envelopeActivityRef.current });
      }

      setPlayingNotes((prev) => prev.filter((n) => n !== note));
    },
    [getAudioContext, engine],
  );

  const stopAll = useCallback(() => {
    activeVoicesRef.current.forEach((voice) => {
      if (voice.timeoutId) clearTimeout(voice.timeoutId);
      engine.disconnectVoiceNodes(voice);
    });
    activeVoicesRef.current = [];
    envelopeActivityRef.current = {};
    setEnvelopeActivity({});
    setPlayingNotes([]);
  }, [engine]);

  const set = useCallback(
    (
      optionsInput:
        | Audio.SetOptions
        | ((prev: Audio.SetOptions) => Audio.SetOptions),
    ) => {
      const prev = optsRef.current;
      const options =
        typeof optionsInput === "function" ? optionsInput(prev) : optionsInput;

      optsRef.current = { ...prev, ...options };
      dispatch(options);

      const voices = activeVoicesRef.current;
      const ctx = getAudioContext();
      const time = ctx?.currentTime ?? 0;
      const T = 0.02;

      // --- Oscillator count reduction cleanup ---
      if (options.oscillatorCount !== undefined && options.oscillatorCount < prev.oscillatorCount) {
        const count = options.oscillatorCount;
        const prevCount = prev.oscillatorCount;
        voices.forEach(({ oscillators }) => {
          for (let i = count; i < prevCount; i++) {
            const oscv = oscillators[i];
            if (!oscv) continue;
            try { oscv.osc.stop(); } catch {}
            try { oscv.osc.disconnect(); } catch {}
            try { oscv.gain.disconnect(); } catch {}
            try { oscv.pan.disconnect(); } catch {}
          }
        });
      }

      // --- Oscillator live modulation ---
      if (options.oscillators !== undefined) {
        options.oscillators.forEach((config, i) => {
          const prevConfig = prev.oscillators[i];
          if (!prevConfig) return;
          voices.forEach(({ oscillators: oscs, note }) => {
            const oscv = oscs[i];
            if (!oscv) return;
            if (config.waveform !== prevConfig.waveform) oscv.osc.type = config.waveform;
            if (config.gain !== prevConfig.gain) oscv.gain.gain.setTargetAtTime(config.gain, time, T);
            if (config.detune !== prevConfig.detune) oscv.osc.detune.setTargetAtTime(config.detune, time, T);
            if (config.pan !== prevConfig.pan) oscv.pan.pan.setTargetAtTime(config.pan, time, T);
            if (config.octave !== prevConfig.octave) {
              oscv.osc.frequency.value = pitchToFrequency(note) * Math.pow(2, config.octave);
            }
          });
        });
      }

      // --- Filter live modulation ---
      if (options.filterCutoff !== undefined) {
        voices.forEach(({ filterNode }) =>
          filterNode.frequency.setTargetAtTime(options.filterCutoff!, time, T));
      }
      if (options.filterResonance !== undefined) {
        voices.forEach(({ filterNode }) =>
          filterNode.Q.setTargetAtTime(options.filterResonance!, time, T));
      }
      if (options.filterType !== undefined) {
        voices.forEach(({ filterNode }) => filterNode.type = options.filterType!);
      }

      // --- LFO & Analog Clip ---
      if (options.lfoRate !== undefined) engine.updateLfoRate(options.lfoRate);
      if (options.lfoDepth !== undefined) engine.updateLfoDepth(options.lfoDepth);
      if (options.lfoWaveform !== undefined) engine.updateLfoWaveform(options.lfoWaveform);
      if (options.lfoTarget !== undefined) engine.relinkLfo(options.lfoTarget, voices);
      if (options.analogClipDrive !== undefined) engine.updateAnalogClipDrive(options.analogClipDrive);
      if (options.analogClipInput !== undefined) engine.updateAnalogClipInput(options.analogClipInput);
    },
    [engine, getAudioContext],
  );

  const frequenciesState = useMemo(() => {
    const keys = [...Array(MAX_OCTAVE).keys()].flatMap((octave) =>
      PITCH_CLASSES.map((note) => `${note}${octave}` as Pitches.Pitch),
    );

    return keys.map((key) => {
      const isPlaying = playingNotes.includes(key);
      return {
        hz: pitchToFrequency(key),
        gain: synthUI.gain,
        oscillators: synthUI.oscillators.map((c) => c.waveform),
        playing: isPlaying,
        touched: isPlaying,
      };
    });
  }, [playingNotes, synthUI.oscillators, synthUI.gain]);

  return {
    start,
    stop,
    stopAll,
    set,
    state: frequenciesState,
    controlValues: synthUI,
    playingNotes,
    envelopeActivity,
  };
};

export type UseMusicNotes = ReturnType<typeof useMusicNotes>;
