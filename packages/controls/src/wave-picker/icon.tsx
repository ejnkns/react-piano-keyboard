const WAVE_ICONS: Record<string, string> = {
  sine: "M0,5 C3,0 4,0 7,5 C10,10 11,10 14,5",
  triangle: "M0,9 L3.5,1 L7,9 L10.5,1 L14,9",
  sawtooth: "M0,1 L7,9 L7,1 L14,9 L14,1",
  square: "M0,1 L3.5,1 L3.5,9 L7,9 L7,1 L10.5,1 L10.5,9 L14,9 L14,1",
};

export const Icon = ({ waveform }: { waveform: string }) => {
  const d = WAVE_ICONS[waveform];
  if (!d) return null;

  return (
    <svg
      viewBox="0 0 14 10"
      width={14}
      height={10}
      className="align-middle mr-0.5 inline overflow-hidden"
    >
      <g className="animate-[scrollWave_1s_linear_infinite] [animation-play-state:paused] group-hover:[animation-play-state:running]">
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(14, 0)"
        />
      </g>
    </svg>
  );
};
