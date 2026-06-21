import { useRef, useEffect } from "react";

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

const resolveCSSVar = (
  name: string,
  fallback: string,
  el: Element = document.documentElement,
) => getComputedStyle(el).getPropertyValue(name).trim() || fallback;

export const AnalogClipVisualizer = ({
  drive,
  input: preGain,
}: AnalogClipVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 220;
    const h = 100;
    const pad = { t: 6, r: 8, b: 14, l: 28 };
    const pw = w - pad.l - pad.r;
    const ph = h - pad.t - pad.b;

    let cachedBgColor = resolveCSSVar("--piano-bg-tertiary", "#111", canvas);
    let cachedAccentColor = resolveCSSVar("--piano-accent", "#3b82f6", canvas);
    let cachedBorderColor = resolveCSSVar(
      "--piano-border-strong",
      "#27272a",
      canvas,
    );
    let cachedTextColor = resolveCSSVar(
      "--piano-text-muted",
      "#a1a1aa",
      canvas,
    );

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = cachedBgColor;
      ctx.fillRect(0, 0, w, h);

      const toX = (v: number) => pad.l + (v / MAX_INPUT) * pw;
      const toY = (v: number) => pad.t + (1 - v) * ph;

      // Draw grid vertical lines
      ctx.strokeStyle = cachedBorderColor;
      ctx.lineWidth = 0.5;
      ctx.fillStyle = cachedTextColor;
      ctx.font = "6px ui-monospace, monospace";
      ctx.textAlign = "center";

      [1, 2, 3, 4, 5].forEach((v) => {
        const x = toX(v);
        ctx.beginPath();
        ctx.moveTo(x, pad.t);
        ctx.lineTo(x, pad.t + ph);
        ctx.stroke();

        ctx.fillText(v.toString(), x, pad.t + ph + 10);
      });

      // Draw grid horizontal lines
      ctx.textAlign = "end";
      [0, 0.5, 1].forEach((v) => {
        const y = toY(v);
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(pad.l + pw, y);
        ctx.stroke();

        ctx.fillText(v.toFixed(1), pad.l - 4, y + 2);
      });

      // Draw identity 1-to-1 line (clipping helper)
      ctx.strokeStyle = cachedTextColor;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(toX(0), toY(0));
      ctx.lineTo(toX(MAX_INPUT), toY(MAX_INPUT));
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw transfer curve
      ctx.beginPath();
      ctx.strokeStyle = cachedAccentColor;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < POINTS; i++) {
        const x = (MAX_INPUT * i) / (POINTS - 1);
        const y = tanhClip(x * preGain, drive);
        if (i === 0) ctx.moveTo(toX(x), toY(y));
        else ctx.lineTo(toX(x), toY(y));
      }
      ctx.stroke();
    };

    draw();

    const observer = new MutationObserver(() => {
      cachedBgColor = resolveCSSVar("--piano-bg-tertiary", "#111", canvas);
      cachedAccentColor = resolveCSSVar("--piano-accent", "#3b82f6", canvas);
      cachedBorderColor = resolveCSSVar(
        "--piano-border-strong",
        "#27272a",
        canvas,
      );
      cachedTextColor = resolveCSSVar("--piano-text-muted", "#a1a1aa", canvas);
      draw();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });

    return () => {
      observer.disconnect();
    };
  }, [drive, preGain]);

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
