import { useEffect } from "react";
import {
  useKeyboardHandlers,
  type KeyboardBindingOptions,
} from "./use-keyboard-handlers";

export const useKeyboardInput = ({
  start,
  stop,
  activeMap,
  editMode,
  onAssignKey,
  enabled = true,
}: KeyboardBindingOptions) => {
  const { onKeyDown, onKeyUp } = useKeyboardHandlers({
    start,
    stop,
    activeMap,
    editMode,
    onAssignKey,
    enabled,
  });

  useEffect(() => {
    if (!enabled && !editMode) return;

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [onKeyDown, onKeyUp]);
};
