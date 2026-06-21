# react-piano-keyboard

A batteries-included React piano with Web Audio synthesis, controls, presets,
and visualizers, plus domain subpaths for custom composition.

```bash
npm install react-piano-keyboard react react-dom
```

```tsx
import { Piano } from "react-piano-keyboard";
import "react-piano-keyboard/styles.css";

export function Instrument() {
  return <Piano controls waveform keyboardInput="global" />;
}
```

For custom layouts, import `usePiano` from `react-piano-keyboard/piano`,
`PianoKeyboard` from `react-piano-keyboard/piano-keyboard`, controls from
`react-piano-keyboard/controls`, and visualizers from
`react-piano-keyboard/visualizers`.

Music and audio APIs are mirrored at `react-piano-keyboard/music` and
`react-piano-keyboard/audio`; defaults and presets have nested audio subpaths.
Styles are always explicit via `react-piano-keyboard/styles.css`.

MIT
