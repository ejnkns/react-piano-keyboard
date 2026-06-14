import { useState as n, useEffect as i } from "react";
const d = () => {
  const [t, e] = n();
  return i(() => {
    if (!t) {
      const o = window.AudioContext || "webkitAudioContext" in window && window.webkitAudioContext;
      e(new o());
    }
    return () => {
      t == null || t.close();
    };
  }, [t]), t;
};
export {
  d as u
};
//# sourceMappingURL=useAudioContext-DUu4IxSG.js.map
