import type { ControlValues } from "@react-piano-keyboard/audio/defaults";

export type SetFn = (
  opts:
    | Partial<ControlValues>
    | ((prev: ControlValues) => Partial<ControlValues>),
) => void;
