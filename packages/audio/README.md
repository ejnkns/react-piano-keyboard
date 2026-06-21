# @react-piano-keyboard/audio

React hooks and public configuration for the Web Audio synthesizer.

```bash
npm install @react-piano-keyboard/audio react
```

```tsx
import { useAudioContext, useMusicNotes } from "@react-piano-keyboard/audio";

export function NoteTrigger() {
  const audioContext = useAudioContext();
  const audio = useMusicNotes({ audioContext });

  return (
    <button
      onPointerDown={() => audio.start("C4")}
      onPointerUp={() => audio.stop("C4")}
    >
      Play C4
    </button>
  );
}
```

Lightweight data entries do not load the hook or private engine:

```ts
import { DEFAULT_OSCILLATOR_CONFIG } from "@react-piano-keyboard/audio/defaults";
import { PRESETS } from "@react-piano-keyboard/audio/presets";
```

Low-level engine factories are private implementation details.

MIT
