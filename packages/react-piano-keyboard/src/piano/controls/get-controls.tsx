import { type ReactElement } from "react";
import { getHandlers } from "./shared/handlers";
import { PresetPicker } from "./preset-picker";
import { getOscillatorSection } from "./oscillators";
import { getAdsrEnvelopeSection } from "./adsr-envelope";
import { getFilterSection } from "./filter";
import { getLfoSection } from "./lfo";
import { getAnalogClipSection } from "./analog-clip";
import type { Audio, UseMusicNotes } from "../../use-piano/use-music-notes";

export function getControls({
  set,
  defaultValues,
  envelopeActivity,
  noteRange,
}: {
  set: UseMusicNotes["set"];
  defaultValues?: Partial<Audio.SetOptions>;
  envelopeActivity?: Record<
    number,
    {
      note: string;
      noteOnAt: number;
      noteOffAt: number | null;
      releaseAtStop?: number;
    }
  >;
  noteRange?: { min: string; max: string };
}) {
  const handlers = getHandlers(set);

  const section = (
    title: string,
    ...controls: { control: () => ReactElement }[]
  ) => ({
    title,
    controls,
  });

  return {
    sections: [
      section("Presets", { control: () => <PresetPicker set={set} /> }),
      getOscillatorSection({ defaultValues, handlers }),
      getAdsrEnvelopeSection({ defaultValues, handlers, envelopeActivity, noteRange }),
      getFilterSection({ defaultValues, handlers }),
      getLfoSection({ defaultValues, handlers }),
      getAnalogClipSection({ defaultValues, handlers }),
    ],
  };
}
