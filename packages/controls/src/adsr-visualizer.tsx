import { useRef, useEffect, useMemo } from "react";
import { pitchToFrequency } from "@react-piano-keyboard/music";

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

const MIN_FREQ = 32;
const MAX_FREQ = 4200;
const MIN_OPACITY = 0.2;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function freqOpacity(freq: number, minFreq: number, maxFreq: number): number {
  const norm =
    (Math.log2(freq) - Math.log2(minFreq)) /
    (Math.log2(maxFreq) - Math.log2(minFreq));
  return Math.min(
    1,
    Math.max(MIN_OPACITY, MIN_OPACITY + norm * (1 - MIN_OPACITY)),
  );
}

function computeDotPos(
  entry: EnvelopeEntry,
  p: { attack: number; decay: number; sustain: number; release: number },
  l: {
    x0: number;
    x1: number;
    x2: number;
    x3: number;
    x4: number;
    yTop: number;
    yBot: number;
    sustainY: number;
  },
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

const resolveCSSVar = (
  name: string,
  fallback: string,
  el: Element = document.documentElement,
) => getComputedStyle(el).getPropertyValue(name).trim() || fallback;

export const AdsrVisualizer = ({
  gain,
  attack,
  decay,
  sustain,
  release,
  activity,
  noteRange,
}: Envelope & {
  activity?: Record<number, EnvelopeEntry>;
  noteRange?: { min: string; max: string };
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const minFreq = useMemo(() => {
    if (!noteRange) return MIN_FREQ;
    try {
      return pitchToFrequency(noteRange.min as any);
    } catch {
      return MIN_FREQ;
    }
  }, [noteRange?.min]);

  const maxFreq = useMemo(() => {
    if (!noteRange) return MAX_FREQ;
    try {
      return pitchToFrequency(noteRange.max as any);
    } catch {
      return MAX_FREQ;
    }
  }, [noteRange?.max]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 330;
    const h = 150;
    const pad = { t: 6, r: 14, b: 18, l: 22 };
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

    const observer = new MutationObserver(() => {
      cachedBgColor = resolveCSSVar("--piano-bg-tertiary", "#111", canvas);
      cachedAccentColor = resolveCSSVar("--piano-accent", "#3b82f6", canvas);
      cachedBorderColor = resolveCSSVar(
        "--piano-border-strong",
        "#27272a",
        canvas,
      );
      cachedTextColor = resolveCSSVar("--piano-text-muted", "#a1a1aa", canvas);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = cachedBgColor;
      ctx.fillRect(0, 0, w, h);

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

      // Draw grid lines
      ctx.strokeStyle = cachedBorderColor;
      ctx.lineWidth = 0.5;
      ctx.fillStyle = cachedTextColor;
      ctx.font = "6px ui-monospace, monospace";
      ctx.textAlign = "end";

      [0.25, 0.5, 0.75].forEach((f) => {
        const y = toY(f);
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(pad.l + pw, y);
        ctx.stroke();

        ctx.fillText(f.toFixed(2), pad.l - 4, y + 2);
      });

      // Draw Gain line
      const gainY = toY(Math.min(gain, 1));
      ctx.beginPath();
      ctx.strokeStyle = cachedAccentColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.moveTo(x0, gainY);
      ctx.lineTo(x4, gainY);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      ctx.fillStyle = cachedAccentColor;
      ctx.font = "6px ui-monospace, monospace";
      ctx.fillText(`Gain: ${gain.toFixed(2)}`, x4 - 40, gainY - 3);

      // Draw phase tick marks
      ctx.strokeStyle = cachedBorderColor;
      ctx.lineWidth = 0.5;
      ctx.fillStyle = cachedTextColor;
      [
        { x: x1, label: `${attack.toFixed(2)}s` },
        { x: x2, label: `${(attack + decay).toFixed(2)}s` },
        { x: x3, label: `${(attack + decay + holdTime).toFixed(2)}s` },
        { x: x4, label: `${totalTime.toFixed(2)}s` },
      ].forEach((tick) => {
        ctx.beginPath();
        ctx.moveTo(tick.x, yBot);
        ctx.lineTo(tick.x, yBot + 4);
        ctx.stroke();

        ctx.font = "6px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.fillText(tick.label, tick.x, yBot + 12);
      });

      // Draw dashed helper lines
      ctx.strokeStyle = cachedAccentColor;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 2]);
      if (attack > 0) {
        ctx.beginPath();
        ctx.moveTo(x1, yTop);
        ctx.lineTo(x1, yBot);
        ctx.stroke();
      }
      if (release > 0) {
        ctx.beginPath();
        ctx.moveTo(x3, sustainY);
        ctx.lineTo(x3, yBot);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Draw envelope curve
      ctx.beginPath();
      ctx.moveTo(x0, yBot);
      ctx.lineTo(x1, yTop);
      ctx.lineTo(x2, sustainY);
      ctx.lineTo(x3, sustainY);
      ctx.lineTo(x4, yBot);
      ctx.strokeStyle = cachedAccentColor;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      // Draw anchor circles
      ctx.fillStyle = cachedAccentColor;
      [
        { x: x1, y: yTop },
        { x: x2, y: sustainY },
        { x: x3, y: sustainY },
      ].forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw active note dots
      const now = performance.now();
      if (activity) {
        for (const [voiceId, entry] of Object.entries(activity)) {
          const pos = computeDotPos(
            entry,
            { attack, decay, sustain, release },
            { x0, x1, x2, x3, x4, yTop, yBot, sustainY },
            now,
          );
          if (pos) {
            let freq: number;
            try {
              freq = pitchToFrequency(entry.note as any);
            } catch {
              freq = 440;
            }
            const opacity = freqOpacity(freq, minFreq, maxFreq);

            ctx.fillStyle = cachedAccentColor;
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0; // Reset alpha
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [gain, attack, decay, sustain, release, activity, minFreq, maxFreq]);

  return (
    <canvas
      ref={canvasRef}
      width={330}
      height={150}
      style={{
        display: "block",
        backgroundColor: "var(--piano-bg-tertiary)",
        borderRadius: "4px",
      }}
    />
  );
};
