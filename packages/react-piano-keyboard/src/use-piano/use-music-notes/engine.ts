import { type LfoTarget } from "@react-piano-keyboard/shared";
import {
  ensureAnalogClip,
  updateAnalogClipDrive,
  updateAnalogClipInput,
  updateAnalogClipEnabled,
  disconnectAnalogClip,
  type AnalogClipRef,
} from "./engine/analog-clip";
import {
  ensureLfo,
  relinkLfo,
  connectLfoToVoice,
  disconnectLfoFromVoice,
  disconnectLfo,
  type LfoRef,
  type LfoConnectionsRef,
} from "./engine/lfo";
import {
  createVoiceNodes,
  scheduleRelease,
  disconnectVoiceNodes,
  type ActiveVoice,
} from "./engine/voice";

export type { ActiveVoice, OscillatorVoice } from "./engine/voice";

export function createAudioEngine() {
  const analogClipRef: AnalogClipRef = { current: null };
  const lfoRef: LfoRef = { current: null };
  const lfoConnectionsRef: LfoConnectionsRef = {
    current: new Set<AudioParam>(),
  };

  return {
    ensureAnalogClip: (
      ctx: AudioContext,
      analyserNode?: AnalyserNode,
      opts?: { drive: number; input: number },
    ) => ensureAnalogClip(ctx, analogClipRef, analyserNode, opts),

    updateAnalogClipDrive: (drive: number) =>
      updateAnalogClipDrive(analogClipRef, drive),

    updateAnalogClipInput: (input: number) =>
      updateAnalogClipInput(analogClipRef, input),

    updateAnalogClipEnabled: (enabled: boolean, drive: number) =>
      updateAnalogClipEnabled(analogClipRef, enabled, drive),

    disconnectAnalogClip: () => disconnectAnalogClip(analogClipRef),

    ensureLfo: (
      ctx: AudioContext,
      opts?: { waveform: OscillatorType; rate: number; depth: number },
    ) => ensureLfo(ctx, lfoRef, opts),

    updateLfoRate: (rate: number) => {
      if (lfoRef.current) lfoRef.current.osc.frequency.value = rate;
    },

    updateLfoDepth: (depth: number) => {
      if (lfoRef.current) lfoRef.current.depth.gain.value = depth;
    },

    updateLfoWaveform: (waveform: OscillatorType) => {
      if (lfoRef.current) lfoRef.current.osc.type = waveform;
    },

    relinkLfo: (target: LfoTarget, voices: ActiveVoice[]) =>
      relinkLfo(lfoRef, lfoConnectionsRef, target, voices),

    connectLfoToVoice: (voice: ActiveVoice, target: LfoTarget) =>
      connectLfoToVoice(lfoRef, lfoConnectionsRef, voice, target),

    disconnectLfoFromVoice: (voice: ActiveVoice) =>
      disconnectLfoFromVoice(lfoRef, lfoConnectionsRef, voice),

    disconnectLfo: () => disconnectLfo(lfoRef, lfoConnectionsRef),

    createVoiceNodes,
    scheduleRelease,
    disconnectVoiceNodes,
  };
}
