import { useMemo } from "react";
import { useMusicNotes } from "@react-piano-keyboard/audio";
import { useKeyMapping } from "./use-piano/use-key-mapping";
import { useKeyboardInput } from "@react-piano-keyboard/piano-keyboard";
import {
  Pitches,
  getPitchRangeForWhiteKeyCount,
  getPitchRange,
  pitchToIndex,
  indexToPitch,
} from "@react-piano-keyboard/music";
import {
  OctaveRows,
  getKeyToNoteMap,
  getTwoRowKeyToNoteMap,
} from "@react-piano-keyboard/piano-keyboard";
import type {
  OscillatorConfig,
  LfoTarget,
} from "@react-piano-keyboard/audio";

export type UsePianoOptions = {
  rows?: 1 | 2;
  start?: Pitches.Pitch | { bottom: Pitches.Pitch; top?: Pitches.Pitch };
  end?: Pitches.Pitch;
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

const getDefaultEnd = (
  startPitch: Pitches.Pitch,
  rows: 1 | 2,
): Pitches.Pitch => {
  const startIndex = pitchToIndex(startPitch);
  if (rows === 2) {
    const maxWhite = Math.max(
      OctaveRows.bottom.whiteStart + OctaveRows.bottom.whiteKeys.length - 1,
      OctaveRows.top.whiteStart + OctaveRows.top.whiteKeys.length - 1,
    );
    const octaves = Math.ceil(maxWhite / 7);
    return indexToPitch(startIndex + octaves * 12 - 1) ?? startPitch;
  }
  const octaves = Math.ceil(23 / 7);
  return indexToPitch(startIndex + octaves * 12 - 1) ?? startPitch;
};

export const usePiano = ({
  rows = 1,
  start: startProp = "C3",
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
  const startPitch: Pitches.Pitch =
    typeof startProp === "string" ? startProp : startProp.bottom;
  const isTwoRow = rows === 2;

  const bottomNotes = useMemo((): Pitches.Pitch[] => {
    if (!isTwoRow) return [];
    const bottomStart =
      typeof startProp === "object" ? startProp.bottom : startPitch;
    return getPitchRangeForWhiteKeyCount(
      bottomStart,
      OctaveRows.bottom.whiteKeys.length,
    );
  }, [isTwoRow, startProp, startPitch]);

  const topNotes = useMemo((): Pitches.Pitch[] => {
    if (!isTwoRow) return [];
    const topStart: Pitches.Pitch =
      typeof startProp === "object"
        ? (startProp.top ?? startPitch)
        : startPitch;
    return getPitchRangeForWhiteKeyCount(
      topStart,
      OctaveRows.top.whiteKeys.length,
    );
  }, [isTwoRow, startProp, startPitch]);

  const allNotes = useMemo(() => {
    if (!isTwoRow) {
      const endPitch = end ?? getDefaultEnd(startPitch, rows);
      return getPitchRange({ start: startPitch, end: endPitch });
    }
    const combined = [...bottomNotes, ...topNotes];
    const unique = [...new Set(combined)];
    return unique.sort((a, b) => pitchToIndex(a) - pitchToIndex(b));
  }, [isTwoRow, startPitch, end, rows, bottomNotes, topNotes]);

  const defaultMap = useMemo(
    () =>
      isTwoRow
        ? getTwoRowKeyToNoteMap(bottomNotes, topNotes)
        : getKeyToNoteMap(allNotes),
    [isTwoRow, bottomNotes, topNotes, allNotes],
  );

  const mappedNotes = useMemo(() => {
    if (end) return allNotes;
    const mappedSet = new Set(Object.values(defaultMap));
    return allNotes.filter((n) => mappedSet.has(n));
  }, [allNotes, defaultMap, end]);

  const rowNotes = useMemo(():
    | readonly [Pitches.Pitch[], Pitches.Pitch[]]
    | undefined => {
    if (!isTwoRow) return undefined;
    return [bottomNotes, topNotes] as const;
  }, [isTwoRow, bottomNotes, topNotes]);

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

  const mapping = useKeyMapping(allNotes, defaultMap);

  useKeyboardInput({
    start: audio.start,
    stop: audio.stop,
    activeMap: mapping.keyMap,
    editMode: mapping.editMode,
    onAssignKey: mapping.assignKey,
    enabled,
  });

  return {
    notes: mappedNotes,
    allNotes,
    rowNotes,
    defaultMap,
    audio,
    mapping,
  };
};
