import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Pitches } from "@react-piano-keyboard/music";
import { getKeyToNoteMap } from "@react-piano-keyboard/piano-keyboard";

export const useKeyMapping = (notes: Pitches.Pitch[], initialMap?: Record<string, Pitches.Pitch>) => {
  const defaultMap = useMemo(() => initialMap ?? getKeyToNoteMap(notes), [notes, initialMap]);
  const [customMap, setCustomMap] = useState<Record<string, Pitches.Pitch>>(() => ({
    ...defaultMap,
  }));
  const [editMode, setEditMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Pitches.Pitch | null>(null);
  const [conflictNote, setConflictNote] = useState<Pitches.Pitch | null>(null);
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

  const selectNote = useCallback((note: Pitches.Pitch) => {
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
