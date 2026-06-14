import { useMemo, useState, useEffect } from "react";
import {
  Piano,
  PianoNotes,
  Controls,
  WaveformVisualizer,
  usePiano,
  useAudioContext,
  pitchToIndex,
  indexToPitch,
} from "react-piano-keyboard";
import type { Pitch } from "react-piano-keyboard";

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

function InteractiveExample() {
  const [rows, setRows] = useState<1 | 2>(2);
  const [start, setStart] = useState<string>("C3");
  const [startBottom, setStartBottom] = useState<string>("C3");
  const [startTop, setStartTop] = useState<string>("C4");
  const [end, setEnd] = useState<string>("C5");
  const [showControls, setShowControls] = useState(true);
  const [showWaveform, setShowWaveform] = useState(true);

  const pitches = useMemo(() => {
    const result: string[] = [];
    const startIdx = pitchToIndex("C2" as Pitch);
    for (let i = 0; i < 48; i++) {
      const p = indexToPitch(startIdx + i);
      if (p) result.push(p);
    }
    return result;
  }, []);

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
            <select
              value={start}
              onChange={(e) => setStart(e.target.value)}
              style={selectStyle}
            >
              {pitches.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <span style={punct}>{'"}'}</span>
          </>
        ) : (
          <>
            <span style={prop}> start</span>
            <span style={punct}>{'={{ bottom: "'}</span>
            <select
              value={startBottom}
              onChange={(e) => setStartBottom(e.target.value)}
              style={selectStyle}
            >
              {pitches.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <span style={punct}>{'", top: "'}</span>
            <select
              value={startTop}
              onChange={(e) => setStartTop(e.target.value)}
              style={selectStyle}
            >
              {pitches.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <span style={punct}>{'" }}'}</span>
          </>
        )}
        {rows === 1 && (
          <>
            <br />
            <span style={prop}> end</span>
            <span style={punct}>{'="'}</span>
            <select
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              style={selectStyle}
            >
              {pitches.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
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
        start={
          rows === 1
            ? (start as Pitch)
            : { bottom: startBottom as Pitch, top: startTop as Pitch }
        }
        end={rows === 1 ? (end as Pitch) : undefined}
        controls={showControls}
        waveform={showWaveform}
      />
    </section>
  );
}

function HookWithPianoNotes() {
  const audioContext = useAudioContext();
  const analyser = useMemo(
    () => audioContext?.createAnalyser(),
    [audioContext],
  );

  const { notes, defaultMap, audio, mapping, inputProps } = usePiano({
    rows: 2,
    start: "C3",
    analyserNode: analyser,
  });

  if (!audioContext) {
    return (
      <section style={section}>
        <p
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 12,
            color: "var(--piano-text-muted)",
          }}
        >
          Loading...
        </p>
      </section>
    );
  }

  return (
    <section style={section}>
      <div style={codeBlock}>
        <pre
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 12,
            lineHeight: 1.6,
            color: "var(--piano-text-muted)",
            whiteSpace: "pre",
            tabSize: 2,
            margin: 0,
          }}
        >
          <code>{`const { notes, audio, mapping, inputProps } = usePiano({
  rows: 2,
  start: "C3",
  analyserNode: analyser,
})

return (
  <PianoNotes
    id="piano3"
    notes={notes}
    audio={audio}
    mapping={mapping}
    {...inputProps}
  />
)`}</code>
        </pre>
      </div>
      <Controls set={audio.set} defaultValues={audio.controlValues} />
      <div style={{ marginTop: 12 }}>
        <WaveformVisualizer analyserNode={analyser} height={120} />
      </div>
      <div
        {...inputProps}
        tabIndex={0}
        style={{ minWidth: "320px", marginTop: 12 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 4,
          }}
        >
          <button
            onClick={mapping.toggleEditMode}
            style={{
              padding: "4px 10px",
              fontSize: 12,
              fontFamily: "ui-monospace, monospace",
              cursor: "pointer",
              background: mapping.editMode
                ? "var(--piano-accent)"
                : "var(--piano-bg-elevated)",
              color: mapping.editMode
                ? "var(--piano-bg-tertiary)"
                : "var(--piano-text-secondary)",
              border: "none",
              borderRadius: 4,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {mapping.editMode ? "Editing Keys" : "Edit Keys"}
          </button>
        </div>
        {mapping.editMode && (
          <div
            style={{
              fontSize: 11,
              fontFamily: "ui-monospace, monospace",
              color: "var(--piano-text-muted)",
              marginBottom: 4,
            }}
          >
            Click a piano key, then press a computer key to map it
          </div>
        )}
        <PianoNotes
          id="piano3"
          notes={notes}
          audio={{
            start: audio.start,
            stop: audio.stop,
            playingNotes: audio.playingNotes,
          }}
          mapping={{
            keyNoteMap: defaultMap,
            customKeyMap: mapping.keyMap,
            editMode: mapping.editMode,
            selectedNote: mapping.selectedNote,
            conflictNote: mapping.conflictNote,
            onNoteSelect: mapping.selectNote,
          }}
        />
      </div>
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
          maxWidth: 1400,
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
            react-piano-keyboard
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
          <div>
            <HookWithPianoNotes />
          </div>
        </div>
      </div>
    </div>
  );
}
