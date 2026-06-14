import { PITCH_CLASSES as e } from "./constants.mjs";
const i = [
  "sine",
  "sawtooth",
  "square",
  "triangle"
], n = (s) => typeof s == "string" && i.includes(s), o = (s) => typeof s == "string" && e.includes(s), c = (s) => {
  if (typeof s != "string") return !1;
  const t = s.match(/^([A-G]#?)(\d+)$/);
  return t ? e.includes(t[1]) : !1;
};
export {
  i as OSCILLATORS,
  n as isOscillatorType,
  c as isPitch,
  o as isPitchClass
};
//# sourceMappingURL=types.mjs.map
