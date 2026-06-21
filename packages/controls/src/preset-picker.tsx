import { useState } from "react";
import type { SetFn } from "./controls-types";
import { Picker } from "./picker";
import { PRESETS } from "@react-piano-keyboard/audio/presets";

export const PresetPicker = ({ set }: { set: SetFn }) => {
  const [active, setActive] = useState("Default");

  const apply = (name: string) => {
    setActive(name);
    const preset = PRESETS.find((p) => p.name === name);
    if (preset) set(preset.opts);
  };

  return (
    <Picker
      full
      options={PRESETS.map((p) => ({ value: p.name, label: p.name }))}
      value={active}
      onChange={apply}
    />
  );
};
