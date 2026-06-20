# Controls Reference

Each control section can be toggled on/off with the pill switch next to its title. When off, the section's audio processing is bypassed (filter flattened, envelope set to unity, LFO disconnected, analog clip set to identity curve).

## Oscillators

Two independent oscillators per voice.

- **Waveform picker** — selects the oscillator shape:
  - **sine** — pure fundamental, no harmonics. Warm, mellow.
  - **triangle** — odd harmonics only, quieter than square. Flute-like.
  - **sawtooth** — all harmonics (odd + even). Bright, buzzy, rich.
  - **square** — odd harmonics only, strong. Hollow, reedy, classic 8-bit.
- **Gain** — per-oscillator volume (0–1).
- **Detune** — pitch offset in cents (-100–100). Use to thicken the sound.
- **Octave** — octave shift (-2–+2).
- **Pan** — stereo position (-1 left, 0 center, 1 right).

## ADSR Envelope

Shapes the volume of each note over time.

- **Gain** — master volume (0–1). Peak level the envelope reaches.
- **Attack** — time to reach peak volume after pressing a key (0.01–2s). Low: punchy. High: slow swell.
- **Decay** — time to drop from peak to sustain level (0.01–2s). Low: immediate drop. High: gradual fall.
- **Sustain** — volume held while the key is held (0–1). Fraction of peak gain.
- **Release** — time to fade to silence after releasing the key (0.01–5s). Low: abrupt cut. High: lingering tail.

## Filter

A resonant biquad filter applied per-voice (after oscillator, before envelope).

- **Cutoff** — frequency (20–20000 Hz). Lowpass: lets low frequencies through. Highpass: lets high frequencies through. Bandpass: lets a band through. Notch: cuts a band.
- **Resonance** — emphasis at the cutoff frequency (0.1–20). High values create a whistling peak; self-oscillates at extreme settings.
- **Filter type** — `lowpass`, `highpass`, `bandpass`, or `notch`.

## Low-Frequency Oscillator (LFO)

A shared modulation oscillator that affects all voices.

- **LFO Rate** — speed (0.1–20 Hz). Slow = gradual sweeps. Fast = tremolo/vibrato.
- **LFO Depth** — modulation amount (0–1). How much the LFO changes the target.
- **LFO Wave** — shape of the modulation signal. Same types as the main oscillator.
- **LFO Target** — what the LFO modulates:
  - `Off` — no modulation.
  - `filter` — modulates the filter cutoff. Creates a wobble/wah effect (auto-wah).
  - `pitch` — modulates the oscillator frequency. Creates vibrato.
  - `volume` — modulates the amplitude (after envelope). Creates tremolo.

## Analog Clip

A saturator (waveshaper) applied to the final mix. Adds analog-style warmth and distortion.

- **Drive** — saturation intensity (1–3). Higher values clip harder, adding more harmonics.
- **Input** — pre-gain into the shaper (0.1–1). Boosts the signal level before clipping.
