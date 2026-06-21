import { useEffect } from "react";
import { Pitches, isPitch } from "@react-piano-keyboard/music";

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
};
