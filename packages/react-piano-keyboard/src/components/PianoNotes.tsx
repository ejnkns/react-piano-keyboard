import { getPitchClass } from "../pitches";
import { Pitch } from "../types";
import styles from "./Piano.module.css";
import { useMouseAndTouchDown } from "../hooks/useMouseDown";
import { NO_MARGIN_NOTES } from "./Piano.constants";

type AudioProps = {
  start: (note: Pitch) => void;
  stop: (note: Pitch) => void;
  playingNotes?: Pitch[];
};

type MappingProps = {
  keyNoteMap: Record<string, Pitch>;
  customKeyMap?: Record<string, Pitch>;
  editMode?: boolean;
  selectedNote?: Pitch | null;
  conflictNote?: Pitch | null;
  onNoteSelect?: (note: Pitch) => void;
};

export type PianoNotesProps = {
  id: string;
  notes: Pitch[];
  audio: AudioProps;
  mapping: MappingProps;
  whiteCount?: number;
};

export const PianoNotes = ({
  notes,
  id,
  audio,
  mapping,
  whiteCount,
}: PianoNotesProps) => {
  const { isMouseDown, ref } = useMouseAndTouchDown<HTMLDivElement>();

  const noteCount =
    whiteCount ?? notes.filter((key) => !key.includes("#")).length;
  const whiteNoteLengthPercent = 100 / noteCount;

  const whiteStyle = {
    width: `${whiteNoteLengthPercent - 0.003}%`,
  };

  const marginStyle = {
    margin: `0 0 0 -${whiteNoteLengthPercent / 4}%`,
  };

  const blackStyle = {
    width: `${whiteNoteLengthPercent / 2}%`,
    ...marginStyle,
  };

  const labelMap = mapping.customKeyMap ?? mapping.keyNoteMap;

  const getClassNames = (note: Pitch) => {
    const isWhite = !note.includes("#");
    const playing = audio.playingNotes?.includes(note) && "playing";
    const isSelected = mapping.selectedNote === note && "selected";
    const isConflict = mapping.conflictNote === note && "conflict";
    const mouseDownClass = isMouseDown && styles[`${isMouseDown}`];

    return [
      styles.note,
      mouseDownClass,
      styles[getPitchClass(note)],
      playing && styles[playing],
      isSelected && styles.selected,
      isConflict && styles.conflict,
      isWhite ? styles.white : styles.black,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const handleMouseDown = (note: Pitch) => {
    if (mapping.editMode) {
      mapping.onNoteSelect?.(note);
    } else {
      audio.start(note);
    }
  };

  const renderNote = (
    note: Pitch,
    index: number,
    noteWhiteStyle = whiteStyle,
    noteBlackStyle = blackStyle,
    noteMarginStyle = marginStyle,
  ) => {
    const isWhite = !note.includes("#");
    const baseNote = getPitchClass(note);
    const keys = Object.keys(labelMap).filter(
      (labelKey) => labelMap[labelKey] === note,
    );
    const applyMargin = index > 0 && !NO_MARGIN_NOTES.includes(baseNote);

    return (
      <div
        key={`${id}-${note}`}
        id={note}
        className={getClassNames(note)}
        style={{
          ...(isWhite && noteWhiteStyle),
          ...(!isWhite && noteBlackStyle),
          ...(applyMargin && noteMarginStyle),
        }}
        onMouseDown={() => handleMouseDown(note)}
        onMouseOver={() =>
          !mapping.editMode && !!isMouseDown && audio.start(note)
        }
        onMouseOut={() =>
          !mapping.editMode && !!isMouseDown && audio.stop(note)
        }
        onBlur={() => audio.stop(note)}
        onMouseUp={() => audio.stop(note)}
        onTouchStart={() => handleMouseDown(note)}
        onTouchEnd={() => audio.stop(note)}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {keys.map((k) => (
            <span
              key={k}
              style={{
                fontSize: 9,
                fontFamily: "ui-monospace, monospace",
                background: isWhite ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)",
                border: isWhite ? "1px solid rgba(0,0,0,0.15)" : "1px solid rgba(255,255,255,0.15)",
                borderRadius: 2,
                padding: "0 2px",
                lineHeight: "14px",
                color: isWhite ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.6)",
              }}
            >
              {k}
            </span>
          ))}
        </div>
        <span
          style={{
            position: "absolute",
            bottom: 3,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 8,
            fontFamily: "ui-monospace, monospace",
            color: "var(--piano-text-muted)",
            pointerEvents: "none",
            lineHeight: 1,
          }}
        >
          {note}
        </span>
      </div>
    );
  };

  return (
    <div ref={ref} className={styles.set}>
      {notes.map((n, i) => renderNote(n, i))}
    </div>
  );
};
