import { Pitches } from "@react-piano-keyboard/music";
import { useMouseAndTouchDown } from "./notes/use-mouse-down";

type AudioProps = {
  start: (note: Pitches.Pitch) => void;
  stop: (note: Pitches.Pitch) => void;
  playingNotes?: Pitches.Pitch[];
};

type MappingProps = {
  keyNoteMap: Record<string, Pitches.Pitch>;
  customKeyMap?: Record<string, Pitches.Pitch>;
  editMode?: boolean;
  selectedNote?: Pitches.Pitch | null;
  conflictNote?: Pitches.Pitch | null;
  onNoteSelect?: (note: Pitches.Pitch) => void;
};

export type PianoNotesProps = {
  id: string;
  notes: Pitches.Pitch[];
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
  const whiteKeyWidth = 100 / noteCount;
  const blackKeyWidth = whiteKeyWidth * 0.55;

  const blackKeyPositions = new Map<Pitches.Pitch, string>();
  {
    let whiteSeen = 0;
    for (const note of notes) {
      if (!note.includes("#")) {
        whiteSeen++;
      } else {
        const left = whiteSeen * whiteKeyWidth - blackKeyWidth / 2;
        blackKeyPositions.set(note, `${left}%`);
      }
    }
  }

  const labelMap = mapping.customKeyMap ?? mapping.keyNoteMap;

  const getClassNames = (note: Pitches.Pitch) => {
    const isWhite = !note.includes("#");
    const playing = audio.playingNotes?.includes(note);
    const isSelected = mapping.selectedNote === note;
    const isConflict = mapping.conflictNote === note;

    const classes = [
      "piano-note box-border m-0 p-0",
      isWhite
        ? "piano-white flex-1 relative z-[1] h-[16em] border-l border-b rounded-b-[5px]"
        : "piano-black absolute z-[2] h-[8em] border rounded-b-[3px] top-0",
      playing && (isWhite ? "piano-white-playing" : "piano-black-playing"),
      isSelected && "outline-[3px] outline-piano-keyboard-accent outline-offset-[-1px]",
      isConflict && `outline-[3px] outline-red-500 outline-offset-[-1px] ${isWhite ? "bg-piano-keyboard-conflict-white" : "bg-piano-keyboard-conflict-black"}`,
    ];

    return classes.filter(Boolean).join(" ");
  };

  const handleMouseDown = (note: Pitches.Pitch) => {
    if (mapping.editMode) {
      mapping.onNoteSelect?.(note);
    } else {
      audio.start(note);
    }
  };

  const renderNote = (note: Pitches.Pitch) => {
    const isWhite = !note.includes("#");
    const keys = Object.keys(labelMap).filter(
      (labelKey) => labelMap[labelKey] === note,
    );

    return (
      <div
        key={`${id}-${note}`}
        id={note}
        className={getClassNames(note)}
        style={!isWhite ? { left: blackKeyPositions.get(note), width: `${blackKeyWidth}%` } : undefined}
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
        <div className="flex justify-center gap-0.5">
          {keys.map((k) => (
            <span
              key={k}
              className="text-[9px] font-mono rounded px-[2px] leading-[14px]"
              style={{
                background: isWhite ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)",
                border: isWhite ? "1px solid rgba(0,0,0,0.15)" : "1px solid rgba(255,255,255,0.15)",
                color: isWhite ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.6)",
              }}
            >
              {k}
            </span>
          ))}
        </div>
        <span className="absolute bottom-[3px] left-0 right-0 text-center text-[8px] font-mono text-piano-keyboard-text-muted pointer-events-none leading-none">
          {note}
        </span>
      </div>
    );
  };

  return (
    <div ref={ref} className="piano-set relative flex rounded-[5px] shadow-piano-keyboard-case w-full">
      {notes.map((n) => renderNote(n))}
    </div>
  );
};
