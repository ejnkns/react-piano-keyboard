import "./index.css";

export { Controls } from "./controls";
export type { ControlSection, SectionSize } from "./controls";
export type { SetFn } from "./controls-types";

export { PresetPicker } from "./controls/preset-picker";
export { WavePicker } from "./controls/shared/wave-picker";
export { Slider } from "./controls/shared/slider";
export { Toggle } from "./controls/shared/toggle";
export { Picker, type PickerOption } from "./controls/shared/picker";
export { Icon } from "./controls/shared/icon";

export { WaveformVisualizer } from "./waveform-visualizer";

export {
  getOscillatorSection,
  getOscillatorHandlers,
  type OscillatorHandlers,
} from "./controls/oscillators";
export {
  getAdsrEnvelopeSection,
  getAdsrHandlers,
  type AdsrHandlers,
} from "./controls/adsr-envelope";
export {
  getFilterSection,
  getFilterHandlers,
  type FilterHandlers,
} from "./controls/filter";
export {
  getLfoSection,
  getLfoHandlers,
  type LfoHandlers,
} from "./controls/lfo";
export {
  getAnalogClipSection,
  getAnalogClipHandlers,
  type AnalogClipHandlers,
} from "./controls/analog-clip";

export {
  AdsrVisualizer,
} from "./controls/adsr-envelope/adsr-visualizer";
export {
  FilterVisualizer,
} from "./controls/filter/filter-visualizer";
export {
  LfoVisualizer,
} from "./controls/lfo/lfo-visualizer";
export {
  AnalogClipVisualizer,
} from "./controls/analog-clip/analog-clip-visualizer";
export {
  AudioVisualizer,
} from "./controls/audio-monitor/audio-visualizer";
export {
  MasterWaveformVisualizer,
} from "./controls/audio-monitor/master-waveform-visualizer";
