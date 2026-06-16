import { useMemo } from "react";
import { useMusicNotes } from "./use-piano/use-music-notes";
import { useKeyMapping } from "./use-piano/use-key-mapping";
import { useKeyboardInput } from "./use-piano/use-keyboard-input";
import { getPitchRange, pitchToIndex, indexToPitch } from "./pitches";
import {
  getKeyToNoteMap,
  getTwoRowKeyToNoteMap,
  getPitchRangeForWhiteKeyCount,
} from "./use-piano/piano-utils";
import { OctaveRows } from "./keyboard-layout";
import { Pitch, Oscillator } from "./types";

export type UsePianoOptions = {
  rows?: 1 | 2;
  start?: Pitch | { bottom: Pitch; top?: Pitch };
  end?: Pitch;
  audioContext?: AudioContext;
  analyserNode?: AnalyserNode;
  oscillator?: Oscillator;
  gain?: number;
  attack?: number;
  decay?: number;
};

const getDefaultEnd = (startPitch: Pitch, rows: 1 | 2): Pitch => {
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
  oscillator,
  gain,
  attack,
  decay,
}: UsePianoOptions = {}) => {
  const startPitch: Pitch =
    typeof startProp === "string" ? startProp : startProp.bottom;
  const isTwoRow = rows === 2;

  const bottomNotes = useMemo((): Pitch[] => {
    if (!isTwoRow) return [];
    const bottomStart =
      typeof startProp === "object" ? startProp.bottom : startPitch;
    return getPitchRangeForWhiteKeyCount(
      bottomStart,
      OctaveRows.bottom.whiteKeys.length,
    );
  }, [isTwoRow, startProp, startPitch]);

  const topNotes = useMemo((): Pitch[] => {
    if (!isTwoRow) return [];
    const topStart: Pitch =
      typeof startProp === "object"
        ? startProp.top ?? startPitch
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

  const rowNotes = useMemo((): readonly [Pitch[], Pitch[]] | undefined => {
    if (!isTwoRow) return undefined;
    return [bottomNotes, topNotes] as const;
  }, [isTwoRow, bottomNotes, topNotes]);

  const audio = useMusicNotes({
    audioContext,
    analyserNode,
    oscillator,
    gain,
    attack,
    decay,
  });

  const mapping = useKeyMapping(allNotes, defaultMap);

  const inputProps = useKeyboardInput({
    start: audio.start,
    stop: audio.stop,
    activeMap: mapping.keyMap,
    editMode: mapping.editMode,
    onAssignKey: mapping.assignKey,
  });

  return {
    notes: mappedNotes,
    allNotes,
    rowNotes,
    defaultMap,
    audio,
    mapping,
    inputProps,
  };
};
