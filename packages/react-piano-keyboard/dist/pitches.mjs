import { PITCH_CLASSES as i, OCTAVE_LENGTH as e, A4 as d, DEFAULT_OCTAVE as f, A4_INDEX as v } from "./constants.mjs";
import { isPitch as h } from "./types.mjs";
const p = (t) => {
  const o = t.slice(0, -1), s = parseInt(t.slice(-1));
  return { pitchClass: o, octave: s };
}, x = (t) => h(t) ? p(t).pitchClass : t, m = (t) => h(t) ? p(t).octave : f, u = (t, o, s) => ({
  pitchClass: x(t),
  octave: m(t),
  cents: 0
}), P = (t) => {
  const o = typeof t == "string" ? u(t) : t, { pitchClass: s, octave: c, cents: n } = o, a = c * e + i.indexOf(s), r = Math.pow(2, (a - v) / e) * Math.pow(2, n / (100 * e)), C = d * r;
  return Number(C.toFixed(2));
}, l = (t) => {
  const o = typeof t == "string" ? u(t) : t, { pitchClass: s, octave: c } = o;
  return c * e + i.indexOf(s);
}, g = (t) => {
  const o = Math.floor(t / e), s = i[t % e];
  return s && o !== void 0 ? {
    pitchClass: s,
    octave: o,
    cents: 0
  } : void 0;
}, I = (t) => {
  const o = Math.floor(t / e), c = `${i[t % e]}${o}`;
  return h(c) ? c : void 0;
}, A = ({ start: t, end: o }) => {
  const s = l(t), c = l(o), n = [];
  for (let a = s; a <= c; a++) {
    const r = I(a);
    r && n.push(r);
  }
  return n;
};
export {
  x as getPitchClass,
  A as getPitchRange,
  I as indexToPitch,
  g as indexToPitchData,
  P as pitchToFrequency,
  l as pitchToIndex
};
//# sourceMappingURL=pitches.mjs.map
