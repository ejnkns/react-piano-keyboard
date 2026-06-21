import type { OscillatorConfig } from "../../defaults";
import type { Pitches as MusicPitches } from "@react-piano-keyboard/music";

export type OscillatorVoice = {
  osc: OscillatorNode;
  gain: GainNode;
  pan: StereoPannerNode;
};

export type ActiveVoice = {
  voiceId: number;
  note: MusicPitches.Pitch;
  released: boolean;
  oscillators: OscillatorVoice[];
  filterNode: BiquadFilterNode;
  envGain: GainNode;
  tremoloGain: GainNode;
  timeoutId: ReturnType<typeof setTimeout> | null;
};

export function createVoiceNodes(
  ctx: AudioContext,
  freq: number,
  oscillatorCount: 1 | 2,
  oscillators: OscillatorConfig[],
  filterCutoff: number,
  filterResonance: number,
  filterType: BiquadFilterType,
  gain: number,
  attack: number,
  decay: number,
  sustain: number,
) {
  const now = ctx.currentTime;
  const filterNode = ctx.createBiquadFilter();
  const envGain = ctx.createGain();
  const tremoloGain = ctx.createGain();
  const createdOscillators: OscillatorVoice[] = [];

  for (let i = 0; i < oscillatorCount; i++) {
    const oscConfig = oscillators[i];
    if (!oscConfig) break;

    const oscNode = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const panNode = ctx.createStereoPanner();

    oscNode.type = oscConfig.waveform;
    oscNode.frequency.value = freq * Math.pow(2, oscConfig.octave);
    oscNode.detune.value = oscConfig.detune;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(oscConfig.gain, now + attack);
    panNode.pan.value = oscConfig.pan;

    oscNode.connect(gainNode);
    gainNode.connect(panNode);
    panNode.connect(filterNode);

    oscNode.start();
    createdOscillators.push({ osc: oscNode, gain: gainNode, pan: panNode });
  }

  filterNode.type = filterType;
  filterNode.frequency.value = filterCutoff;
  filterNode.Q.value = filterResonance;

  tremoloGain.gain.value = 1;

  const peakGain = gain;
  const sustainLevel = peakGain * sustain;

  envGain.gain.setValueAtTime(0, now);
  envGain.gain.linearRampToValueAtTime(peakGain, now + attack);
  envGain.gain.linearRampToValueAtTime(sustainLevel, now + attack + decay);

  filterNode.connect(envGain);
  envGain.connect(tremoloGain);

  return { oscillators: createdOscillators, filterNode, envGain, tremoloGain };
}

export function scheduleRelease(
  ctx: AudioContext,
  envGain: GainNode,
  oscillators: { osc: OscillatorNode }[],
  releaseVal: number,
): number {
  const now = ctx.currentTime;
  envGain.gain.cancelScheduledValues(now);
  envGain.gain.setValueAtTime(envGain.gain.value, now);
  envGain.gain.exponentialRampToValueAtTime(0.0001, now + releaseVal);
  oscillators.forEach(({ osc }) => {
    osc.stop(now + releaseVal);
  });
  return releaseVal * 1000 + 100;
}

export function disconnectVoiceNodes(voice: {
  oscillators: { osc: OscillatorNode; gain: GainNode; pan: StereoPannerNode }[];
  filterNode: BiquadFilterNode;
  envGain: GainNode;
  tremoloGain: GainNode;
}) {
  voice.oscillators.forEach(({ osc, gain, pan }) => {
    try {
      osc.stop();
    } catch {}
    try {
      osc.disconnect();
    } catch {}
    try {
      gain.disconnect();
    } catch {}
    try {
      pan.disconnect();
    } catch {}
  });
  try {
    voice.filterNode.disconnect();
  } catch {}
  try {
    voice.envGain.disconnect();
  } catch {}
  try {
    voice.tremoloGain.disconnect();
  } catch {}
}
