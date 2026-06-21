import { useRef, useEffect } from "react";

type LfoVisualizerProps = {
  lfoRate: number;
  lfoDepth: number;
  lfoWaveform: OscillatorType;
  lfoTarget: string;
};

function waveValue(type: OscillatorType, phase: number): number {
  const p = phase - Math.floor(phase);
  switch (type) {
    case "sine": return Math.sin(2 * Math.PI * p);
    case "triangle": return 2 * Math.abs(2 * (p - Math.floor(p + 0.5))) - 1;
    case "sawtooth": return 2 * (p - Math.floor(p + 0.5));
    case "square": return p < 0.5 ? 1 : -1;
    default: return Math.sin(2 * Math.PI * p);
  }
}

const resolveCSSVar = (name: string, fallback: string, el: Element = document.documentElement) =>
  getComputedStyle(el)
    .getPropertyValue(name)
    .trim() || fallback;

const POINTS = 80;

export const LfoVisualizer = ({
  lfoRate,
  lfoDepth,
  lfoWaveform,
  lfoTarget,
}: LfoVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 220, h = 100;
    const pad = { t: 6, r: 8, b: 14, l: 28 };
    const pw = w - pad.l - pad.r;
    const ph = h - pad.t - pad.b;
    const cy = pad.t + ph / 2;
    const amp = (ph / 2) * 0.85;

    let cachedBgColor = resolveCSSVar("--piano-bg-tertiary", "#111", canvas);
    let cachedAccentColor = resolveCSSVar("--piano-accent", "#3b82f6", canvas);
    let cachedBorderColor = resolveCSSVar("--piano-border-strong", "#27272a", canvas);
    let cachedTextColor = resolveCSSVar("--piano-text-muted", "#a1a1aa", canvas);

    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < POINTS; i++) {
        const phase = i / (POINTS - 1);
        const v = waveValue(lfoWaveform, phase);
        pts.push({ x: pad.l + phase * pw, y: cy - v * amp });
    }

    const draw = () => {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = cachedBgColor;
        ctx.fillRect(0, 0, w, h);

        // Draw middle reference line
        ctx.strokeStyle = cachedBorderColor;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(pad.l, cy);
        ctx.lineTo(pad.l + pw, cy);
        ctx.stroke();

        // Draw LFO waveform background curve
        ctx.beginPath();
        ctx.strokeStyle = cachedAccentColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.35;
        pts.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Draw animating dot representing LFO output
        ctx.fillStyle = cachedAccentColor;
        const period = lfoRate > 0 ? 1000 / lfoRate : 1000;
        const phase = (performance.now() % period) / period;
        const v = waveValue(lfoWaveform, phase);
        const x = pad.l + phase * pw;
        const y = cy - v * amp * lfoDepth;

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw labels
        ctx.fillStyle = cachedTextColor;
        ctx.font = "6px ui-monospace, monospace";
        ctx.textAlign = "left";
        ctx.fillText(`${lfoRate.toFixed(1)} Hz`, pad.l, pad.t + ph + 10);

        ctx.textAlign = "end";
        ctx.fillText(`d ${lfoDepth.toFixed(2)}`, pad.l + pw, pad.t + ph + 10);
        ctx.fillText(lfoTarget === "none" ? "off" : `→ ${lfoTarget}`, pad.l + pw, pad.t + 7);

        animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    const observer = new MutationObserver(() => {
      cachedBgColor = resolveCSSVar("--piano-bg-tertiary", "#111", canvas);
      cachedAccentColor = resolveCSSVar("--piano-accent", "#3b82f6", canvas);
      cachedBorderColor = resolveCSSVar("--piano-border-strong", "#27272a", canvas);
      cachedTextColor = resolveCSSVar("--piano-text-muted", "#a1a1aa", canvas);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });

    return () => {
      cancelAnimationFrame(animationRef.current);
      observer.disconnect();
    };
  }, [lfoRate, lfoDepth, lfoWaveform, lfoTarget]);

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={100}
      style={{
        display: "block",
        backgroundColor: "var(--piano-bg-tertiary)",
        borderRadius: "4px",
      }}
    />
  );
};
