import { useCallback, useEffect, KeyboardEvent } from "react";
import { Pitches, isPitch } from "../pitches";

type UseKeyboardInputOptions = {
  start: (note: Pitches.Pitch) => void;
  stop: (note: Pitches.Pitch) => void;
  activeMap: Record<string, Pitches.Pitch>;
  editMode?: boolean;
  onAssignKey?: (key: string) => void;
  enabled?: boolean;
};

export const useKeyboardInput = ({
  start,
  stop,
  activeMap,
  editMode,
  onAssignKey,
  enabled = true,
}: UseKeyboardInputOptions) => {
  useEffect(() => {
    if (!editMode || !onAssignKey) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.repeat) return;
      onAssignKey(e.key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editMode, onAssignKey]);

  useEffect(() => {
    if (!enabled || editMode) return;
    const down = (e: globalThis.KeyboardEvent) => {
      if (e.repeat) return;
      const note = activeMap[e.key];
      if (isPitch(note)) {
        start(note);
      }
    };
    const up = (e: globalThis.KeyboardEvent) => {
      const note = activeMap[e.key];
      if (isPitch(note)) {
        stop(note);
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [enabled, editMode, activeMap, start, stop]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (editMode) return;
      if (e.repeat) return;
      const note = activeMap[e.key];
      if (isPitch(note)) {
        start(note);
      }
    },
    [editMode, activeMap, start]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (editMode) return;
      const note = activeMap[e.key];
      if (isPitch(note)) {
        stop(note);
      }
    },
    [editMode, activeMap, stop]
  );

  return {
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
  };
};
