import { useMemo } from "react";

const MAX_INPUT = 5;
const POINTS = 120;

type AnalogClipVisualizerProps = {
  drive: number;
  input: number;
};

function tanhClip(x: number, drive: number): number {
  const denominator = Math.tanh(drive);
  const val = Math.tanh(drive * x) / denominator;
  return Math.max(-1, Math.min(1, val));
}

export const AnalogClipVisualizer = ({
  drive,
  input: preGain,
}: AnalogClipVisualizerProps) => {
  const w = 220;
  const h = 100;
  const pad = { t: 6, r: 8, b: 14, l: 28 };
  const pw = w - pad.l - pad.r;
  const ph = h - pad.t - pad.b;

  const toX = (v: number) => pad.l + (v / MAX_INPUT) * pw;
  const toY = (v: number) => pad.t + (1 - v) * ph;

  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i < POINTS; i++) {
      const x = (MAX_INPUT * i) / (POINTS - 1);
      const y = tanhClip(x * preGain, drive);
      pts.push(`${toX(x).toFixed(1)},${toY(y).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [drive, preGain]);

  const identityPts = [
    `${toX(0).toFixed(1)},${toY(0).toFixed(1)}`,
    `${toX(MAX_INPUT).toFixed(1)},${toY(MAX_INPUT).toFixed(1)}`,
  ].join(" ");

  return (
    <div className="flex flex-col gap-0.5 items-center">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect
          x={0}
          y={0}
          width={w}
          height={h}
          rx={4}
          fill="var(--piano-bg-tertiary)"
        />

        {[1, 2, 3, 4].map((v) => (
          <line
            key={`v-${v}`}
            x1={toX(v)}
            y1={pad.t}
            x2={toX(v)}
            y2={pad.t + ph}
            stroke="var(--piano-border-strong)"
            strokeWidth={0.5}
            opacity={0.15}
          />
        ))}

        {[0.25, 0.5, 0.75].map((v) => (
          <line
            key={`h-${v}`}
            x1={pad.l}
            y1={toY(v)}
            x2={pad.l + pw}
            y2={toY(v)}
            stroke="var(--piano-border-strong)"
            strokeWidth={0.5}
            opacity={0.15}
          />
        ))}

        <line
          x1={pad.l}
          y1={toY(1)}
          x2={pad.l + pw}
          y2={toY(1)}
          stroke="var(--piano-border-strong)"
          strokeWidth={0.5}
          opacity={0.3}
          strokeDasharray="2,2"
        />

        {[0, 1, 2, 3, 4, 5].map((v) => (
          <text
            key={`xl-${v}`}
            x={toX(v)}
            y={pad.t + ph + 10}
            textAnchor="middle"
            fill="var(--piano-text-muted)"
            fontSize={6}
            fontFamily="ui-monospace, monospace"
          >
            {v}
          </text>
        ))}

        {[0, 0.5, 1].map((v) => (
          <text
            key={`yl-${v}`}
            x={pad.l - 3}
            y={toY(v) + 2}
            textAnchor="end"
            fill="var(--piano-text-muted)"
            fontSize={6}
            fontFamily="ui-monospace, monospace"
          >
            {v.toFixed(v === 0 ? 0 : 1)}
          </text>
        ))}

        <line
          x1={pad.l}
          y1={toY(0)}
          x2={pad.l + pw}
          y2={toY(0)}
          stroke="var(--piano-border-strong)"
          strokeWidth={0.5}
          opacity={0.3}
        />

        <line
          x1={toX(0)}
          y1={pad.t + ph}
          x2={toX(0)}
          y2={pad.t}
          stroke="var(--piano-border-strong)"
          strokeWidth={0.5}
          opacity={0.3}
        />

        <polyline
          points={identityPts}
          fill="none"
          stroke="var(--piano-border-strong)"
          strokeWidth={0.5}
          opacity={0.2}
          strokeDasharray="3,3"
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
    </div>
  );
};
