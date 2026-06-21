import type { LfoTarget } from "../../defaults";

export type LfoState = { osc: OscillatorNode; depth: GainNode };
export type LfoRef = { current: LfoState | null };
export type LfoConnectionsRef = { current: Set<AudioParam> };

export function ensureLfo(
  ctx: AudioContext,
  ref: LfoRef,
  opts?: { waveform: OscillatorType; rate: number; depth: number },
) {
  if (ref.current) return ref.current;
  const waveform = opts?.waveform ?? "sine";
  const rate = opts?.rate ?? 4;
  const depthVal = opts?.depth ?? 0;
  const osc = ctx.createOscillator();
  osc.type = waveform;
  osc.frequency.value = rate;
  const depth = ctx.createGain();
  depth.gain.value = depthVal;
  osc.connect(depth);
  osc.start();
  ref.current = { osc, depth };
  return ref.current;
}

export function getTargetParamsForVoice(
  voice: { oscillators: { osc: OscillatorNode }[]; filterNode: BiquadFilterNode; tremoloGain: GainNode },
  target: LfoTarget,
): AudioParam[] {
  const params: AudioParam[] = [];
  switch (target) {
    case "filter":
      params.push(voice.filterNode.frequency);
      break;
    case "pitch":
      voice.oscillators.forEach(({ osc }) => params.push(osc.frequency));
      break;
    case "volume":
      params.push(voice.tremoloGain.gain);
      break;
  }
  return params;
}

export function relinkLfo(
  ref: LfoRef,
  connRef: LfoConnectionsRef,
  target: LfoTarget,
  voices: { oscillators: { osc: OscillatorNode }[]; filterNode: BiquadFilterNode; tremoloGain: GainNode }[],
) {
  const lfo = ref.current;
  if (!lfo) return;
  connRef.current.forEach((p) => {
    try {
      lfo.depth.disconnect(p);
    } catch {}
  });
  connRef.current.clear();
  if (target === "none") return;
  voices.forEach((voice) => {
    const params = getTargetParamsForVoice(voice, target);
    params.forEach((param) => {
      if (param) {
        lfo.depth.connect(param);
        connRef.current.add(param);
      }
    });
  });
}

export function connectLfoToVoice(
  ref: LfoRef,
  connRef: LfoConnectionsRef,
  voice: { oscillators: { osc: OscillatorNode }[]; filterNode: BiquadFilterNode; tremoloGain: GainNode },
  target: LfoTarget,
) {
  const lfo = ref.current;
  if (!lfo) return;
  if (target === "none") return;
  const params = getTargetParamsForVoice(voice, target);
  params.forEach((param) => {
    if (param) {
      lfo.depth.connect(param);
      connRef.current.add(param);
    }
  });
}

export function disconnectLfoFromVoice(
  ref: LfoRef,
  connRef: LfoConnectionsRef,
  voice: { oscillators: { osc: OscillatorNode }[]; filterNode: BiquadFilterNode; tremoloGain: GainNode },
) {
  const lfo = ref.current;
  if (!lfo) return;
  const params: AudioParam[] = [
    voice.filterNode.frequency,
    ...voice.oscillators.map(({ osc }) => osc.frequency),
    voice.tremoloGain.gain,
  ];
  params.forEach((p) => {
    try {
      lfo.depth.disconnect(p);
    } catch {}
    connRef.current.delete(p);
  });
}

export function disconnectLfo(ref: LfoRef, connRef: LfoConnectionsRef) {
  if (ref.current) {
    try {
      ref.current.osc.stop();
    } catch {}
    try {
      ref.current.osc.disconnect();
    } catch {}
    try {
      ref.current.depth.disconnect();
    } catch {}
    ref.current = null;
  }
  connRef.current.clear();
}
