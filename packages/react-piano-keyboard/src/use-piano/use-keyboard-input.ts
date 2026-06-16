import { useCallback, useEffect, KeyboardEvent } from "react";
import { isPitch, Pitch } from "../types";

type UseKeyboardInputOptions = {
  start: (note: Pitch) => void;
  stop: (note: Pitch) => void;
  activeMap: Record<string, Pitch>;
  editMode?: boolean;
  onAssignKey?: (key: string) => void;
};

export const useKeyboardInput = ({
  start,
  stop,
  activeMap,
  editMode,
  onAssignKey,
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
