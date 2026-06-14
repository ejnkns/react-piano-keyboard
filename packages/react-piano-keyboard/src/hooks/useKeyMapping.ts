import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Pitch } from "../types";
import { getKeyToNoteMap } from "../components/Piano.utils";

export const useKeyMapping = (notes: Pitch[], initialMap?: Record<string, Pitch>) => {
  const defaultMap = useMemo(() => initialMap ?? getKeyToNoteMap(notes), [notes, initialMap]);
  const [customMap, setCustomMap] = useState<Record<string, Pitch>>(() => ({
    ...defaultMap,
  }));
  const [editMode, setEditMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Pitch | null>(null);
  const [conflictNote, setConflictNote] = useState<Pitch | null>(null);
  const hasCustomEdits = useRef(false);

  useEffect(() => {
    if (!hasCustomEdits.current) {
      setCustomMap({ ...defaultMap });
    }
  }, [defaultMap]);

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
    setSelectedNote(null);
    setConflictNote(null);
  }, []);

  const selectNote = useCallback((note: Pitch) => {
    setSelectedNote(note);
    setConflictNote(null);
  }, []);

  const assignKey = useCallback(
    (key: string) => {
      if (!selectedNote) return;

      hasCustomEdits.current = true;
      setCustomMap((prev) => {
        const nextMap = { ...prev };
        nextMap[key] = selectedNote;
        return nextMap;
      });
      setConflictNote(null);
    },
    [selectedNote]
  );

  const resetToDefaults = useCallback(() => {
    hasCustomEdits.current = false;
    setCustomMap({ ...defaultMap });
    setSelectedNote(null);
    setConflictNote(null);
  }, [defaultMap]);

  return {
    keyMap: customMap,
    editMode,
    selectedNote,
    conflictNote,
    toggleEditMode,
    selectNote,
    assignKey,
    resetToDefaults,
  };
};
