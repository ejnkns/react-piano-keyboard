import fe, { useRef as B, useState as U, useEffect as oe, useCallback as te, useMemo as xe } from "react";
import { N as he, c as me } from "./usePiano-7jIJ_9Z3.js";
import { getPitchClass as se } from "./pitches.mjs";
import { isOscillatorType as de } from "./types.mjs";
var V = { exports: {} }, H = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ae;
function be() {
  if (ae) return H;
  ae = 1;
  var o = Symbol.for("react.transitional.element"), l = Symbol.for("react.fragment");
  function s(d, a, r) {
    var u = null;
    if (r !== void 0 && (u = "" + r), a.key !== void 0 && (u = "" + a.key), "key" in a) {
      r = {};
      for (var n in a)
        n !== "key" && (r[n] = a[n]);
    } else r = a;
    return a = r.ref, {
      $$typeof: o,
      type: d,
      key: u,
      ref: a !== void 0 ? a : null,
      props: r
    };
  }
  return H.Fragment = l, H.jsx = s, H.jsxs = s, H;
}
var J = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ie;
function ve() {
  return ie || (ie = 1, process.env.NODE_ENV !== "production" && (function() {
    function o(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === b ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case i:
          return "Fragment";
        case A:
          return "Profiler";
        case y:
          return "StrictMode";
        case E:
          return "Suspense";
        case D:
          return "SuspenseList";
        case M:
          return "Activity";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case L:
            return "Portal";
          case x:
            return e.displayName || "Context";
          case p:
            return (e._context.displayName || "Context") + ".Consumer";
          case j:
            var c = e.render;
            return e = e.displayName, e || (e = c.displayName || c.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case $:
            return c = e.displayName || null, c !== null ? c : o(e.type) || "Memo";
          case R:
            c = e._payload, e = e._init;
            try {
              return o(e(c));
            } catch {
            }
        }
      return null;
    }
    function l(e) {
      return "" + e;
    }
    function s(e) {
      try {
        l(e);
        var c = !1;
      } catch {
        c = !0;
      }
      if (c) {
        c = console;
        var h = c.error, g = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return h.call(
          c,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          g
        ), l(e);
      }
    }
    function d(e) {
      if (e === i) return "<>";
      if (typeof e == "object" && e !== null && e.$$typeof === R)
        return "<...>";
      try {
        var c = o(e);
        return c ? "<" + c + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function a() {
      var e = N.A;
      return e === null ? null : e.getOwner();
    }
    function r() {
      return Error("react-stack-top-frame");
    }
    function u(e) {
      if (C.call(e, "key")) {
        var c = Object.getOwnPropertyDescriptor(e, "key").get;
        if (c && c.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function n(e, c) {
      function h() {
        Y || (Y = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          c
        ));
      }
      h.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: h,
        configurable: !0
      });
    }
    function f() {
      var e = o(this.type);
      return F[e] || (F[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function S(e, c, h, g, X, Q) {
      var _ = h.ref;
      return e = {
        $$typeof: P,
        type: e,
        key: c,
        props: h,
        _owner: g
      }, (_ !== void 0 ? _ : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: f
      }) : Object.defineProperty(e, "ref", { enumerable: !1, value: null }), e._store = {}, Object.defineProperty(e._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(e, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(e, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: X
      }), Object.defineProperty(e, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: Q
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function w(e, c, h, g, X, Q) {
      var _ = c.children;
      if (_ !== void 0)
        if (g)
          if (I(_)) {
            for (g = 0; g < _.length; g++)
              T(_[g]);
            Object.freeze && Object.freeze(_);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else T(_);
      if (C.call(c, "key")) {
        _ = o(e);
        var G = Object.keys(c).filter(function(pe) {
          return pe !== "key";
        });
        g = 0 < G.length ? "{key: someKey, " + G.join(": ..., ") + ": ...}" : "{key: someKey}", z[_ + g] || (G = 0 < G.length ? "{" + G.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          g,
          _,
          G,
          _
        ), z[_ + g] = !0);
      }
      if (_ = null, h !== void 0 && (s(h), _ = "" + h), u(c) && (s(c.key), _ = "" + c.key), "key" in c) {
        h = {};
        for (var ee in c)
          ee !== "key" && (h[ee] = c[ee]);
      } else h = c;
      return _ && n(
        h,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), S(
        e,
        _,
        h,
        a(),
        X,
        Q
      );
    }
    function T(e) {
      k(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e !== null && e.$$typeof === R && (e._payload.status === "fulfilled" ? k(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
    }
    function k(e) {
      return typeof e == "object" && e !== null && e.$$typeof === P;
    }
    var m = fe, P = Symbol.for("react.transitional.element"), L = Symbol.for("react.portal"), i = Symbol.for("react.fragment"), y = Symbol.for("react.strict_mode"), A = Symbol.for("react.profiler"), p = Symbol.for("react.consumer"), x = Symbol.for("react.context"), j = Symbol.for("react.forward_ref"), E = Symbol.for("react.suspense"), D = Symbol.for("react.suspense_list"), $ = Symbol.for("react.memo"), R = Symbol.for("react.lazy"), M = Symbol.for("react.activity"), b = Symbol.for("react.client.reference"), N = m.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, C = Object.prototype.hasOwnProperty, I = Array.isArray, W = console.createTask ? console.createTask : function() {
      return null;
    };
    m = {
      react_stack_bottom_frame: function(e) {
        return e();
      }
    };
    var Y, F = {}, q = m.react_stack_bottom_frame.bind(
      m,
      r
    )(), v = W(d(r)), z = {};
    J.Fragment = i, J.jsx = function(e, c, h) {
      var g = 1e4 > N.recentlyCreatedOwnerStacks++;
      return w(
        e,
        c,
        h,
        !1,
        g ? Error("react-stack-top-frame") : q,
        g ? W(d(e)) : v
      );
    }, J.jsxs = function(e, c, h) {
      var g = 1e4 > N.recentlyCreatedOwnerStacks++;
      return w(
        e,
        c,
        h,
        !0,
        g ? Error("react-stack-top-frame") : q,
        g ? W(d(e)) : v
      );
    };
  })()), J;
}
var ce;
function ye() {
  return ce || (ce = 1, process.env.NODE_ENV === "production" ? V.exports = be() : V.exports = ve()), V.exports;
}
var t = ye();
const ge = "_text_1ri5p_1", _e = "_set_1ri5p_11", we = "_note_1ri5p_18", ke = "_white_1ri5p_26", je = "_playing_1ri5p_40", Ee = "_black_1ri5p_60", Re = "_E_1ri5p_90", Se = "_A_1ri5p_91", Te = "_G_1ri5p_92", Ae = "_D_1ri5p_93", Ne = "_B_1ri5p_94", Ce = "_selected_1ri5p_98", Oe = "_conflict_1ri5p_103", Pe = "_topPanel_1ri5p_128", Me = "_screen_1ri5p_132", Le = "_notesWell_1ri5p_137", O = {
  text: ge,
  set: _e,
  note: we,
  white: ke,
  playing: je,
  true: "_true_1ri5p_50",
  black: Ee,
  E: Re,
  A: Se,
  G: Te,
  D: Ae,
  B: Ne,
  selected: Ce,
  conflict: Oe,
  case: "_case_1ri5p_121",
  topPanel: Pe,
  screen: Me,
  notesWell: Le
}, $e = (o) => {
  const s = B(null), [d, a] = U(!1), r = (n) => {
    n.preventDefault(), a(!0);
  }, u = (n) => {
    n.preventDefault(), a(!1);
  };
  return oe(() => {
    const n = s.current;
    return n && (n.addEventListener("mousedown", r), n.addEventListener("touchstart", r), n.addEventListener("mouseup", u), n.addEventListener("touchend", u), n.addEventListener("touchcancel", u), n.addEventListener("mouseleave", u)), () => {
      n && (n.removeEventListener("mousedown", r), n.removeEventListener("touchstart", r), n.removeEventListener("mouseup", u), n.removeEventListener("touchend", u), n.removeEventListener("touchcancel", u), n.removeEventListener("mouseleave", u));
    };
  }, [s]), { isMouseDown: d, ref: s };
}, ne = ({
  notes: o,
  id: l,
  audio: s,
  mapping: d,
  whiteCount: a
}) => {
  const { isMouseDown: r, ref: u } = $e(), f = 100 / (a ?? o.filter((i) => !i.includes("#")).length), S = {
    width: `${f - 3e-3}%`
  }, w = {
    margin: `0 0 0 -${f / 4}%`
  }, T = {
    width: `${f / 2}%`,
    ...w
  }, k = d.customKeyMap ?? d.keyNoteMap, m = (i) => {
    var E;
    const y = !i.includes("#"), A = ((E = s.playingNotes) == null ? void 0 : E.includes(i)) && "playing", p = d.selectedNote === i && "selected", x = d.conflictNote === i && "conflict", j = r && O[`${r}`];
    return [
      O.note,
      j,
      O[se(i)],
      A && O[A],
      p && O.selected,
      x && O.conflict,
      y ? O.white : O.black
    ].filter(Boolean).join(" ");
  }, P = (i) => {
    var y;
    d.editMode ? (y = d.onNoteSelect) == null || y.call(d, i) : s.start(i);
  }, L = (i, y, A = S, p = T, x = w) => {
    const j = !i.includes("#"), E = se(i), D = Object.keys(k).filter(
      (R) => k[R] === i
    ), $ = y > 0 && !he.includes(E);
    return /* @__PURE__ */ t.jsxs(
      "div",
      {
        id: i,
        className: m(i),
        style: {
          ...j && A,
          ...!j && p,
          ...$ && x
        },
        onMouseDown: () => P(i),
        onMouseOver: () => !d.editMode && !!r && s.start(i),
        onMouseOut: () => !d.editMode && !!r && s.stop(i),
        onBlur: () => s.stop(i),
        onMouseUp: () => s.stop(i),
        onTouchStart: () => P(i),
        onTouchEnd: () => s.stop(i),
        children: [
          /* @__PURE__ */ t.jsx(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "center",
                gap: 2
              },
              children: D.map((R) => /* @__PURE__ */ t.jsx(
                "span",
                {
                  style: {
                    fontSize: 9,
                    fontFamily: "ui-monospace, monospace",
                    background: j ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)",
                    border: j ? "1px solid rgba(0,0,0,0.15)" : "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 2,
                    padding: "0 2px",
                    lineHeight: "14px",
                    color: j ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.6)"
                  },
                  children: R
                },
                R
              ))
            }
          ),
          /* @__PURE__ */ t.jsx(
            "span",
            {
              style: {
                position: "absolute",
                bottom: 3,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: 8,
                fontFamily: "ui-monospace, monospace",
                color: "var(--piano-text-muted)",
                pointerEvents: "none",
                lineHeight: 1
              },
              children: i
            }
          )
        ]
      },
      `${l}-${i}`
    );
  };
  return /* @__PURE__ */ t.jsx("div", { ref: u, className: O.set, children: o.map((i, y) => L(i, y)) });
}, K = -135, ue = 135, We = ue - K, re = ({ name: o, defaultValue: l, min: s, max: d, step: a, unit: r, onChange: u }) => {
  const [n, f] = U(l ?? s), S = B(n);
  S.current = n;
  const w = B(null), T = (n - s) / (d - s), k = K + T * We, m = (b) => a >= 1 ? b.toFixed(0) : a >= 0.1 ? b.toFixed(1) : b.toFixed(2), P = (b) => Math.min(d, Math.max(s, b)), L = (b) => Math.round(b / a) * a, i = te(
    (b) => {
      b.preventDefault(), b.target.setPointerCapture(b.pointerId), w.current = { startY: b.clientY, startValue: n };
    },
    [n]
  ), y = te(
    (b) => {
      if (!w.current) return;
      const N = w.current.startY - b.clientY, C = d - s, W = w.current.startValue + N / 150 * C, Y = P(W), F = L(Y);
      f(F);
    },
    [s, d, a]
  ), A = te(() => {
    w.current && (w.current = null, u == null || u(S.current));
  }, [u]), p = 32, x = 24, j = 4, E = x - j, D = (b, N, C, I) => {
    const W = (I - 90) * Math.PI / 180;
    return { x: b + C * Math.cos(W), y: N + C * Math.sin(W) };
  }, $ = D(p, p, x, K), R = D(p, p, x, k), M = D(p, p, x, ue);
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        userSelect: "none",
        WebkitUserSelect: "none",
        width: 72
      },
      children: [
        /* @__PURE__ */ t.jsx(
          "div",
          {
            onPointerDown: i,
            onPointerMove: y,
            onPointerUp: A,
            style: { cursor: "ns-resize", touchAction: "none", lineHeight: 0 },
            children: /* @__PURE__ */ t.jsxs("svg", { width: 64, height: 64, viewBox: "0 0 64 64", children: [
              /* @__PURE__ */ t.jsxs("defs", { children: [
                /* @__PURE__ */ t.jsxs("radialGradient", { id: `${o}-knob-bg`, cx: "40%", cy: "35%", r: "60%", children: [
                  /* @__PURE__ */ t.jsx("stop", { offset: "0%", stopColor: "var(--piano-text-muted)" }),
                  /* @__PURE__ */ t.jsx("stop", { offset: "100%", stopColor: "var(--piano-bg-elevated)" })
                ] }),
                /* @__PURE__ */ t.jsxs("radialGradient", { id: `${o}-knob-highlight`, cx: "40%", cy: "30%", r: "50%", children: [
                  /* @__PURE__ */ t.jsx("stop", { offset: "0%", stopColor: "rgba(255,255,255,0.12)" }),
                  /* @__PURE__ */ t.jsx("stop", { offset: "100%", stopColor: "rgba(255,255,255,0)" })
                ] }),
                /* @__PURE__ */ t.jsx("filter", { id: `${o}-knob-shadow`, children: /* @__PURE__ */ t.jsx("feDropShadow", { dx: "0", dy: "2", stdDeviation: "3", floodColor: "#000", floodOpacity: "0.5" }) })
              ] }),
              /* @__PURE__ */ t.jsx(
                "path",
                {
                  d: `M ${$.x} ${$.y} A ${x} ${x} 0 0 1 ${M.x} ${M.y}`,
                  fill: "none",
                  stroke: "var(--piano-border-strong)",
                  strokeWidth: j,
                  strokeLinecap: "round"
                }
              ),
              /* @__PURE__ */ t.jsx(
                "path",
                {
                  d: `M ${$.x} ${$.y} A ${x} ${x} 0 ${k > K + 180 ? "1" : "0"} 1 ${R.x} ${R.y}`,
                  fill: "none",
                  stroke: "var(--piano-accent)",
                  strokeWidth: j,
                  strokeLinecap: "round"
                }
              ),
              /* @__PURE__ */ t.jsx(
                "circle",
                {
                  cx: p,
                  cy: p,
                  r: E,
                  fill: `url(#${o}-knob-bg)`,
                  filter: `url(#${o}-knob-shadow)`
                }
              ),
              /* @__PURE__ */ t.jsx(
                "circle",
                {
                  cx: p,
                  cy: p,
                  r: E,
                  fill: `url(#${o}-knob-highlight)`
                }
              ),
              /* @__PURE__ */ t.jsx(
                "line",
                {
                  x1: p,
                  y1: p,
                  x2: R.x,
                  y2: R.y,
                  stroke: "var(--piano-text-primary)",
                  strokeWidth: 2.5,
                  strokeLinecap: "round"
                }
              ),
              /* @__PURE__ */ t.jsx("circle", { cx: p, cy: p, r: 3, fill: "var(--piano-accent)" })
            ] })
          }
        ),
        /* @__PURE__ */ t.jsx(
          "span",
          {
            style: {
              fontSize: 10,
              fontWeight: 600,
              color: "var(--piano-text-muted)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontFamily: "ui-monospace, monospace"
            },
            children: o
          }
        ),
        /* @__PURE__ */ t.jsxs(
          "span",
          {
            style: {
              fontSize: 10,
              fontWeight: 700,
              fontFamily: "ui-monospace, monospace",
              color: "var(--piano-accent)",
              background: "var(--piano-bg-tertiary)",
              border: "1px solid var(--piano-accent)",
              borderRadius: 3,
              padding: "1px 6px",
              fontVariantNumeric: "tabular-nums",
              lineHeight: "16px"
            },
            children: [
              m(n),
              r ?? ""
            ]
          }
        )
      ]
    }
  );
}, De = [
  { id: 1, name: "sine" },
  { id: 2, name: "triangle" },
  { id: 3, name: "sawtooth" },
  { id: 4, name: "square" }
], Fe = De.map((o) => o.name), le = {
  sine: "M0,5 C3,0 4,0 7,5 C10,10 11,10 14,5",
  triangle: "M0,9 L3.5,1 L7,9 L10.5,1 L14,9",
  sawtooth: "M0,1 L7,9 L7,1 L14,9 L14,1",
  square: "M0,1 L3.5,1 L3.5,9 L7,9 L7,1 L10.5,1 L10.5,9 L14,9 L14,1"
}, Ie = ({
  defaultValue: o,
  onChange: l
}) => {
  const [s, d] = U(
    () => de(o) ? o : "sine"
  );
  return /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
    /* @__PURE__ */ t.jsx("style", { children: `
@keyframes scrollWave { from { transform: translateX(0); } to { transform: translateX(-14px); } }
.wave-btn { font-weight: 400; }
.wave-btn:hover { font-weight: 700; }
.wave-btn.selected { font-weight: 700; }
.wave-btn .wave-scroll { animation: scrollWave 1s linear infinite; animation-play-state: paused; }
.wave-btn:hover .wave-scroll, .wave-btn.selected:hover .wave-scroll { animation-play-state: running; }
` }),
    /* @__PURE__ */ t.jsxs(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          padding: 8
        },
        children: [
          /* @__PURE__ */ t.jsx(
            "span",
            {
              style: {
                fontSize: 10,
                fontWeight: 600,
                color: "var(--piano-text-muted)",
                letterSpacing: "0.05em",
                textTransform: "uppercase"
              },
              children: "Wave"
            }
          ),
          /* @__PURE__ */ t.jsx(
            "div",
            {
              style: {
                background: "var(--piano-bg-tertiary)",
                border: "1px solid var(--piano-accent)",
                borderRadius: 4,
                padding: 4,
                boxSizing: "border-box"
              },
              children: Fe.map((a) => {
                const r = s === a;
                return /* @__PURE__ */ t.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      d(a), l == null || l(a);
                    },
                    className: "wave-btn" + (r ? " selected" : ""),
                    style: {
                      display: "block",
                      width: "100%",
                      padding: "3px 6px",
                      margin: 0,
                      border: "none",
                      borderRadius: 2,
                      background: r ? "var(--piano-accent)" : "transparent",
                      color: r ? "var(--piano-bg-tertiary)" : "var(--piano-accent)",
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 10,
                      textAlign: "left",
                      cursor: "pointer",
                      lineHeight: "14px",
                      boxSizing: "border-box"
                    },
                    children: [
                      /* @__PURE__ */ t.jsx(
                        "svg",
                        {
                          viewBox: "0 0 14 10",
                          width: 14,
                          height: 10,
                          style: {
                            verticalAlign: "middle",
                            marginRight: 2,
                            display: "inline",
                            overflow: "hidden"
                          },
                          children: /* @__PURE__ */ t.jsxs("g", { className: "wave-scroll", children: [
                            /* @__PURE__ */ t.jsx(
                              "path",
                              {
                                d: le[a] ?? "",
                                fill: "none",
                                stroke: r ? "var(--piano-bg-tertiary)" : "var(--piano-accent)",
                                strokeWidth: 1.3,
                                strokeLinecap: "round",
                                strokeLinejoin: "round"
                              }
                            ),
                            /* @__PURE__ */ t.jsx(
                              "path",
                              {
                                d: le[a] ?? "",
                                fill: "none",
                                stroke: r ? "var(--piano-bg-tertiary)" : "var(--piano-accent)",
                                strokeWidth: 1.3,
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                transform: "translate(14, 0)"
                              }
                            )
                          ] })
                        }
                      ),
                      a
                    ]
                  },
                  a
                );
              })
            }
          )
        ]
      }
    )
  ] });
}, Ye = (o) => ({
  gain: (r) => {
    o({ gain: r });
  },
  oscillator: (r) => {
    de(r) && o({ oscillator: r });
  },
  attack: (r) => {
    o({ attack: r });
  },
  decay: (r) => {
    o({ decay: r });
  }
}), ze = ({
  set: o,
  defaultValues: l
}) => {
  const s = Ye(o);
  return {
    knobs: [
      {
        name: "Gain",
        control: () => /* @__PURE__ */ t.jsx(
          re,
          {
            name: "Gain",
            defaultValue: l == null ? void 0 : l.gain,
            min: 0,
            max: 1,
            step: 0.05,
            onChange: s.gain
          }
        )
      },
      {
        name: "Attack",
        control: () => /* @__PURE__ */ t.jsx(
          re,
          {
            name: "Attack",
            defaultValue: l == null ? void 0 : l.attack,
            min: 0.01,
            max: 2,
            step: 0.01,
            unit: "s",
            onChange: s.attack
          }
        )
      },
      {
        name: "Decay",
        control: () => /* @__PURE__ */ t.jsx(
          re,
          {
            name: "Decay",
            defaultValue: l == null ? void 0 : l.decay,
            min: 0.01,
            max: 2,
            step: 0.01,
            unit: "s",
            onChange: s.decay
          }
        )
      }
    ],
    buttonGroups: [
      {
        name: "Oscillator",
        control: () => /* @__PURE__ */ t.jsx(
          Ie,
          {
            defaultValue: l == null ? void 0 : l.oscillator,
            onChange: s.oscillator
          }
        )
      }
    ]
  };
}, Ge = ({
  set: o,
  defaultValues: l,
  onClose: s
}) => {
  const { knobs: d, buttonGroups: a } = ze({ set: o, defaultValues: l }), r = (u) => u.map(({ name: n, control: f }, S) => /* @__PURE__ */ t.jsx(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4
      },
      children: f()
    },
    `${n}-${S}`
  ));
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      style: {
        display: "flex",
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        padding: "12px 16px",
        background: "var(--piano-controls-bg)",
        borderRadius: "8px 8px 0 0",
        boxSizing: "border-box"
      },
      children: [
        /* @__PURE__ */ t.jsx(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 16
            },
            children: r(d)
          }
        ),
        /* @__PURE__ */ t.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 16
            },
            children: [
              r(a),
              s && /* @__PURE__ */ t.jsxs(
                "button",
                {
                  type: "button",
                  onClick: s,
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 6,
                    background: "transparent",
                    padding: 6,
                    color: "var(--piano-text-muted)",
                    border: "1px solid var(--piano-border-strong)",
                    cursor: "pointer"
                  },
                  children: [
                    /* @__PURE__ */ t.jsx(
                      "span",
                      {
                        style: {
                          position: "absolute",
                          width: 1,
                          height: 1,
                          overflow: "hidden",
                          clip: "rect(0,0,0,0)"
                        },
                        children: "Close keyboard"
                      }
                    ),
                    /* @__PURE__ */ t.jsxs(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "18",
                        height: "18",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          /* @__PURE__ */ t.jsx("line", { x1: "18", x2: "6", y1: "6", y2: "18" }),
                          /* @__PURE__ */ t.jsx("line", { x1: "6", x2: "18", y1: "6", y2: "18" })
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}, Z = (o, l) => getComputedStyle(document.documentElement).getPropertyValue(o).trim() || l, Ue = ({
  analyserNode: o,
  width: l,
  height: s = 60,
  strokeColor: d,
  backgroundColor: a
}) => {
  const r = B(null), u = B(0);
  return oe(() => {
    const n = r.current;
    if (!n || !o) return;
    const f = n.getContext("2d");
    if (!f) return;
    const S = o.frequencyBinCount, w = new Uint8Array(S), T = n.parentElement, k = () => {
      T && (n.width = T.clientWidth, n.height = s);
    };
    k();
    const m = new ResizeObserver(k);
    T && m.observe(T);
    let P = a ?? Z("--piano-waveform-bg", "#000"), L = d ?? Z("--piano-accent", "#3b82f6");
    const i = new MutationObserver(() => {
      P = a ?? Z("--piano-waveform-bg", "#000"), L = d ?? Z("--piano-accent", "#3b82f6");
    });
    i.observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["data-theme", "class"]
    });
    const y = () => {
      u.current = requestAnimationFrame(y), o.getByteTimeDomainData(w), f.clearRect(0, 0, n.width, n.height), f.fillStyle = P, f.fillRect(0, 0, n.width, n.height), f.lineWidth = 2, f.strokeStyle = L, f.beginPath();
      const A = n.width / S;
      let p = 0;
      for (let x = 0; x < S; x++) {
        const E = (w[x] ?? 128) / 128 * n.height / 2;
        x === 0 ? f.moveTo(p, E) : f.lineTo(p, E), p += A;
      }
      f.lineTo(n.width, n.height / 2), f.stroke();
    };
    return y(), () => {
      cancelAnimationFrame(u.current), m.disconnect(), i.disconnect();
    };
  }, [o, s, d, a]), /* @__PURE__ */ t.jsx(
    "div",
    {
      style: {
        width: l ? `${l}px` : "100%",
        minWidth: 0
      },
      children: /* @__PURE__ */ t.jsx(
        "canvas",
        {
          ref: r,
          style: { display: "block", width: "100%", borderRadius: "0.5rem" },
          height: s
        }
      )
    }
  );
}, Xe = ({
  rows: o,
  start: l,
  end: s,
  controls: d,
  waveform: a,
  audioContext: r,
  analyserNode: u,
  oscillator: n,
  gain: f,
  attack: S,
  decay: w
}) => {
  const T = !!d, k = !!a, m = typeof d == "object" ? d : void 0, P = typeof a == "object" ? a : void 0, L = B(null), i = !r && !u, [y, A] = U(() => !i), [p, x] = U(null), [j, E] = U(null);
  oe(() => {
    if (i && y)
      try {
        const v = window.AudioContext || "webkitAudioContext" in window && window.webkitAudioContext;
        if (v) {
          const z = new v(), e = k ? z.createAnalyser() : null;
          return x(z), e && E(e), () => {
            z.close().catch((c) => console.warn("Failed to close AudioContext:", c)), x(null), E(null);
          };
        }
      } catch (v) {
        console.error("Failed to initialize AudioContext:", v);
      }
  }, [i, y, k]);
  const D = r ?? p ?? void 0, $ = u ?? j ?? void 0, { notes: R, rowNotes: M, defaultMap: b, audio: N, mapping: C, inputProps: I } = me({
    rows: o,
    start: l,
    end: s,
    audioContext: D,
    analyserNode: $,
    oscillator: n,
    gain: f,
    attack: S,
    decay: w
  }), W = () => {
    A(!0), setTimeout(() => {
      var v;
      (v = L.current) == null || v.focus();
    }, 50);
  }, Y = () => {
    A(!1), m != null && m.onClose && m.onClose();
  }, F = {
    audio: {
      start: N.start,
      stop: N.stop,
      playingNotes: N.playingNotes
    },
    mapping: {
      keyNoteMap: b,
      customKeyMap: C.keyMap,
      editMode: C.editMode,
      selectedNote: C.selectedNote,
      conflictNote: C.conflictNote,
      onNoteSelect: C.selectNote
    }
  }, q = xe(
    () => M ? Math.max(
      M[0].filter((v) => !v.includes("#")).length,
      M[1].filter((v) => !v.includes("#")).length
    ) : 0,
    [M]
  );
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      ...I,
      ref: L,
      tabIndex: 0,
      style: { minWidth: "320px", outline: "none" },
      className: O.case,
      children: [
        (T || k) && /* @__PURE__ */ t.jsxs("div", { className: O.topPanel, children: [
          T && /* @__PURE__ */ t.jsx(
            Ge,
            {
              set: N.set,
              defaultValues: N.controlValues,
              onClose: i ? Y : m == null ? void 0 : m.onClose,
              ...m
            }
          ),
          k && /* @__PURE__ */ t.jsx("div", { className: O.screen, children: /* @__PURE__ */ t.jsx(
            Ue,
            {
              analyserNode: $,
              ...P
            }
          ) })
        ] }),
        /* @__PURE__ */ t.jsxs("div", { className: O.notesWell, style: { position: "relative" }, children: [
          !y && /* @__PURE__ */ t.jsx(
            "div",
            {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(15, 23, 42, 0.75)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                borderRadius: "0 0 14px 14px"
              },
              children: /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  onClick: W,
                  style: {
                    background: "var(--piano-accent, #3b82f6)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    fontFamily: "ui-monospace, monospace",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  },
                  onMouseEnter: (v) => {
                    v.currentTarget.style.transform = "scale(1.05)", v.currentTarget.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.6)";
                  },
                  onMouseLeave: (v) => {
                    v.currentTarget.style.transform = "scale(1)", v.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
                  },
                  children: "Start Piano"
                }
              )
            }
          ),
          M ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx(
              ne,
              {
                id: "piano-top",
                notes: M[1],
                whiteCount: q,
                ...F
              }
            ),
            /* @__PURE__ */ t.jsx(
              ne,
              {
                id: "piano-bottom",
                notes: M[0],
                whiteCount: q,
                ...F
              }
            )
          ] }) : /* @__PURE__ */ t.jsx(ne, { id: "piano", notes: R, ...F })
        ] })
      ]
    }
  );
};
export {
  Ge as C,
  Xe as P,
  Ue as W,
  ne as a
};
//# sourceMappingURL=Piano-CAVxMSI-.js.map
