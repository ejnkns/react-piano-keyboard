import { useMemo, useRef, useState, useEffect } from "react";
import { usePiano } from "../hooks/usePiano";
import { PianoNotes } from "./PianoNotes";
import { Controls } from "./Controls";
import { WaveformVisualizer } from "./WaveformVisualizer";
import { Pitch, Oscillator, SetOptions } from "../types";
import styles from "./Piano.module.css";

export type PianoProps = {
  rows?: 1 | 2;
  start?: Pitch | { bottom: Pitch; top?: Pitch };
  end?: Pitch;
  controls?:
    | boolean
    | {
        onClose?: () => void;
        defaultValues?: Partial<SetOptions>;
      };
  waveform?:
    | boolean
    | {
        width?: number;
        height?: number;
        strokeColor?: string;
        backgroundColor?: string;
      };
  audioContext?: AudioContext;
  analyserNode?: AnalyserNode;
  oscillator?: Oscillator;
  gain?: number;
  attack?: number;
  decay?: number;
};

export const Piano = ({
  rows,
  start,
  end,
  controls: controlsProp,
  waveform: waveformProp,
  audioContext,
  analyserNode,
  oscillator,
  gain,
  attack,
  decay,
}: PianoProps) => {
  const showControls = !!controlsProp;
  const showWaveform = !!waveformProp;
  const controlsOverrides =
    typeof controlsProp === "object" ? controlsProp : undefined;
  const waveformOverrides =
    typeof waveformProp === "object" ? waveformProp : undefined;

  const containerRef = useRef<HTMLDivElement>(null);

  // Determine if context is uncontrolled (not supplied by props)
  const isUncontrolled = !audioContext && !analyserNode;

  // Standby (Power) state: default to Off if uncontrolled to prevent autoplay blocks, otherwise On
  const [isOn, setIsOn] = useState(() => !isUncontrolled);
  const [localAudioContext, setLocalAudioContext] = useState<AudioContext | null>(null);
  const [localAnalyserNode, setLocalAnalyserNode] = useState<AnalyserNode | null>(null);

  // Manage the creation, storage, and clean up of local context when powering on/off
  useEffect(() => {
    if (isUncontrolled && isOn) {
      try {
        const DefinedAudioContext =
          window.AudioContext ||
          ("webkitAudioContext" in window && window.webkitAudioContext);
        if (DefinedAudioContext) {
          const ctx = new DefinedAudioContext();
          const analyser = showWaveform ? ctx.createAnalyser() : null;
          setLocalAudioContext(ctx);
          if (analyser) setLocalAnalyserNode(analyser);

          return () => {
            ctx.close().catch((e) => console.warn("Failed to close AudioContext:", e));
            setLocalAudioContext(null);
            setLocalAnalyserNode(null);
          };
        }
      } catch (e) {
        console.error("Failed to initialize AudioContext:", e);
      }
    }
  }, [isUncontrolled, isOn, showWaveform]);

  const effectiveAudioContext = audioContext ?? localAudioContext ?? undefined;
  const effectiveAnalyserNode = analyserNode ?? localAnalyserNode ?? undefined;

  const { notes, rowNotes, defaultMap, audio, mapping, inputProps } = usePiano({
    rows,
    start,
    end,
    audioContext: effectiveAudioContext,
    analyserNode: effectiveAnalyserNode,
    oscillator,
    gain,
    attack,
    decay,
  });

  const handlePowerOn = () => {
    setIsOn(true);
    // Set focus on container to enable keyboard inputs immediately
    setTimeout(() => {
      containerRef.current?.focus();
    }, 50);
  };

  const handlePowerOff = () => {
    setIsOn(false);
    if (controlsOverrides?.onClose) {
      controlsOverrides.onClose();
    }
  };

  const shared = {
    audio: {
      start: audio.start,
      stop: audio.stop,
      playingNotes: audio.playingNotes,
    },
    mapping: {
      keyNoteMap: defaultMap,
      customKeyMap: mapping.keyMap,
      editMode: mapping.editMode,
      selectedNote: mapping.selectedNote,
      conflictNote: mapping.conflictNote,
      onNoteSelect: mapping.selectNote,
    },
  };

  const maxWhiteCount = useMemo(
    () =>
      rowNotes
        ? Math.max(
            rowNotes[0].filter((n) => !n.includes("#")).length,
            rowNotes[1].filter((n) => !n.includes("#")).length,
          )
        : 0,
    [rowNotes],
  );

  return (
    <div
      {...inputProps}
      ref={containerRef}
      tabIndex={0}
      style={{ minWidth: "320px", outline: "none" }}
      className={styles.case}
    >
      {(showControls || showWaveform) && (
        <div className={styles.topPanel}>
          {showControls && (
            <Controls
              set={audio.set}
              defaultValues={audio.controlValues}
              onClose={isUncontrolled ? handlePowerOff : controlsOverrides?.onClose}
              {...controlsOverrides}
            />
          )}
          {showWaveform && (
            <div className={styles.screen}>
              <WaveformVisualizer
                analyserNode={effectiveAnalyserNode}
                {...waveformOverrides}
              />
            </div>
          )}
        </div>
      )}
      <div className={styles.notesWell} style={{ position: "relative" }}>
        {!isOn && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(15, 23, 42, 0.75)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              borderRadius: "0 0 14px 14px",
            }}
          >
            <button
              type="button"
              onClick={handlePowerOn}
              style={{
                background: "var(--piano-accent, #3b82f6)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "bold",
                fontFamily: "ui-monospace, monospace",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
                transition: "transform 0.2s, box-shadow 0.2s",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
              }}
            >
              Start Piano
            </button>
          </div>
        )}
        {rowNotes ? (
          <>
            <PianoNotes
              id="piano-top"
              notes={rowNotes[1]}
              whiteCount={maxWhiteCount}
              {...shared}
            />
            <PianoNotes
              id="piano-bottom"
              notes={rowNotes[0]}
              whiteCount={maxWhiteCount}
              {...shared}
            />
          </>
        ) : (
          <PianoNotes id="piano" notes={notes} {...shared} />
        )}
      </div>
    </div>
  );
};
