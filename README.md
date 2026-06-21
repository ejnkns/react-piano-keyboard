# react-piano-keyboard

A package family for building playable React pianos and Web Audio interfaces.
Use the umbrella package for a complete instrument or install individual
domain packages for custom layouts.

## Packages

| Package                                | Purpose                                             |
| -------------------------------------- | --------------------------------------------------- |
| `react-piano-keyboard`                 | Batteries-included piano and curated domain mirrors |
| `@react-piano-keyboard/music`          | Framework-free pitch and frequency utilities        |
| `@react-piano-keyboard/audio`          | Web Audio hooks, synth configuration, and presets   |
| `@react-piano-keyboard/piano-keyboard` | Controlled piano rendering and keyboard bindings    |
| `@react-piano-keyboard/controls`       | Synth controls, visualizers, and control primitives |

## Complete Piano

```tsx
import { Piano } from "react-piano-keyboard";
import "react-piano-keyboard/styles.css";

export function Instrument() {
  return <Piano controls waveform />;
}
```

`Piano` creates its own `AudioContext` when one is not supplied. Computer-key
input defaults to `"global"` and can be changed to `"scoped"` or `false`.

## Custom Composition

```tsx
import { Controls, PianoKeyboard, usePiano } from "react-piano-keyboard";
import { WaveformVisualizer } from "react-piano-keyboard/visualizers";
import "react-piano-keyboard/styles.css";

export function CustomInstrument({
  audioContext,
}: {
  audioContext: AudioContext;
}) {
  const analyserNode = audioContext.createAnalyser();
  const { audio, keyboardProps, mapping } = usePiano({
    rows: 2,
    start: { bottom: "C3", top: "C4" },
    audioContext,
    analyserNode,
  });

  return (
    <div {...keyboardProps}>
      <Controls set={audio.set} defaultValues={audio.controlValues} />
      <WaveformVisualizer analyserNode={analyserNode} />
      <PianoKeyboard
        rows={2}
        start={{ bottom: "C3", top: "C4" }}
        keyboardInput={false}
        onNoteOn={audio.start}
        onNoteOff={audio.stop}
        playingNotes={audio.playingNotes}
        keyMap={mapping.keyMap}
      />
    </div>
  );
}
```

Domain mirrors are available from `react-piano-keyboard/audio`, `/music`,
`/piano`, `/piano-keyboard`, `/controls`, `/controls/primitives`, and
`/visualizers`.

## Development

```bash
npm install
npm run typecheck
npm run test
npm run build
```

## License

MIT
