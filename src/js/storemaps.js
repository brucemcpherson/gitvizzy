import storeIntial from "./storeinitial";
import Vuex from 'vuex';

const _vxMaps = Object.keys(storeIntial).reduce((p, c) => {
  p[c] = Object.keys(storeIntial[c]);
  return p;
}, {});

const maps = Object.keys(_vxMaps).reduce((p, c) => {
  const method = `map${c.slice(0, 1).toUpperCase()}${c.slice(1)}`;
  p[c] =   Vuex[method](_vxMaps[c]);
  return p;
}, {});

export default maps;
