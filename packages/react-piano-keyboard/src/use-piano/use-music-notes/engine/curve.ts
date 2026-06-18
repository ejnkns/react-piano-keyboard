export function createAnalogClipCurve(drive: number, n_samples = 2048) {
  const curve = new Float32Array(n_samples);
  const denominator = Math.tanh(drive);
  for (let i = 0; i < n_samples; i++) {
    const x = (i * 2) / n_samples - 1;
    const val = Math.tanh(drive * x) / denominator;
    curve[i] = Math.max(-1, Math.min(1, val));
  }
  return curve;
}
