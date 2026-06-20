import { useRef, useEffect, useState } from "react";

type LfoVisualizerProps = {
  lfoRate: number;
  lfoDepth: number;
  lfoWaveform: OscillatorType;
  lfoTarget: string;
};

function waveValue(type: OscillatorType, phase: number): number {
  const p = phase - Math.floor(phase);
  switch (type) {
    case "sine":
      return Math.sin(2 * Math.PI * p);
    case "triangle":
      return 2 * Math.abs(2 * (p - Math.floor(p + 0.5))) - 1;
    case "sawtooth":
      return 2 * (p - Math.floor(p + 0.5));
    case "square":
      return p < 0.5 ? 1 : -1;
    default:
      return Math.sin(2 * Math.PI * p);
  }
}

const POINTS = 80;

export const LfoVisualizer = ({
  lfoRate,
  lfoDepth,
  lfoWaveform,
  lfoTarget,
}: LfoVisualizerProps) => {
  const w = 220;
  const h = 100;
  const pad = { t: 6, r: 8, b: 14, l: 28 };
  const pw = w - pad.l - pad.r;
  const ph = h - pad.t - pad.b;
  const cy = pad.t + ph / 2;
  const amp = (ph / 2) * 0.85;

  const pts: string[] = [];
  for (let i = 0; i < POINTS; i++) {
    const phase = i / (POINTS - 1);
    const v = waveValue(lfoWaveform, phase);
    pts.push(`${(pad.l + phase * pw).toFixed(1)},${(cy - v * amp).toFixed(1)}`);
  }

  const period = lfoRate > 0 ? 1000 / lfoRate : 1000;
  const phaseRef = useRef(0);
  const [dot, setDot] = useState({ x: pad.l, y: cy });

  useEffect(() => {
    let rafId: number;

    const tick = () => {
      if (lfoDepth > 0 && lfoTarget !== "none") {
        phaseRef.current = (performance.now() % period) / period;
        const v = waveValue(lfoWaveform, phaseRef.current);
        const x = pad.l + phaseRef.current * pw;
        const y = cy - v * amp * lfoDepth;
        setDot({ x, y });
      } else {
        setDot({ x: pad.l, y: cy });
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [lfoDepth, lfoTarget, lfoWaveform, period, pw, pad.l, cy, amp]);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={0} y={0} width={w} height={h} rx={4} fill="var(--piano-bg-tertiary)" />

      <line
        x1={pad.l} y1={cy} x2={pad.l + pw} y2={cy}
        stroke="var(--piano-border-strong)" strokeWidth={0.5} opacity={0.25}
      />

      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="var(--piano-accent)"
        strokeWidth={1}
        opacity={0.35}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      <circle cx={dot.x} cy={dot.y} r={3} fill="var(--piano-accent)">
        <animate attributeName="r" values="0;3" dur="150ms" fill="freeze" />
      </circle>

      <text
        x={pad.l} y={pad.t + ph + 10}
        fill="var(--piano-text-muted)" fontSize={6} fontFamily="ui-monospace, monospace"
      >
        {lfoRate.toFixed(1)} Hz
      </text>

      <text
        x={pad.l + pw} y={pad.t + ph + 10}
        textAnchor="end"
        fill="var(--piano-text-muted)" fontSize={6} fontFamily="ui-monospace, monospace"
      >
        d {lfoDepth.toFixed(2)}
      </text>

      <text
        x={pad.l + pw} y={pad.t + 7}
        textAnchor="end"
        fill="var(--piano-text-muted)" fontSize={6} fontFamily="ui-monospace, monospace"
        opacity={0.6}
      >
        {lfoTarget === "none" ? "off" : `→ ${lfoTarget}`}
      </text>
    </svg>
  );
};
