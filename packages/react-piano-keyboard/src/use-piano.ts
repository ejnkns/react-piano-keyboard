import { useMemo } from "react";
import { useMusicNotes } from "@react-piano-keyboard/audio";
import type { LfoTarget, OscillatorConfig } from "@react-piano-keyboard/audio";
import {
  getPianoKeyboardLayout,
  useKeyboardHandlers,
  useKeyMapping,
  type PianoKeyboardLayoutOptions,
} from "@react-piano-keyboard/piano-keyboard";

export type UsePianoOptions = PianoKeyboardLayoutOptions & {
  audioContext?: AudioContext;
  analyserNode?: AnalyserNode;
  oscillatorCount?: 1 | 2;
  oscillators?: OscillatorConfig[];
  gain?: number;
  attack?: number;
  decay?: number;
  sustain?: number;
  release?: number;
  filterCutoff?: number;
  filterResonance?: number;
  filterType?: BiquadFilterType;
  lfoRate?: number;
  lfoDepth?: number;
  lfoTarget?: LfoTarget;
  lfoWaveform?: OscillatorType;
  enabled?: boolean;
};

export const usePiano = ({
  rows,
  start,
  end,
  audioContext,
  analyserNode,
  oscillatorCount,
  oscillators,
  gain,
  attack,
  decay,
  sustain,
  release,
  filterCutoff,
  filterResonance,
  filterType,
  lfoRate,
  lfoDepth,
  lfoTarget,
  lfoWaveform,
  enabled,
}: UsePianoOptions = {}) => {
  const layout = useMemo(
    () => getPianoKeyboardLayout({ rows, start, end }),
    [end, rows, start],
  );
  const audio = useMusicNotes({
    audioContext,
    analyserNode,
    oscillatorCount,
    oscillators,
    gain,
    attack,
    decay,
    sustain,
    release,
    filterCutoff,
    filterResonance,
    filterType,
    lfoRate,
    lfoDepth,
    lfoTarget,
    lfoWaveform,
  });
  const mapping = useKeyMapping(layout.notes, layout.keyMap);
  const keyboardProps = useKeyboardHandlers({
    start: audio.start,
    stop: audio.stop,
    activeMap: mapping.keyMap,
    editMode: mapping.editMode,
    onAssignKey: mapping.assignKey,
    enabled,
  });

  return { layout, audio, mapping, keyboardProps };
};
