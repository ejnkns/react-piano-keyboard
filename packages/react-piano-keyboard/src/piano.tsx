import { useMemo, useRef, useState, useEffect } from "react";
import { usePiano } from "./use-piano";
import { PianoNotes } from "./piano/notes";
import { Controls } from "./piano/controls";
import { WaveformVisualizer } from "./piano/waveform-visualizer";
import { Pitch, Oscillator, SetOptions } from "./types";
import styles from "./piano/piano.module.css";

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

  const isUncontrolled = !audioContext && !analyserNode;

  const [isOn, setIsOn] = useState(() => !isUncontrolled);
  const [localAudioContext, setLocalAudioContext] =
    useState<AudioContext | null>(null);
  const [localAnalyserNode, setLocalAnalyserNode] =
    useState<AnalyserNode | null>(null);

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
            ctx
              .close()
              .catch((e) => console.warn("Failed to close AudioContext:", e));
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
      style={{
        minWidth: "320px",
        outline: "none",
        ...(isOn
          ? {}
          : ({
              "--piano-accent": "var(--piano-accent-off)",
            } as React.CSSProperties)),
      }}
      className={styles.case}
    >
      {(showControls || showWaveform) && (
        <div className={styles.topPanel}>
          {showControls && (
            <Controls
              set={audio.set}
              defaultValues={audio.controlValues}
              onClose={
                isUncontrolled ? handlePowerOff : controlsOverrides?.onClose
              }
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
      <div className={styles.notesWell}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "4px 8px 0 0",
            marginBottom: -4,
            position: "relative",
            zIndex: 5,
          }}
        >
          <div
            onClick={isOn ? handlePowerOff : handlePowerOn}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              userSelect: "none",
              padding: "4px 8px",
              borderRadius: 4,
              background: isOn ? "rgba(220, 38, 38, 0.15)" : "transparent",
              transition: "background 0.2s",
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontFamily: "ui-monospace, monospace",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: isOn
                  ? "var(--piano-text-muted, #8a8a8a)"
                  : "var(--piano-text-muted, #555)",
                textTransform: "uppercase",
              }}
            >
              Power
            </span>
            <div
              style={{
                position: "relative",
                width: 36,
                height: 18,
                borderRadius: 9,
                background: isOn ? "var(--piano-accent, #3b82f6)" : "#555",
                transition: "background 0.3s",
                boxShadow: isOn
                  ? "inset 0 1px 3px rgba(0,0,0,0.3)"
                  : "inset 0 1px 3px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 2,
                  left: isOn ? 18 : 2,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: isOn ? "#fff" : "#ccc",
                  transition: "left 0.25s, background 0.25s",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
                }}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            opacity: isOn ? 1 : 0.4,
            transition: "opacity 0.3s",
            pointerEvents: isOn ? "auto" : "none",
          }}
        >
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
    </div>
  );
};
