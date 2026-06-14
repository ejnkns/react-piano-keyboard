"use strict";const t=require("react"),i=()=>{const[e,o]=t.useState();return t.useEffect(()=>{if(!e){const n=window.AudioContext||"webkitAudioContext"in window&&window.webkitAudioContext;o(new n)}return()=>{e==null||e.close()}},[e]),e};exports.useAudioContext=i;
//# sourceMappingURL=useAudioContext-COAMtTG1.cjs.map
