# @react-piano-keyboard/piano-keyboard

Controlled React piano rendering with configurable computer-key bindings.

```bash
npm install @react-piano-keyboard/piano-keyboard @react-piano-keyboard/music react react-dom
```

```tsx
import { PianoKeyboard } from "@react-piano-keyboard/piano-keyboard";
import "@react-piano-keyboard/piano-keyboard/styles.css";

export function Keyboard() {
  return (
    <PianoKeyboard
      start="C3"
      end="C5"
      onNoteOn={(note) => console.log("on", note)}
      onNoteOff={(note) => console.log("off", note)}
    />
  );
}
```

`keyboardInput` accepts `"scoped"`, `"global"`, or `false` and defaults to
`"scoped"`. `PianoNotes` is available as an advanced lower-level renderer.
Pure layout and mapping APIs, including `getPianoKeyboardLayout`, are exported
from the package root.

MIT
