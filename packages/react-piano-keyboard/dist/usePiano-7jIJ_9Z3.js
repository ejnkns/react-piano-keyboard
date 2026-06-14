import { useState as v, useRef as j, useCallback as T, useEffect as W, useMemo as S } from "react";
import { SMOOTH_IN_INTERVAL as P, SMOOTH_OUT_INTERVAL as J, MAX_GAIN as Q, DEFAULT_OSCILLATOR as Y, MAX_OCTAVE as Z, PITCH_CLASSES as tt } from "./constants.mjs";
import { pitchToFrequency as D, pitchToIndex as O, indexToPitch as L, getPitchRange as et } from "./pitches.mjs";
import { isPitch as U } from "./types.mjs";
const ot = ({
  oscillator: o = Y,
  gain: c = Q,
  attack: n = P,
  decay: d = J,
  audioContext: s,
  analyserNode: i
} = {}) => {
  const [a, h] = v(n), [l, y] = v(d), [r, m] = v(c), [p, K] = v(o), [k, M] = v([]), u = j({}), g = j(null), b = T(() => {
    if (s) return s;
    if (i != null && i.context) return i.context;
    if (g.current) return g.current;
    try {
      const t = window.AudioContext || "webkitAudioContext" in window && window.webkitAudioContext;
      if (t) {
        const e = new t();
        return g.current = e, e;
      }
    } catch (t) {
      console.error("Failed to create AudioContext:", t);
    }
    return null;
  }, [s, i]);
  W(() => () => {
    Object.keys(u.current).forEach((t) => {
      const e = u.current[t];
      if (e)
        try {
          e.osc.stop(), e.osc.disconnect(), e.gainNode.disconnect();
        } catch {
        }
    }), u.current = {}, g.current && (g.current.close(), g.current = null);
  }, []);
  const F = T((t) => {
    const e = b();
    if (e) {
      if (e.state === "suspended" && e.resume().catch((f) => console.warn("Failed to resume AudioContext:", f)), u.current[t]) {
        try {
          u.current[t].osc.stop(), u.current[t].osc.disconnect(), u.current[t].gainNode.disconnect();
        } catch {
        }
        delete u.current[t];
      }
      try {
        const f = e.createOscillator(), w = e.createGain();
        f.type = p, f.frequency.value = D(t), f.connect(w), w.connect(e.destination), i && w.connect(i);
        const N = e.currentTime;
        w.gain.setValueAtTime(0, N), w.gain.linearRampToValueAtTime(r, N + a), f.start(N), u.current[t] = { osc: f, gainNode: w }, M((A) => A.includes(t) ? A : [...A, t]);
      } catch (f) {
        console.error(`Failed to play note ${t}:`, f);
      }
    }
  }, [b, i, p, r, a]), R = T((t) => {
    const e = u.current[t];
    if (!e) return;
    const f = b(), w = f ? f.currentTime : 0, { osc: N, gainNode: A } = e;
    if (f)
      try {
        A.gain.cancelScheduledValues(w), A.gain.setValueAtTime(A.gain.value, w), A.gain.exponentialRampToValueAtTime(1e-4, w + l), N.stop(w + l);
        const C = l * 1e3 + 100;
        setTimeout(() => {
          try {
            N.disconnect(), A.disconnect();
          } catch {
          }
          delete u.current[t];
        }, C);
      } catch (C) {
        console.error(`Error stopping note ${t}:`, C), delete u.current[t];
      }
    else {
      try {
        N.stop(), N.disconnect(), A.disconnect();
      } catch {
      }
      delete u.current[t];
    }
    M((C) => C.filter((q) => q !== t));
  }, [b, l]), I = T(() => {
    Object.keys(u.current).forEach((t) => {
      const e = u.current[t];
      if (e)
        try {
          e.osc.stop(), e.osc.disconnect(), e.gainNode.disconnect();
        } catch {
        }
    }), u.current = {}, M([]);
  }, []), E = T(({ oscillator: t, gain: e, attack: f, decay: w }) => {
    t && (K(t), Object.values(u.current).forEach(({ osc: N }) => {
      N.type = t;
    })), e !== void 0 && m(e), f !== void 0 && h(f), w !== void 0 && y(w);
  }, []), V = S(
    () => ({
      gain: r,
      oscillator: p,
      attack: a,
      decay: l
    }),
    [r, p, a, l]
  ), X = S(() => [...Array(Z).keys()].flatMap(
    (e) => tt.map((f) => `${f}${e}`)
  ).map((e) => {
    const f = k.includes(e);
    return {
      hz: D(e),
      gain: r,
      oscillator: p,
      playing: f,
      touched: f
    };
  }), [k, p, r]);
  return {
    start: F,
    stop: R,
    stopAll: I,
    set: E,
    state: X,
    controlValues: V,
    playingNotes: k
  };
}, pt = ["C", "F"], nt = [
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  ",",
  ".",
  "/",
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "[",
  "]",
  "\\"
], ct = [
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  ";",
  "'",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "-",
  "="
], $ = [
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  ";",
  "'"
], z = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "[",
  "]",
  "\\"
], st = 17, x = {
  bottom: {
    whiteKeys: ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "q"],
    blackKeys: ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    whiteStart: 0
  },
  top: {
    whiteKeys: ["w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
    blackKeys: ["2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    whiteStart: 7
  }
}, G = (o, c) => {
  const n = [], d = O(o);
  let s = 0, i = 0;
  for (; s < c; ) {
    const a = L(d + i);
    if (!a) break;
    n.push(a), a.includes("#") || s++, i++;
  }
  return n;
}, _ = (o) => !o.includes("#"), B = (o) => {
  if (!o[0]) return {};
  const c = o.length <= $.length + z.length;
  let n = 0, s = _(o[0]) ? 1 : 0;
  return o.reduce((i, a, h) => {
    const l = h > 0 ? o[h - 1] : void 0, y = l && _(l);
    if (_(a)) {
      const r = c ? $[n] : nt[n];
      r && (i[r] = a, n++, y && s++);
    } else {
      const r = c ? z[s] : ct[h >= st ? s + 1 : s];
      r && (i[r] = a, s++);
    }
    return i;
  }, {});
}, H = (o, c, n) => {
  const d = {};
  let s = 0;
  for (const i of o)
    if (i.includes("#")) {
      const a = n[s];
      a && (d[a] = i);
    } else {
      const a = c[s];
      a && (d[a] = i), s++;
    }
  return d;
}, rt = (o, c) => ({
  ...H(o, x.bottom.whiteKeys, x.bottom.blackKeys),
  ...H(c, x.top.whiteKeys, x.top.blackKeys)
}), it = (o, c) => {
  const n = S(() => c ?? B(o), [o, c]), [d, s] = v(() => ({
    ...n
  })), [i, a] = v(!1), [h, l] = v(null), [y, r] = v(null), m = j(!1);
  W(() => {
    m.current || s({ ...n });
  }, [n]);
  const p = T(() => {
    a((u) => !u), l(null), r(null);
  }, []), K = T((u) => {
    l(u), r(null);
  }, []), k = T(
    (u) => {
      h && (m.current = !0, s((g) => {
        const b = { ...g };
        return b[u] = h, b;
      }), r(null));
    },
    [h]
  ), M = T(() => {
    m.current = !1, s({ ...n }), l(null), r(null);
  }, [n]);
  return {
    keyMap: d,
    editMode: i,
    selectedNote: h,
    conflictNote: y,
    toggleEditMode: p,
    selectNote: K,
    assignKey: k,
    resetToDefaults: M
  };
}, ut = ({
  start: o,
  stop: c,
  activeMap: n,
  editMode: d,
  onAssignKey: s
}) => {
  W(() => {
    if (!d || !s) return;
    const h = (l) => {
      l.repeat || s(l.key);
    };
    return window.addEventListener("keydown", h), () => window.removeEventListener("keydown", h);
  }, [d, s]);
  const i = T(
    (h) => {
      if (d || h.repeat) return;
      const l = n[h.key];
      U(l) && o(l);
    },
    [d, n, o]
  ), a = T(
    (h) => {
      if (d) return;
      const l = n[h.key];
      U(l) && c(l);
    },
    [d, n, c]
  );
  return {
    onKeyDown: i,
    onKeyUp: a
  };
}, at = (o, c) => {
  const n = O(o);
  if (c === 2) {
    const s = Math.max(
      x.bottom.whiteStart + x.bottom.whiteKeys.length - 1,
      x.top.whiteStart + x.top.whiteKeys.length - 1
    ), i = Math.ceil(s / 7);
    return L(n + i * 12 - 1) ?? o;
  }
  const d = Math.ceil(23 / 7);
  return L(n + d * 12 - 1) ?? o;
}, yt = ({
  rows: o = 1,
  start: c = "C3",
  end: n,
  audioContext: d,
  analyserNode: s,
  oscillator: i,
  gain: a,
  attack: h,
  decay: l
} = {}) => {
  const y = typeof c == "string" ? c : c.bottom, r = o === 2, m = S(() => {
    if (!r) return [];
    const R = typeof c == "object" ? c.bottom : y;
    return G(
      R,
      x.bottom.whiteKeys.length
    );
  }, [r, c, y]), p = S(() => {
    if (!r) return [];
    const R = typeof c == "object" ? c.top ?? y : y;
    return G(
      R,
      x.top.whiteKeys.length
    );
  }, [r, c, y]), K = S(() => {
    if (!r) {
      const E = n ?? at(y, o);
      return et({ start: y, end: E });
    }
    const R = [...m, ...p];
    return [...new Set(R)].sort((E, V) => O(E) - O(V));
  }, [r, y, n, o, m, p]), k = S(
    () => r ? rt(m, p) : B(K),
    [r, m, p, K]
  ), M = S(() => {
    if (n) return K;
    const R = new Set(Object.values(k));
    return K.filter((I) => R.has(I));
  }, [K, k, n]), u = S(() => {
    if (r)
      return [m, p];
  }, [r, m, p]), g = ot({
    audioContext: d,
    analyserNode: s,
    oscillator: i,
    gain: a,
    attack: h,
    decay: l
  }), b = it(K, k), F = ut({
    start: g.start,
    stop: g.stop,
    activeMap: b.keyMap,
    editMode: b.editMode,
    onAssignKey: b.assignKey
  });
  return {
    notes: M,
    allNotes: K,
    rowNotes: u,
    defaultMap: k,
    audio: g,
    mapping: b,
    inputProps: F
  };
};
export {
  pt as N,
  ut as a,
  ot as b,
  yt as c,
  it as u
};
//# sourceMappingURL=usePiano-7jIJ_9Z3.js.map
