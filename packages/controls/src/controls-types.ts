import type { ControlValues } from "@react-piano-keyboard/shared";

export type SetFn = (
  opts:
    | Partial<ControlValues>
    | ((prev: ControlValues) => Partial<ControlValues>),
) => void;
