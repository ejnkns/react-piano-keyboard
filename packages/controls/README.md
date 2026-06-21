# @react-piano-keyboard/controls

Synth controls, visualizers, and reusable control primitives.

```bash
npm install @react-piano-keyboard/controls @react-piano-keyboard/audio react react-dom
```

```tsx
import { Controls, PresetPicker } from "@react-piano-keyboard/controls";
import { useMusicNotes } from "@react-piano-keyboard/audio";
import "@react-piano-keyboard/controls/styles.css";

export function SynthControls({
  audioContext,
}: {
  audioContext: AudioContext;
}) {
  const audio = useMusicNotes({ audioContext });
  return (
    <>
      <PresetPicker set={audio.set} />
      <Controls set={audio.set} defaultValues={audio.controlValues} />
    </>
  );
}
```

Visualizers can be used without the full controls panel:

```tsx
import {
  AdsrVisualizer,
  WaveformVisualizer,
} from "@react-piano-keyboard/controls/visualizers";
```

Primitives are available from `@react-piano-keyboard/controls/primitives`:

```ts
import {
  Picker,
  Slider,
  Toggle,
  WavePicker,
} from "@react-piano-keyboard/controls/primitives";
```

MIT
