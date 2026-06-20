import { useRef, useEffect, useState, useMemo } from "react";
import { pitchToFrequency } from "@react-piano-keyboard/shared";

const fmt = (v: number) => v.toFixed(2) + "s";

const MIN_FREQ = 32;
const MAX_FREQ = 4200;
const MIN_OPACITY = 0.2;

type NoteRange = { min: string; max: string };

type Envelope = {
  gain: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

type EnvelopeEntry = {
  note: string;
  noteOnAt: number;
  noteOffAt: number | null;
  releaseAtStop?: number;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function freqOpacity(freq: number, minFreq: number, maxFreq: number): number {
  const norm =
    (Math.log2(freq) - Math.log2(minFreq)) /
    (Math.log2(maxFreq) - Math.log2(minFreq));
  return Math.min(1, Math.max(MIN_OPACITY, MIN_OPACITY + norm * (1 - MIN_OPACITY)));
}

function computeDotPos(
  entry: EnvelopeEntry,
  p: { attack: number; decay: number; sustain: number; release: number },
  l: { x0: number; x1: number; x2: number; x3: number; x4: number; yTop: number; yBot: number; sustainY: number },
  now: number,
): { x: number; y: number } | null {
  if (entry.noteOffAt !== null) {
    const releaseDur = entry.releaseAtStop ?? p.release;
    const re = (now - entry.noteOffAt) / 1000;
    const rp = Math.min(re / releaseDur, 1);
    const x = lerp(l.x3, l.x4, rp);
    const y = lerp(l.sustainY, l.yBot, rp);
    return rp >= 1 ? null : { x, y };
  }

  const elapsed = (now - entry.noteOnAt) / 1000;

  if (elapsed < p.attack) {
    const t = elapsed / p.attack;
    return { x: lerp(l.x0, l.x1, t), y: lerp(l.yBot, l.yTop, t) };
  }

  if (elapsed < p.attack + p.decay) {
    const t = (elapsed - p.attack) / p.decay;
    return { x: lerp(l.x1, l.x2, t), y: lerp(l.yTop, l.sustainY, t) };
  }

  return { x: l.x3, y: l.sustainY };
}

export const AdsrVisualizer = ({
  gain,
  attack,
  decay,
  sustain,
  release,
  activity,
  noteRange,
}: Envelope & { activity?: Record<number, EnvelopeEntry>; noteRange?: NoteRange }) => {
  const w = 330;
  const h = 150;
  const pad = { t: 6, r: 14, b: 18, l: 22 };
  const pw = w - pad.l - pad.r;
  const ph = h - pad.t - pad.b;

  const holdTime = 0.3;
  const totalTime = attack + decay + holdTime + release;
  const toX = (t: number) => pad.l + (t / totalTime) * pw;

  const x0 = pad.l;
  const x1 = toX(attack);
  const x2 = toX(attack + decay);
  const x3 = toX(attack + decay + holdTime);
  const x4 = pad.l + pw;

  const yTop = pad.t;
  const yBot = pad.t + ph;
  const toY = (v: number) => yBot - v * ph;
  const sustainY = toY(sustain);

  const pts = [
    `${x0},${yBot}`,
    `${x1},${yTop}`,
    `${x2},${sustainY}`,
    `${x3},${sustainY}`,
    `${x4},${yBot}`,
  ];

  const gridLines = [0.25, 0.5, 0.75].map((f) => ({
    y: toY(f),
    label: f,
  }));

  const gainY = toY(Math.min(gain, 1));

  const phaseTicks = [
    { x: x1, time: attack },
    { x: x2, time: attack + decay },
    { x: x3, time: attack + decay + holdTime },
    { x: x4, time: totalTime },
  ];

  const tickCount = 4;
  const evenTicks = Array.from({ length: tickCount - 1 }, (_, i) => {
    const t = (totalTime / tickCount) * (i + 1);
    return { x: toX(t), t };
  });

  const activityRef = useRef(activity);
  activityRef.current = activity;

  const minFreq = useMemo(() => {
    if (!noteRange) return 32;
    try { return pitchToFrequency(noteRange.min as any); } catch { return 32; }
  }, [noteRange?.min]);
  const maxFreq = useMemo(() => {
    if (!noteRange) return 4200;
    try { return pitchToFrequency(noteRange.max as any); } catch { return 4200; }
  }, [noteRange?.max]);

  const [dots, setDots] = useState<Record<string, { x: number; y: number; opacity: number; key: number }>>({});
  const dotKeysRef = useRef<Record<string, number>>({});
  const dotTimestampsRef = useRef<Record<string, number>>({});
  const dotKeyCounter = useRef(0);

  useEffect(() => {
    let rafId: number;

    const tick = () => {
      const entries = activityRef.current;
      const newDots: Record<string, { x: number; y: number; opacity: number; key: number }> = {};

      if (entries) {
        for (const [voiceId, entry] of Object.entries(entries)) {
          const pos = computeDotPos(
            entry,
            { attack, decay, sustain, release },
            { x0, x1, x2, x3, x4, yTop, yBot, sustainY },
            performance.now(),
          );
          if (pos) {
            if (!dotKeysRef.current[voiceId] || dotTimestampsRef.current[voiceId] !== entry.noteOnAt) {
              dotKeysRef.current[voiceId] = ++dotKeyCounter.current;
              dotTimestampsRef.current[voiceId] = entry.noteOnAt;
            }
            let freq: number;
            try { freq = pitchToFrequency(entry.note as any); } catch { freq = 440; }
            newDots[voiceId] = {
              ...pos,
              opacity: freqOpacity(freq, minFreq, maxFreq),
              key: dotKeysRef.current[voiceId],
            };
          } else {
            delete dotKeysRef.current[voiceId];
            delete dotTimestampsRef.current[voiceId];
          }
        }
      }

      for (const voiceId of Object.keys(dotKeysRef.current)) {
        if (!newDots[voiceId]) {
          delete dotKeysRef.current[voiceId];
          delete dotTimestampsRef.current[voiceId];
        }
      }

      setDots(newDots);

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [attack, decay, sustain, release, x0, x1, x2, x3, x4, yTop, yBot, sustainY]);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        rx={4}
        fill="var(--piano-bg-tertiary)"
      />

      {gridLines.map(({ y, label }) => (
        <g key={label}>
          <line
            x1={pad.l}
            y1={y}
            x2={pad.l + pw}
            y2={y}
            stroke="var(--piano-border-strong)"
            strokeWidth={0.5}
            opacity={0.3}
          />
          <text
            x={pad.l - 2}
            y={y + 2}
            textAnchor="end"
            fill="var(--piano-text-muted)"
            fontSize={6}
            fontFamily="ui-monospace, monospace"
          >
            {label}
          </text>
        </g>
      ))}

      <line
        x1={x0}
        y1={gainY}
        x2={x4}
        y2={gainY}
        stroke="var(--piano-accent)"
        strokeWidth={1}
        strokeDasharray="4,3"
        opacity={0.6}
      />
      <text
        x={x4 - 2}
        y={gainY - 2}
        textAnchor="end"
        fill="var(--piano-accent)"
        fontSize={7}
        fontFamily="ui-monospace, monospace"
        opacity={0.8}
      >
        Gain {gain.toFixed(2)}
      </text>

      {phaseTicks.map(({ x, time }) => (
        <g key={`phase-${time}`}>
          <line
            x1={x}
            y1={yBot}
            x2={x}
            y2={yBot + 4}
            stroke="var(--piano-text-muted)"
            strokeWidth={0.5}
          />
          <text
            x={x}
            y={yBot + 12}
            textAnchor="middle"
            fill="var(--piano-text-muted)"
            fontSize={6}
            fontFamily="ui-monospace, monospace"
          >
            {fmt(time)}
          </text>
        </g>
      ))}

      {evenTicks.map(({ x, t }) => (
        <line
          key={`tick-${t}`}
          x1={x}
          y1={yBot}
          x2={x}
          y2={yBot + 3}
          stroke="var(--piano-border-strong)"
          strokeWidth={0.5}
          opacity={0.4}
        />
      ))}

      {attack > 0 && (
        <line
          x1={x1}
          y1={yTop}
          x2={x1}
          y2={yBot}
          stroke="var(--piano-accent)"
          strokeWidth={0.5}
          opacity={0.25}
          strokeDasharray="2,2"
        />
      )}
      {release > 0 && (
        <line
          x1={x3}
          y1={sustainY}
          x2={x3}
          y2={yBot}
          stroke="var(--piano-accent)"
          strokeWidth={0.5}
          opacity={0.25}
          strokeDasharray="2,2"
        />
      )}

      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="var(--piano-accent)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      <circle cx={x1} cy={yTop} r={2.5} fill="var(--piano-accent)" />
      <circle cx={x2} cy={sustainY} r={2.5} fill="var(--piano-accent)" />
      <circle cx={x3} cy={sustainY} r={2.5} fill="var(--piano-accent)" />

      {Object.entries(dots).map(([note, { x, y, opacity, key }]) => (
        <circle
          key={key}
          cx={x}
          cy={y}
          r={3}
          fill="var(--piano-accent)"
          fillOpacity={opacity}
          stroke="var(--piano-accent)"
          strokeWidth={1.5}
          strokeOpacity={0.7}
        >
          <animate attributeName="r" values="0;3" dur="150ms" fill="freeze" />
          <animate attributeName="fill-opacity" values={`0;${opacity}`} dur="50ms" fill="freeze" />
          <animate attributeName="stroke-opacity" values={`0;0.7`} dur="50ms" fill="freeze" />
        </circle>
      ))}
    </svg>
  );
};
