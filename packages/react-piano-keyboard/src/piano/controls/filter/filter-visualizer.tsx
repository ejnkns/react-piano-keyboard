import { useMemo } from "react";

const FS = 44100;
const POINTS = 120;
const MIN_FREQ = 20;
const MAX_FREQ = 22050;
const MIN_DB = -36;
const MAX_DB = 6;

type FilterVisualizerProps = {
  filterType: BiquadFilterType;
  cutoff: number;
  resonance: number;
};

function biquadCoeffs(
  type: BiquadFilterType,
  cutoff: number,
  Q: number,
  gainDb: number,
) {
  const w0 = (2 * Math.PI * cutoff) / FS;
  const cosW = Math.cos(w0);
  const sinW = Math.sin(w0);
  const alpha = sinW / (2 * Q);
  const A = Math.pow(10, gainDb / 40);
  const twoSqrtA = 2 * Math.sqrt(A);

  switch (type) {
    case "lowpass": {
      const b0 = (1 - cosW) / 2;
      return {
        b0,
        b1: 1 - cosW,
        b2: b0,
        a0: 1 + alpha,
        a1: -2 * cosW,
        a2: 1 - alpha,
      };
    }
    case "highpass": {
      const b0 = (1 + cosW) / 2;
      return {
        b0,
        b1: -(1 + cosW),
        b2: b0,
        a0: 1 + alpha,
        a1: -2 * cosW,
        a2: 1 - alpha,
      };
    }
    case "bandpass": {
      return {
        b0: alpha,
        b1: 0,
        b2: -alpha,
        a0: 1 + alpha,
        a1: -2 * cosW,
        a2: 1 - alpha,
      };
    }
    case "notch": {
      return {
        b0: 1,
        b1: -2 * cosW,
        b2: 1,
        a0: 1 + alpha,
        a1: -2 * cosW,
        a2: 1 - alpha,
      };
    }
    case "allpass": {
      return {
        b0: 1 - alpha,
        b1: -2 * cosW,
        b2: 1 + alpha,
        a0: 1 + alpha,
        a1: -2 * cosW,
        a2: 1 - alpha,
      };
    }
    case "peaking": {
      return {
        b0: 1 + alpha * A,
        b1: -2 * cosW,
        b2: 1 - alpha * A,
        a0: 1 + alpha / A,
        a1: -2 * cosW,
        a2: 1 - alpha / A,
      };
    }
    case "lowshelf": {
      return {
        b0: A * (A + 1 - (A - 1) * cosW + twoSqrtA * alpha),
        b1: 2 * A * (A - 1 - (A + 1) * cosW),
        b2: A * (A + 1 - (A - 1) * cosW - twoSqrtA * alpha),
        a0: A + 1 + (A - 1) * cosW + twoSqrtA * alpha,
        a1: -2 * (A - 1 + (A + 1) * cosW),
        a2: A + 1 + (A - 1) * cosW - twoSqrtA * alpha,
      };
    }
    case "highshelf": {
      return {
        b0: A * (A + 1 + (A - 1) * cosW + twoSqrtA * alpha),
        b1: -2 * A * (A - 1 + (A + 1) * cosW),
        b2: A * (A + 1 + (A - 1) * cosW - twoSqrtA * alpha),
        a0: A + 1 - (A - 1) * cosW + twoSqrtA * alpha,
        a1: 2 * (A - 1 - (A + 1) * cosW),
        a2: A + 1 - (A - 1) * cosW - twoSqrtA * alpha,
      };
    }
  }
}

function magDb(
  freq: number,
  c: { b0: number; b1: number; b2: number; a0: number; a1: number; a2: number },
): number {
  const w = (2 * Math.PI * freq) / FS;
  const cosW = Math.cos(w);
  const sinW = Math.sin(w);
  const cos2W = Math.cos(2 * w);
  const sin2W = Math.sin(2 * w);

  const numR = c.b0 + c.b1 * cosW + c.b2 * cos2W;
  const numI = -c.b1 * sinW - c.b2 * sin2W;
  const denR = c.a0 + c.a1 * cosW + c.a2 * cos2W;
  const denI = -c.a1 * sinW - c.a2 * sin2W;

  const magSq = (numR * numR + numI * numI) / (denR * denR + denI * denI);
  return 10 * Math.log10(Math.max(magSq, 1e-10));
}

export const FilterVisualizer = ({
  filterType,
  cutoff,
  resonance,
}: FilterVisualizerProps) => {
  const w = 220;
  const h = 90;
  const pad = { t: 6, r: 8, b: 14, l: 28 };
  const pw = w - pad.l - pad.r;
  const ph = h - pad.t - pad.b;

  const logMin = Math.log10(MIN_FREQ);
  const logMax = Math.log10(MAX_FREQ);
  const toX = (f: number) =>
    pad.l + ((Math.log10(f) - logMin) / (logMax - logMin)) * pw;
  const toY = (db: number) =>
    pad.t + (1 - (db - MIN_DB) / (MAX_DB - MIN_DB)) * ph;

  const curve = useMemo(() => {
    const coeffs = biquadCoeffs(
      filterType,
      Math.max(cutoff, 1),
      Math.max(resonance, 0.001),
      0,
    );
    const pts: string[] = [];
    for (let i = 0; i < POINTS; i++) {
      const freq = MIN_FREQ * Math.pow(MAX_FREQ / MIN_FREQ, i / (POINTS - 1));
      const db = magDb(freq, coeffs);
      pts.push(`${toX(freq).toFixed(1)},${toY(db).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [filterType, cutoff, resonance]);

  const cutoffX = toX(Math.max(cutoff, MIN_FREQ));
  const cutoffY0 = pad.t;
  const cutoffY1 = pad.t + ph;

  const zeroDbY = toY(0);

  const gridFreqs = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
  const gridDb = [MIN_DB, MIN_DB / 2, 0, MAX_DB / 2, MAX_DB];

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

      <line
        x1={pad.l}
        y1={zeroDbY}
        x2={pad.l + pw}
        y2={zeroDbY}
        stroke="var(--piano-border-strong)"
        strokeWidth={0.5}
        opacity={0.3}
        strokeDasharray="2,2"
      />

      {gridFreqs.map((f) => (
        <line
          key={`g-${f}`}
          x1={toX(f)}
          y1={pad.t}
          x2={toX(f)}
          y2={pad.t + ph}
          stroke="var(--piano-border-strong)"
          strokeWidth={0.5}
          opacity={0.15}
        />
      ))}

      {[100, 1000, 10000].map((f) => (
        <text
          key={`l-${f}`}
          x={toX(f)}
          y={pad.t + ph + 10}
          textAnchor="middle"
          fill="var(--piano-text-muted)"
          fontSize={6}
          fontFamily="ui-monospace, monospace"
        >
          {f >= 1000 ? `${(f / 1000).toFixed(0)}k` : `${f}`}
        </text>
      ))}

      {gridDb.map((db) => (
        <text
          key={`db-${db}`}
          x={pad.l - 3}
          y={toY(db) + 2}
          textAnchor="end"
          fill="var(--piano-text-muted)"
          fontSize={6}
          fontFamily="ui-monospace, monospace"
        >
          {db === 0 ? "0" : `${db > 0 ? "+" : ""}${db}`}
        </text>
      ))}

      <line
        x1={cutoffX}
        y1={cutoffY0}
        x2={cutoffX}
        y2={cutoffY1}
        stroke="var(--piano-accent)"
        strokeWidth={0.5}
        opacity={0.35}
        strokeDasharray="3,2"
      />

      <polyline
        points={curve}
        fill="none"
        stroke="var(--piano-accent)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};
