import { useState, useEffect } from "react";
import "./react-piano-keyboard.css";
import { usePiano } from "./use-piano";
import {
  PianoKeyboard,
  type PianoKeyboardInputMode,
} from "@react-piano-keyboard/piano-keyboard";
import {
  Controls,
  type ControlSection,
  type SetFn,
  WaveformVisualizer,
} from "@react-piano-keyboard/controls";
import type { Pitches } from "@react-piano-keyboard/music";
import type {
  Audio,
  LfoTarget,
  OscillatorConfig,
} from "@react-piano-keyboard/audio";

export namespace Piano {
  export type Props = {
    rows?: 1 | 2;
    start?: Pitches.Pitch | { bottom: Pitches.Pitch; top?: Pitches.Pitch };
    end?: Pitches.Pitch;
    keyboardInput?: PianoKeyboardInputMode;
    controls?:
      | boolean
      | {
          onClose?: () => void;
          defaultValues?: Partial<Audio.SetOptions>;
          sections?: Partial<Record<ControlSection, boolean>>;
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
    oscillatorCount?: 1 | 2;
    oscillators?: OscillatorConfig[];
    gain?: number;
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
    filterCutoff?: number;
    filterResonance?: number;
    filterType?: BiquadFilterType;
    lfoRate?: number;
    lfoDepth?: number;
    lfoTarget?: LfoTarget;
    lfoWaveform?: OscillatorType;
  };
}

export function Piano({
  rows,
  start,
  end,
  keyboardInput = "global",
  controls: controlsProp,
  waveform: waveformProp,
  audioContext,
  analyserNode,
  oscillatorCount,
  oscillators,
  gain,
  attack,
  decay,
  sustain,
  release,
  filterCutoff,
  filterResonance,
  filterType,
  lfoRate,
  lfoDepth,
  lfoTarget,
  lfoWaveform,
}: Piano.Props) {
  const showControls = !!controlsProp;
  const showWaveform = !!waveformProp;
  const controlsOverrides =
    typeof controlsProp === "object" ? controlsProp : undefined;
  const waveformOverrides =
    typeof waveformProp === "object" ? waveformProp : undefined;

  const isUncontrolled = !audioContext && !analyserNode;

  const [isOn, setIsOn] = useState(false);
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

  const { layout, audio, mapping } = usePiano({
    rows,
    start,
    end,
    audioContext: effectiveAudioContext,
    analyserNode: effectiveAnalyserNode,
    enabled: isOn,
    oscillatorCount,
    oscillators,
    gain,
    attack,
    decay,
    sustain,
    release,
    filterCutoff,
    filterResonance,
    filterType,
    lfoRate,
    lfoDepth,
    lfoTarget,
    lfoWaveform,
  });

  const handlePowerOn = () => {
    setIsOn(true);
  };

  const handlePowerOff = () => {
    setIsOn(false);
    if (controlsOverrides?.onClose) {
      controlsOverrides.onClose();
    }
  };

  return (
    <div
      className="piano bg-piano-bg-primary border border-piano-bg-tertiary rounded-[14px] overflow-hidden"
      style={{
        minWidth: "320px",
        ...(isOn
          ? {}
          : ({
              "--piano-accent": "var(--piano-accent-off)",
              "--color-piano-accent": "var(--piano-accent-off)",
            } as React.CSSProperties)),
      }}
    >
      <div className="bg-piano-controls-bg">
        <div
          onClick={isOn ? handlePowerOff : handlePowerOn}
          title={isOn ? "Power Off" : "Power On"}
          className="piano-power-button w-[34px] h-[34px] rounded-full cursor-pointer select-none flex items-center justify-center border-2 border-piano-power-border box-border bg-piano-power-bg shadow-[var(--power-shadow)] transition-all duration-[0.12s] active:bg-piano-power-bg-active active:shadow-[var(--power-shadow-active)]"
          style={
            {
              "--power-bg": isOn
                ? "radial-gradient(circle at 35% 35%, #ff4444, #aa0000)"
                : "radial-gradient(circle at 35% 35%, #555, #222)",
              "--power-border": isOn ? "#ff6666" : "#444",
              "--power-shadow": isOn
                ? "0 0 8px #ff0000, 0 0 20px rgba(255,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.15)"
                : "0 1px 3px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.08)",
              "--power-bg-active": isOn
                ? "radial-gradient(circle at 35% 35%, #cc3333, #880000)"
                : "radial-gradient(circle at 35% 35%, #444, #1a1a1a)",
              "--power-shadow-active": isOn
                ? "inset 0 2px 6px rgba(0,0,0,0.6), 0 0 6px #ff0000"
                : "inset 0 2px 6px rgba(0,0,0,0.6)",
            } as React.CSSProperties
          }
        >
          <svg
            viewBox="0 0 24 24"
            width={16}
            height={16}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <path d="M12 2v10" stroke={isOn ? "#fff" : "#888"} />
            <path d="M6 7a8 8 0 1 0 12 0" stroke={isOn ? "#fff" : "#888"} />
          </svg>
        </div>
        {(showControls || showWaveform) && showControls && (
          <Controls
            set={audio.set as SetFn}
            defaultValues={audio.controlValues}
            envelopeActivity={audio.envelopeActivity}
            noteRange={layout.noteRange}
            onClose={
              isUncontrolled ? handlePowerOff : controlsOverrides?.onClose
            }
            {...controlsOverrides}
          />
        )}
        {showWaveform && (
          <div className="piano-screen bg-piano-waveform-container-bg p-3">
            <WaveformVisualizer analyserNode={effectiveAnalyserNode} />
          </div>
        )}
      </div>

      <div className="piano-notes-well bg-piano-notes-well-bg px-3">
        <PianoKeyboard
          rows={rows}
          start={start}
          end={end}
          onNoteOn={audio.start}
          onNoteOff={audio.stop}
          playingNotes={audio.playingNotes}
          keyMap={mapping.keyMap}
          editMode={mapping.editMode}
          onAssignKey={mapping.assignKey}
          selectedNote={mapping.selectedNote}
          conflictNote={mapping.conflictNote}
          onNoteSelect={mapping.selectNote}
          keyboardInput={isOn ? keyboardInput : false}
        />
      </div>
    </div>
  );
}

export { usePiano } from "./use-piano";
export type { UsePianoOptions } from "./use-piano";
