# react-piano-keyboard

A React piano keyboard component powered by the Web Audio API. Play notes with mouse/touch or the computer keyboard.

## Installation

```bash
npm install react-piano-keyboard
```

## Usage

### Quick start

```tsx
import { Piano } from "react-piano-keyboard";

<Piano />;
```

The `<Piano>` component is uncontrolled by default. It creates its own `AudioContext` and manages note state, mapping, and keyboard input internally. Set `controls` or `waveform` to show the control panel and waveform visualizer. Each section (Filter, ADSR, LFO, Analog Clip) has an on/off toggle to bypass its processing.

### With custom hook (controlled)

```tsx
import {
  PianoNotes,
  Controls,
  WaveformVisualizer,
  usePiano,
  useAudioContext,
} from "react-piano-keyboard";

function CustomPiano() {
  const audioContext = useAudioContext();
  const analyser = audioContext?.createAnalyser();

  const { notes, audio, mapping, inputProps } = usePiano({
    rows: 2,
    start: "C3",
    analyserNode: analyser,
  });

  if (!audioContext) return null;

  return (
    <div {...inputProps} tabIndex={0}>
      <Controls set={audio.set} />
      <WaveformVisualizer analyserNode={analyser} height={120} />
      <PianoNotes id="piano" notes={notes} audio={audio} mapping={mapping} />
    </div>
  );
}
```

### Full API

```tsx
import { Piano } from "react-piano-keyboard";

<Piano
  rows={1 | 2}                             // default: 1
  start={"C3" | { bottom: "C3", top?: "C4" }}  // default: "C3"
  end={"C5"}                               // optional, only for rows=1
  controls={true | { onClose, defaultValues, sections }}
  waveform={true | { width, height, strokeColor, backgroundColor }}
/>
```

## Exports

| Import path                       | Exports                                                                                                                                                                                                                                                                |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `react-piano-keyboard`            | `Piano`, `PianoNotes`, `Controls`, `WaveformVisualizer`, `usePiano`, `useMusicNotes`, `useAudioContext`, `useKeyMapping`, `useKeyboardInput`, `pitchToFrequency`, `pitchToIndex`, `indexToPitch`, `getPitchRange`, `PITCH_CLASSES`, `Oscillator`, `Pitch`, types, etc. |
| `react-piano-keyboard/hooks`      | `usePiano`, `useMusicNotes`, `useAudioContext`, `useKeyMapping`, `useKeyboardInput`                                                                                                                                                                                    |
| `react-piano-keyboard/components` | `Piano`, `PianoNotes`, `Controls`, `WaveformVisualizer`                                                                                                                                                                                                                |
| `react-piano-keyboard/types`      | `Pitch`, `PitchData`, `Oscillator`, `SetOptions`, etc.                                                                                                                                                                                                                 |
| `react-piano-keyboard/pitches`    | `pitchToFrequency`, `pitchToIndex`, `indexToPitch`, `getPitchClass`, `getPitchRange`                                                                                                                                                                                   |
| `react-piano-keyboard/constants`  | `A4`, `PITCH_CLASSES`, `WHITE_PITCH_CLASSES`, `DEFAULT_OSCILLATOR`, etc.                                                                                                                                                                                               |

## Components

- **`<Piano>`** — Uncontrolled piano component with optional controls panel and waveform visualizer.
- **`<PianoNotes>`** — Renders piano keys (white/black notes) with mouse/touch interaction. Used by `<Piano>` internally. Accepts `notes`, `audio`, `mapping`, `whiteCount`.
- **`<Controls>`** — Sections panel with oscillators (waveform, gain, detune, octave, pan per-oscillator), ADSR envelope, filter, LFO, analog clip, and presets. Each section (except Presets/Oscillators) has an on/off toggle that bypasses its processing. Each section has a live SVG visualizer. Use `sections` prop to show a subset.
- **`<WaveformVisualizer>`** — Canvas-based oscilloscope display.

## Hooks

- **`usePiano(options?)`** — Main hook. Returns `{ notes, allNotes, rowNotes, defaultMap, audio, mapping, inputProps, rowConfigs }`.
- **`useMusicNotes(options?)`** — Core synth hook. Manages `AudioContext`, oscillators, gain, ADSR envelope, filter, LFO, analog clip. Returns `{ start, stop, stopAll, set, state, controlValues, playingNotes, envelopeActivity }`. The `SetOptions` type includes `*Enabled` flags (`filterEnabled`, `adsrEnabled`, `lfoEnabled`, `analogClipEnabled`) to bypass each processing stage.
- **`useAudioContext()`** — Singleton `AudioContext` manager.
- **`useKeyMapping(notes)`** — Manages computer-key-to-note mapping with edit mode. Returns `{ keyMap, editMode, toggleEditMode, selectNote, assignKey, resetToDefaults }`.
- **`useKeyboardInput(options)`** — Computer keyboard event handler. Returns `{ onKeyDown, onKeyUp }`.

## Local Development

This project is organized as an npm monorepo with workspaces:
- `packages/react-piano-keyboard` — The core library.
- `apps/example` — The demo application.

To set up the project locally:
1. Clone the repository and run `npm install` at the root.
2. Start the hot-rebuilding dev environment: `npm run dev` (this starts the library compiler watch and the demo app server concurrently).
3. Run the unit test suite: `npm run test`.
4. Build all workspaces for production: `npm run build`.

## Keyboard Input Focus Notice

For computer keyboard input mapping to work, the piano keyboard container must have focus. We apply `tabIndex={0}` to the container automatically to make it focusable. When the piano is in Standby mode, clicking the "Start Piano" overlay will automatically call `.focus()` on the container for a seamless experience.

## Theme

Override CSS custom properties on `:root` or `[data-theme="light"]`:

```css
:root {
  --piano-accent: #3b82f6;
  --piano-bg-primary: #1c1c1c;
  --piano-bg-tertiary: #0a0a0a;
  --piano-text-muted: #8a8a8a;
  --piano-note-white-bg-top: #333333;
  --piano-note-black-bg-to: #444444;
  /* see theme.css for full list */
}
```

Set `data-theme="light"` on `<html>` for light mode.

## License

MIT
