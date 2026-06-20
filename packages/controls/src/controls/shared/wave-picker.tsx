import { Picker, type PickerProps } from "./picker";
import { Icon } from "./icon";

export const WavePicker = (props: Omit<PickerProps, "children">) => (
  <Picker {...props}>
    {(option) => (
      <span className="whitespace-nowrap flex items-center gap-1">
        <Icon waveform={option.value} />
        {option.label ?? option.value}
      </span>
    )}
  </Picker>
);
