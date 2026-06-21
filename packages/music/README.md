# @react-piano-keyboard/music

Framework-free pitch constants, guards, conversions, and chromatic ranges.

```bash
npm install @react-piano-keyboard/music
```

```ts
import {
  getPitchRange,
  pitchToFrequency,
  type Pitches,
} from "@react-piano-keyboard/music";

const note: Pitches.Pitch = "A4";
pitchToFrequency(note); // 440
getPitchRange({ start: "C4", end: "E4" });
```

This package has no runtime dependencies, React code, CSS, Web Audio engine,
or piano-layout behavior.

MIT
