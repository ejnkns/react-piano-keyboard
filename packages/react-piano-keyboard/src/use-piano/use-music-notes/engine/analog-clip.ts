import { ANALOG_CLIP_OVERSAMPLE } from "@react-piano-keyboard/audio";
import { createAnalogClipCurve, IDENTITY_CURVE } from "./curve";

export type AnalogClipState = {
  input: GainNode;
  shaper: WaveShaperNode;
};

export type AnalogClipRef = { current: AnalogClipState | null };

export function ensureAnalogClip(
  ctx: AudioContext,
  ref: AnalogClipRef,
  analyserNode?: AnalyserNode,
  opts?: { drive: number; input: number },
) {
  if (ref.current) return ref.current;
  const drive = opts?.drive ?? 1.5;
  const inputVal = opts?.input ?? 0.5;
  const input = ctx.createGain();
  input.gain.value = inputVal;
  const shaper = ctx.createWaveShaper();
  shaper.curve = createAnalogClipCurve(drive) as unknown as Float32Array<ArrayBuffer>;
  shaper.oversample = ANALOG_CLIP_OVERSAMPLE;
  input.connect(shaper);
  shaper.connect(ctx.destination);
  if (analyserNode) {
    shaper.connect(analyserNode);
  }
  ref.current = { input, shaper };
  return ref.current;
}

export function updateAnalogClipDrive(ref: AnalogClipRef, drive: number) {
  if (!ref.current) return;
  ref.current.shaper.curve = createAnalogClipCurve(drive) as unknown as Float32Array<ArrayBuffer>;
}

export function updateAnalogClipInput(ref: AnalogClipRef, input: number) {
  if (!ref.current) return;
  ref.current.input.gain.value = input;
}

export function updateAnalogClipEnabled(ref: AnalogClipRef, enabled: boolean, drive: number) {
  if (!ref.current) return;
  if (enabled) {
    ref.current.shaper.curve = createAnalogClipCurve(drive) as unknown as Float32Array<ArrayBuffer>;
  } else {
    ref.current.shaper.curve = IDENTITY_CURVE as unknown as Float32Array<ArrayBuffer>;
  }
}

export function disconnectAnalogClip(ref: AnalogClipRef) {
  if (!ref.current) return;
  try {
    ref.current.input.disconnect();
  } catch {}
  try {
    ref.current.shaper.disconnect();
  } catch {}
  ref.current = null;
}
