import { useEffect, useMemo, useState, useRef, useCallback } from "react";
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
  const [attack, setAttack] = useState(initialAttack);
  const [decay, setDecay] = useState(initialDecay);
  const [sustain, setSustain] = useState(initialSustain);
  const [release, setRelease] = useState(initialRelease);
  const [gain, setGain] = useState(defaultMaxGain);
  const [oscCount, setOscCount] = useState<1 | 2>(defaultOscCount);
  const [oscConfigs, setOscConfigs] =
    useState<OscillatorConfig[]>(defaultOscConfigs);
  const [filterCutoff, setFilterCutoff] = useState(defaultFilterCutoff);
  const [filterResonance, setFilterResonance] = useState(
    defaultFilterResonance,
  );
  const [filterType, setFilterType] = useState(defaultFilterType);
  const [lfoRate, setLfoRate] = useState(defaultLfoRate);
  const [lfoDepth, setLfoDepth] = useState(defaultLfoDepth);
  const [lfoTarget, setLfoTarget] = useState(defaultLfoTarget);
  const [lfoWaveform, setLfoWaveform] = useState(defaultLfoWaveform);
  const [analogClipDrive, setAnalogClipDrive] = useState(
    defaultAnalogClipDrive,
  );
  const [analogClipInput, setAnalogClipInput] = useState(
    defaultAnalogClipInput,
  );
  const [playingNotes, setPlayingNotes] = useState<Pitches.Pitch[]>([]);

  const updateOsc = useCallback(
    (index: number, partial: Partial<OscillatorConfig>) => {
      setOscConfigs((prev) =>
        prev.map((c, i) => (i === index ? { ...c, ...partial } : c)),
      );
    },
    [],
  );

  const engineRef = useRef<ReturnType<typeof createAudioEngine> | null>(null);
  if (!engineRef.current) engineRef.current = createAudioEngine();
  const engine = engineRef.current;

  const optsRef = useRef<Required<Audio.SetOptions>>({
    oscillatorCount: defaultOscCount,
    oscillators: [DEFAULT_OSCILLATOR_CONFIG, DEFAULT_OSCILLATOR_CONFIG],
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
  });

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
      const merged = { ...prev, ...options };
      optsRef.current = merged;

      const voices = activeVoicesRef.current;

      if (
        options.oscillatorCount !== undefined &&
        options.oscillatorCount !== prev.oscillatorCount
      ) {
        setOscCount(options.oscillatorCount);
        if (options.oscillatorCount < prev.oscillatorCount) {
          const count = options.oscillatorCount;
          const prevCount = prev.oscillatorCount;
          voices.forEach(({ oscillators }) => {
            for (let i: number = count; i < prevCount; i++) {
              const oscv = oscillators[i];
              if (!oscv) continue;
              try {
                oscv.osc.stop();
              } catch {}
              try {
                oscv.osc.disconnect();
              } catch {}
              try {
                oscv.gain.disconnect();
              } catch {}
              try {
                oscv.pan.disconnect();
              } catch {}
            }
          });
        }
      }

      if (options.oscillators !== undefined) {
        const newOscs = options.oscillators;
        const prevOscs = prev.oscillators;
        newOscs.forEach((config, i) => {
          const prevConfig = prevOscs[i];
          if (!prevConfig) return;

          if (config.waveform !== prevConfig.waveform) {
            updateOsc(i, { waveform: config.waveform });
            voices.forEach(({ oscillators }) => {
              if (oscillators[i]?.osc)
                oscillators[i].osc.type = config.waveform;
            });
          }
          if (config.gain !== prevConfig.gain) {
            updateOsc(i, { gain: config.gain });
            voices.forEach(({ oscillators }) => {
              if (oscillators[i]?.gain)
                oscillators[i].gain.gain.value = config.gain;
            });
          }
          if (config.detune !== prevConfig.detune) {
            updateOsc(i, { detune: config.detune });
            voices.forEach(({ oscillators }) => {
              if (oscillators[i]?.osc)
                oscillators[i].osc.detune.value = config.detune;
            });
          }
          if (config.octave !== prevConfig.octave) {
            updateOsc(i, { octave: config.octave });
            voices.forEach(({ note, oscillators }) => {
              if (oscillators[i]?.osc) {
                const freq = pitchToFrequency(note);
                oscillators[i].osc.frequency.value =
                  freq * Math.pow(2, config.octave);
              }
            });
          }
          if (config.pan !== prevConfig.pan) {
            updateOsc(i, { pan: config.pan });
            voices.forEach(({ oscillators }) => {
              if (oscillators[i]?.pan)
                oscillators[i].pan.pan.value = config.pan;
            });
          }
        });
      }

      if (options.gain !== undefined && options.gain !== prev.gain) {
        setGain(options.gain);
      }
      if (options.attack !== undefined && options.attack !== prev.attack) {
        setAttack(options.attack);
      }
      if (options.decay !== undefined && options.decay !== prev.decay) {
        setDecay(options.decay);
      }
      if (options.sustain !== undefined && options.sustain !== prev.sustain) {
        setSustain(options.sustain);
      }
      if (options.release !== undefined && options.release !== prev.release) {
        setRelease(options.release);
      }
      if (
        options.filterCutoff !== undefined &&
        options.filterCutoff !== prev.filterCutoff
      ) {
        setFilterCutoff(options.filterCutoff);
        voices.forEach(({ filterNode }) => {
          filterNode.frequency.value = options.filterCutoff!;
        });
      }
      if (
        options.filterResonance !== undefined &&
        options.filterResonance !== prev.filterResonance
      ) {
        setFilterResonance(options.filterResonance);
        voices.forEach(({ filterNode }) => {
          filterNode.Q.value = options.filterResonance!;
        });
      }
      if (
        options.filterType !== undefined &&
        options.filterType !== prev.filterType
      ) {
        setFilterType(options.filterType);
        voices.forEach(({ filterNode }) => {
          filterNode.type = options.filterType!;
        });
      }
      if (options.lfoRate !== undefined && options.lfoRate !== prev.lfoRate) {
        setLfoRate(options.lfoRate);
        engine.updateLfoRate(options.lfoRate);
      }
      if (
        options.lfoDepth !== undefined &&
        options.lfoDepth !== prev.lfoDepth
      ) {
        setLfoDepth(options.lfoDepth);
        engine.updateLfoDepth(options.lfoDepth);
      }
      if (
        options.lfoTarget !== undefined &&
        options.lfoTarget !== prev.lfoTarget
      ) {
        setLfoTarget(options.lfoTarget);
        engine.relinkLfo(options.lfoTarget, voices);
      }
      if (
        options.lfoWaveform !== undefined &&
        options.lfoWaveform !== prev.lfoWaveform
      ) {
        setLfoWaveform(options.lfoWaveform);
        engine.updateLfoWaveform(options.lfoWaveform);
      }
      if (
        options.analogClipDrive !== undefined &&
        options.analogClipDrive !== prev.analogClipDrive
      ) {
        setAnalogClipDrive(options.analogClipDrive);
        engine.updateAnalogClipDrive(options.analogClipDrive);
      }
      if (
        options.analogClipInput !== undefined &&
        options.analogClipInput !== prev.analogClipInput
      ) {
        setAnalogClipInput(options.analogClipInput);
        engine.updateAnalogClipInput(options.analogClipInput);
      }
    },
    [updateOsc, engine],
  );

  const controlValues = useMemo(
    () => ({
      oscillatorCount: oscCount,
      oscillators: oscConfigs,
      gain,
      attack,
      decay,
      sustain,
      release,
      filterCutoff,
      filterResonance,
      filterType,
      lfoRate,
      lfoDepth,
      lfoTarget,
      lfoWaveform,
      analogClipDrive,
      analogClipInput,
    }),
    [
      oscCount,
      oscConfigs,
      gain,
      attack,
      decay,
      sustain,
      release,
      filterCutoff,
      filterResonance,
      filterType,
      lfoRate,
      lfoDepth,
      lfoTarget,
      lfoWaveform,
      analogClipDrive,
      analogClipInput,
    ],
  );

  const frequenciesState = useMemo(() => {
    const keys = [...Array(MAX_OCTAVE).keys()].flatMap((octave) =>
      PITCH_CLASSES.map((note) => `${note}${octave}` as Pitches.Pitch),
    );

    return keys.map((key) => {
      const isPlaying = playingNotes.includes(key);
      return {
        hz: pitchToFrequency(key),
        gain,
        oscillators: oscConfigs.map((c) => c.waveform),
        playing: isPlaying,
        touched: isPlaying,
      };
    });
  }, [playingNotes, oscConfigs, gain]);

  return {
    start,
    stop,
    stopAll,
    set,
    state: frequenciesState,
    controlValues,
    playingNotes,
    envelopeActivity,
  };
};

export type UseMusicNotes = ReturnType<typeof useMusicNotes>;
