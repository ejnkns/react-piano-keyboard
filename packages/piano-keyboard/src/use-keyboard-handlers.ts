import { useMemo } from "react";
import { isPitch, type Pitches } from "@react-piano-keyboard/music";

export type KeyboardBindingOptions = {
  start: (note: Pitches.Pitch) => void;
  stop: (note: Pitches.Pitch) => void;
  activeMap: Record<string, Pitches.Pitch>;
  editMode?: boolean;
  onAssignKey?: (key: string) => void;
  enabled?: boolean;
};

type KeyboardEventLike = Pick<KeyboardEvent, "key" | "repeat">;

export const useKeyboardHandlers = ({
  start,
  stop,
  activeMap,
  editMode,
  onAssignKey,
  enabled = true,
}: KeyboardBindingOptions) =>
  useMemo(() => {
    const onKeyDown = (event: KeyboardEventLike) => {
      if (event.repeat) return;

      if (editMode) {
        onAssignKey?.(event.key);
        return;
      }

      if (!enabled) return;
      const note = activeMap[event.key];
      if (isPitch(note)) start(note);
    };

    const onKeyUp = (event: KeyboardEventLike) => {
      if (!enabled || editMode) return;
      const note = activeMap[event.key];
      if (isPitch(note)) stop(note);
    };

    return { tabIndex: 0, onKeyDown, onKeyUp };
  }, [activeMap, editMode, enabled, onAssignKey, start, stop]);
