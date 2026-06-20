import { useState } from "react";
import type { UseMusicNotes } from "../../use-piano/use-music-notes";
import { Picker } from "./shared/picker";
import { PRESETS } from "./preset-picker/presets";

export const PresetPicker = ({ set }: { set: UseMusicNotes["set"] }) => {
  const [active, setActive] = useState("Default");

  const apply = (name: string) => {
    setActive(name);
    const preset = PRESETS.find((p) => p.name === name);
    if (preset) set(preset.opts);
  };

  return (
    <Picker
      label="Presets"
      options={PRESETS.map((p) => ({ value: p.name, label: p.name }))}
      value={active}
      onChange={apply}
    />
  );
};
