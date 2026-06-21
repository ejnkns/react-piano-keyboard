import { useMemo, useState, useEffect } from "react";
import {
  Piano,
  MasterWaveformVisualizer,
} from "react-piano-keyboard";
import { PITCH_CLASSES } from "react-piano-keyboard/music";
import type { Pitches } from "react-piano-keyboard/music";
import type {
  UseMusicNotes,
  Audio,
  ControlSection,
} from "react-piano-keyboard";

const section: React.CSSProperties = {
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const codeBlock: React.CSSProperties = {
  background: "var(--piano-bg-tertiary)",
  border: "1px solid var(--piano-border)",
  borderRadius: 6,
  padding: "12px 16px",
  marginTop: 16,
  overflowX: "auto",
  fontFamily: "ui-monospace, monospace",
  fontSize: 12,
  lineHeight: 1.8,
  color: "var(--piano-text-muted)",
  whiteSpace: "pre",
};

const tag = { color: "var(--piano-accent)" };
const prop = { color: "var(--piano-text-secondary)" };
const punct = { color: "var(--piano-text-muted)" };

const selectStyle: React.CSSProperties = {
  fontFamily: "ui-monospace, monospace",
  fontSize: 12,
  background: "var(--piano-bg-elevated)",
  color: "var(--piano-accent)",
  border: "1px solid var(--piano-border)",
  borderRadius: 3,
  padding: "0 2px",
  cursor: "pointer",
  margin: "0 2px",
};

const btnStyle: React.CSSProperties = {
  fontFamily: "ui-monospace, monospace",
  fontSize: 11,
  padding: "4px 10px",
  cursor: "pointer",
  background: "var(--piano-bg-elevated)",
  color: "var(--piano-text-secondary)",
  border: "1px solid var(--piano-border)",
  borderRadius: 4,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const activeBtn: React.CSSProperties = {
  ...btnStyle,
  background: "var(--piano-accent)",
  color: "var(--piano-bg-tertiary)",
  borderColor: "var(--piano-accent)",
};

type Preset = {
  name: string;
  opts: Partial<Audio.SetOptions>;
};

const PRESETS: Preset[] = [
  {
    name: "Default",
    opts: {
      oscillators: [
        { waveform: "sine", gain: 0.5, detune: 0, octave: 0, pan: 0 },
        { waveform: "sine", gain: 0.5, detune: 0, octave: 0, pan: 0 },
      ],
      gain: 0.5,
      attack: 0.2,
      decay: 0.4,
      sustain: 0.5,
      release: 0.4,
      filterCutoff: 20000,
      filterResonance: 0.1,
      filterType: "lowpass",
      lfoRate: 4,
      lfoDepth: 0,
      lfoTarget: "none",
      lfoWaveform: "sine",
    },
  },
  {
    name: "Warm Pad",
    opts: {
      oscillators: [
        { waveform: "sawtooth", gain: 0.4, detune: 0, octave: 0, pan: 0 },
        { waveform: "sine", gain: 0.4, detune: 1, octave: 0, pan: 0 },
      ],
      gain: 0.4,
      attack: 0.8,
      decay: 0.3,
      sustain: 0.7,
      release: 1.5,
      filterCutoff: 2000,
      filterResonance: 1.5,
      filterType: "lowpass",
      lfoRate: 3,
      lfoDepth: 0.3,
      lfoTarget: "volume",
      lfoWaveform: "sine",
    },
  },
  {
    name: "Filter Sweep",
    opts: {
      oscillators: [
        { waveform: "sawtooth", gain: 0.5, detune: 0, octave: 0, pan: 0 },
        { waveform: "square", gain: 0.3, detune: 0, octave: 0, pan: 0 },
      ],
      gain: 0.45,
      attack: 0.05,
      decay: 0.2,
      sustain: 0.4,
      release: 0.8,
      filterCutoff: 500,
      filterResonance: 6,
      filterType: "lowpass",
      lfoRate: 2,
      lfoDepth: 0.5,
      lfoTarget: "filter",
      lfoWaveform: "sine",
    },
  },
  {
    name: "Pluck",
    opts: {
      oscillators: [
        { waveform: "triangle", gain: 0.5, detune: 0, octave: 0, pan: 0 },
        { waveform: "sine", gain: 0.2, detune: 0, octave: 0, pan: 0 },
      ],
      gain: 0.5,
      attack: 0.01,
      decay: 0.15,
      sustain: 0,
      release: 0.1,
      filterCutoff: 4000,
      filterResonance: 2,
      filterType: "lowpass",
      lfoRate: 4,
      lfoDepth: 0,
      lfoTarget: "none",
      lfoWaveform: "sine",
    },
  },
  {
    name: "Wobble Bass",
    opts: {
      oscillators: [
        { waveform: "square", gain: 0.5, detune: -100, octave: 0, pan: 0 },
        { waveform: "sawtooth", gain: 0.3, detune: -100, octave: 0, pan: 0 },
      ],
      gain: 0.35,
      attack: 0.02,
      decay: 0.1,
      sustain: 0.3,
      release: 0.6,
      filterCutoff: 800,
      filterResonance: 8,
      filterType: "lowpass",
      lfoRate: 6,
      lfoDepth: 0.6,
      lfoTarget: "filter",
      lfoWaveform: "sine",
    },
  },
  {
    name: "Vibrato",
    opts: {
      oscillators: [
        { waveform: "sine", gain: 0.4, detune: 0, octave: 0, pan: 0 },
        { waveform: "triangle", gain: 0.3, detune: 0, octave: 0, pan: 0 },
      ],
      gain: 0.4,
      attack: 0.1,
      decay: 0.2,
      sustain: 0.6,
      release: 0.5,
      filterCutoff: 20000,
      filterResonance: 0.1,
      filterType: "lowpass",
      lfoRate: 5,
      lfoDepth: 0.3,
      lfoTarget: "pitch",
      lfoWaveform: "sine",
    },
  },
];

function PresetBar({ set }: { set: UseMusicNotes["set"] }) {
  const [active, setActive] = useState("Default");
  return (
    <div
      style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "8px 0" }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "var(--piano-text-muted)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          padding: "4px 0",
          fontFamily: "ui-monospace, monospace",
        }}
      >
        Presets:
      </span>
      {PRESETS.map((p) => (
        <button
          key={p.name}
          type="button"
          style={active === p.name ? activeBtn : btnStyle}
          onClick={() => {
            setActive(p.name);
            set(p.opts);
          }}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}

function PitchSelect({
  note,
  octave,
  onNoteChange,
  onOctaveChange,
  octaveMin = 0,
  octaveMax = 5,
}: {
  note: string;
  octave: number;
  onNoteChange: (n: string) => void;
  onOctaveChange: (o: number) => void;
  octaveMin?: number;
  octaveMax?: number;
}) {
  const octaves = Array.from(
    { length: octaveMax - octaveMin + 1 },
    (_, i) => i + octaveMin,
  );
  return (
    <span style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
      <select
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        style={selectStyle}
      >
        {PITCH_CLASSES.map((n: string) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <select
        value={octave}
        onChange={(e) => onOctaveChange(Number(e.target.value))}
        style={selectStyle}
      >
        {octaves.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </span>
  );
}

const CONTROL_SECTIONS: ControlSection[] = [
  "Presets",
  "Oscillators",
  "ADSR Envelope",
  "Filter",
  "LFO",
  "Analog Clip",
];

function InteractiveExample() {
  const [rows, setRows] = useState<1 | 2>(2);
  // rows=2
  const [startBottomNote, setStartBottomNote] = useState("C");
  const [startBottomOctave, setStartBottomOctave] = useState(3);
  const [startTopNote, setStartTopNote] = useState("C");
  const [startTopOctave, setStartTopOctave] = useState(4);
  // rows=1
  const [startNote, setStartNote] = useState("C");
  const [startOctave, setStartOctave] = useState(2);
  const [endNote, setEndNote] = useState("D");
  const [endOctave, setEndOctave] = useState(5);

  const [showControls, setShowControls] = useState(true);
  const [showWaveform, setShowWaveform] = useState(true);
  const [sectionVis, setSectionVis] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CONTROL_SECTIONS.map((s) => [s, true])),
  );

  const start = `${startNote}${startOctave}` as Pitches.Pitch;
  const startBottom = `${startBottomNote}${startBottomOctave}` as Pitches.Pitch;
  const startTop = `${startTopNote}${startTopOctave}` as Pitches.Pitch;
  const end = `${endNote}${endOctave}` as Pitches.Pitch;

  const allOn = CONTROL_SECTIONS.every((s) => sectionVis[s]);
  const controlsProp = !showControls
    ? false
    : allOn
      ? true
      : { sections: sectionVis as Record<ControlSection, boolean> };

  const toggleSection = (s: string) =>
    setSectionVis((p) => ({ ...p, [s]: !p[s] }));

  return (
    <section style={section}>
      <div style={codeBlock}>
        <span style={punct}>&lt;</span>
        <span style={tag}>Piano</span>
        <br />
        <span style={prop}> rows</span>
        <span style={punct}>{"={"}</span>
        <select
          value={rows}
          onChange={(e) => setRows(Number(e.target.value) as 1 | 2)}
          style={selectStyle}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select>
        <span style={punct}>{"}"}</span>
        <br />
        {rows === 1 ? (
          <>
            <span style={prop}> start</span>
            <span style={punct}>{'="'}</span>
            <PitchSelect
              note={startNote}
              octave={startOctave}
              onNoteChange={setStartNote}
              onOctaveChange={setStartOctave}
            />
            <span style={punct}>{'"}'}</span>
          </>
        ) : (
          <>
            <span style={prop}> start</span>
            <span style={punct}>{'={{ bottom: "'}</span>
            <PitchSelect
              note={startBottomNote}
              octave={startBottomOctave}
              onNoteChange={setStartBottomNote}
              onOctaveChange={setStartBottomOctave}
            />
            <span style={punct}>{'", top: "'}</span>
            <PitchSelect
              note={startTopNote}
              octave={startTopOctave}
              onNoteChange={setStartTopNote}
              onOctaveChange={setStartTopOctave}
            />
            <span style={punct}>{'" }}'}</span>
          </>
        )}
        {rows === 1 && (
          <>
            <br />
            <span style={prop}> end</span>
            <span style={punct}>{'="'}</span>
            <PitchSelect
              note={endNote}
              octave={endOctave}
              onNoteChange={setEndNote}
              onOctaveChange={setEndOctave}
            />
            <span style={punct}>{'"}'}</span>
          </>
        )}
        <br />
        <span style={prop}> controls</span>
        <span style={punct}>{"={"}</span>
        <input
          type="checkbox"
          checked={showControls}
          onChange={(e) => setShowControls(e.target.checked)}
          style={{ accentColor: "var(--piano-accent)", cursor: "pointer" }}
        />
        {showControls && (
          <span
            style={{
              ...(punct as React.CSSProperties),
              display: "inline-flex",
              gap: 4,
              alignItems: "center",
            }}
          >
            <span>{"{"}</span>
            <span style={prop}>sections</span>
            <span style={punct}>{"={"}</span>
            <span style={punct}>{"{{ "}</span>
            {CONTROL_SECTIONS.map((s, i) => (
              <span key={s}>
                <span style={prop}>{s}</span>
                <span style={punct}>: </span>
                <span
                  onClick={() => toggleSection(s)}
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 10,
                    cursor: "pointer",
                    color: sectionVis[s]
                      ? "var(--piano-accent)"
                      : "var(--piano-text-muted)",
                  }}
                >
                  {sectionVis[s] ? "true" : "false"}
                </span>
                {i < CONTROL_SECTIONS.length - 1 && (
                  <span style={punct}>{", "}</span>
                )}
              </span>
            ))}
            <span style={punct}>{" }}"}</span>
            <span style={punct}>{"}"}</span>
            <span style={punct}>{"}"}</span>
          </span>
        )}
        <span style={punct}>{"}"}</span>
        <br />
        <span style={prop}> waveform</span>
        <span style={punct}>{"={"}</span>
        <input
          type="checkbox"
          checked={showWaveform}
          onChange={(e) => setShowWaveform(e.target.checked)}
          style={{ accentColor: "var(--piano-accent)", cursor: "pointer" }}
        />
        <span style={punct}>{"}"}</span>
        <br />
        <span style={punct}>&gt;</span>
      </div>
      <Piano
        rows={rows}
        start={rows === 1 ? start : { bottom: startBottom, top: startTop }}
        end={rows === 1 ? end : undefined}
        controls={controlsProp}
        waveform={showWaveform}
      />
    </section>
  );
}

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const bgColor = theme === "dark" ? "#000" : "#fff";

  return (
    <div
      style={{
        background: bgColor,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: 32,
          maxWidth: 2160,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          minHeight: "100vh",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--piano-accent)",
              letterSpacing: "0.1em",
              margin: 0,
            }}
          >
            <a
              href="https://github.com/ejnkns/react-piano-keyboard"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              react-piano-keyboard
            </a>
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <label
              style={{
                fontSize: 12,
                fontFamily: "ui-monospace, monospace",
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "var(--piano-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              accent
              <input
                type="color"
                defaultValue="#3b82f6"
                onChange={(e) =>
                  document.documentElement.style.setProperty(
                    "--piano-accent",
                    e.target.value,
                  )
                }
                style={{
                  width: 28,
                  height: 28,
                  border: "2px solid var(--piano-accent)",
                  borderRadius: 4,
                  cursor: "pointer",
                  padding: 0,
                  background: "none",
                }}
              />
            </label>
            <button
              onClick={toggleTheme}
              style={{
                fontSize: 12,
                fontFamily: "ui-monospace, monospace",
                padding: "6px 12px",
                cursor: "pointer",
                background: "var(--piano-bg-elevated)",
                color: "var(--piano-text-secondary)",
                border: "1px solid var(--piano-border)",
                borderRadius: 4,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
          </div>
        </header>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            flex: 1,
          }}
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <InteractiveExample />
          </div>
        </div>
      </div>
    </div>
  );
}
