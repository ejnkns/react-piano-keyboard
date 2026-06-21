import { useRef, useEffect } from "react";

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
    default: {
      return { b0: 1, b1: 0, b2: 0, a0: 1, a1: 0, a2: 0 };
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

const resolveCSSVar = (
  name: string,
  fallback: string,
  el: Element = document.documentElement,
) => getComputedStyle(el).getPropertyValue(name).trim() || fallback;

export const FilterVisualizer = ({
  filterType,
  cutoff,
  resonance,
}: FilterVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 220;
    const h = 90;
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

      const logMin = Math.log10(MIN_FREQ);
      const logMax = Math.log10(MAX_FREQ);
      const toX = (f: number) =>
        pad.l + ((Math.log10(f) - logMin) / (logMax - logMin)) * pw;
      const toY = (db: number) =>
        pad.t + (1 - (db - MIN_DB) / (MAX_DB - MIN_DB)) * ph;

      // Draw grid dB lines
      ctx.strokeStyle = cachedBorderColor;
      ctx.lineWidth = 0.5;
      ctx.fillStyle = cachedTextColor;
      ctx.font = "6px ui-monospace, monospace";
      ctx.textAlign = "end";

      [0.25, 0.5, 0.75].forEach((f) => {
        const val = MIN_DB + f * (MAX_DB - MIN_DB);
        const y = toY(val);
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(pad.l + pw, y);
        ctx.stroke();

        ctx.fillText(
          `${val > 0 ? "+" : ""}${Math.round(val)}dB`,
          pad.l - 4,
          y + 2,
        );
      });

      // Draw frequency vertical grid lines
      const freqs = [100, 1000, 10000];
      ctx.textAlign = "center";
      freqs.forEach((freq) => {
        const x = toX(freq);
        ctx.beginPath();
        ctx.moveTo(x, pad.t);
        ctx.lineTo(x, pad.t + ph);
        ctx.stroke();

        let label = `${freq}Hz`;
        if (freq >= 1000) {
          label = `${freq / 1000}kHz`;
        }
        ctx.fillText(label, x, pad.t + ph + 10);
      });

      // Draw zero dB line
      const zeroY = toY(0);
      ctx.strokeStyle = cachedTextColor;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(pad.l, zeroY);
      ctx.lineTo(pad.l + pw, zeroY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw cutoff frequency line
      const cutoffX = toX(cutoff);
      ctx.strokeStyle = cachedAccentColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(cutoffX, pad.t);
      ctx.lineTo(cutoffX, pad.t + ph);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw response curve
      const coeffs = biquadCoeffs(
        filterType,
        Math.max(cutoff, 1),
        Math.max(resonance, 0.001),
        0,
      );
      ctx.beginPath();
      ctx.strokeStyle = cachedAccentColor;
      ctx.lineWidth = 2;
      for (let i = 0; i < POINTS; i++) {
        const freq = MIN_FREQ * Math.pow(MAX_FREQ / MIN_FREQ, i / (POINTS - 1));
        const db = magDb(freq, coeffs);
        const x = toX(freq);
        const y = toY(db);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
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
  }, [filterType, cutoff, resonance]);

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={90}
      style={{
        display: "block",
        backgroundColor: "var(--piano-bg-tertiary)",
        borderRadius: "4px",
      }}
    />
  );
};
