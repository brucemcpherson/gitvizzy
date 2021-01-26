import { gasVizzyInit, delay } from "./gasvizzy";

import {
  tree,
  makeOwnerTreeData
} from "./d3prep";

const _initial = {
  state: {
    gd: null,
    mf: null,
    // this'll get set to a proper value once the dom is loaded
    width: 100,
    ownerFilter: [],
    libraryFilter: [],
    oauthScopeFilter: [],
    advancedServiceFilter: [],
    addOnFilter: [],
    runtimeVersionFilter: [],
    repoFilter: [],
    filterPlus: true,
    timeZoneFilter: [],
    webappFilter: [],
    dataStudioFilter: [],
    root: null,
    cacheTimestamp: null,
    making: false,
    showDetail: false,
    infoData: null,
    infoMoused: false,
    vizInfo: true,
    colors: {
      spinner: "amber accent-1",
      bigTree: "red accent-1",
      smallTree: "pink accent-1",
      info: "pink",
    },
  },
  mutations: {
    flipVizInfo (state) { 
      state.vizInfo = !state.vizInfo
    },
    setInfoMoused(state, value) {
      state.infoMoused = value;
    },
    clearRoot(state) { 
      state.root = null;
    },
    setRoot(state) {
      const data = makeOwnerTreeData(state);
      state.root = data ? tree({ data, width: state.width }) : null;
    },
    setMaking(state, value) {
      state.making = value;
    },
    setMf(state, mf) {
      state.mf = mf;
    },
    setGd(state, gd) {
      state.gd = gd;
    },
    setWidth(state, width) {
      state.width = width;
    },
    setCacheTimestamp(state, value) {
      state.cacheTimestamp = value;
    },
    setInfoData(state, value) {
      state.infoData = value;
    },
    _ownerFilter(state, value) {
      state.ownerFilter = value;
    },
    _repoFilter(state, value) {
      state.repoFilter = value;
    },
    _timeZoneFilter(state, value) {
      state.timeZoneFilter = value;
    },
    _webappFilter(state, value) {
      state.webappFilter = value;
    },
    _dataStudioFilter(state, value) {
      state.dataStudioFilter = value;
    },
    _addOnFilter(state, value) {
      state.addOnFilter = value;
    },
    _oauthScopeFilter(state, value) {
      state.oauthScopeFilter = value;
    },
    _advancedServiceFilter(state, value) {
      state.advancedServiceFilter = value;
    },
    _libraryFilter(state, value) {
      state.libraryFilter = value;
    },
    _runtimeVersionFilter(state, value) {
      state.runtimeVersionFilter = value;
    },
    _showDetail(state, value) {
      state.showDetail = value;
    },
    _filterPlus(state, value) {
      state.filterPlus = value;
    },
  },
  actions: {
    vizzyInit({ commit, dispatch }) {
      commit("setMaking", true);
      return gasVizzyInit().then(({ gd, mf, timestamp }) => {
        commit("setGd", gd);
        commit("setMf", mf);
        commit("setCacheTimestamp", timestamp);
        dispatch("updateRoot");
      });
    },
    setOwnerFilter({ dispatch, commit }, value) {
      commit("_ownerFilter", value);
      dispatch("updateRoot");
    },
    setRepoFilter({ dispatch, commit }, value) {
      commit("_repoFilter", value);
      dispatch("updateRoot");
    },
    setTimeZoneFilter({ dispatch, commit }, value) {
      commit("_timeZoneFilter", value);
      dispatch("updateRoot");
    },
    setWebappFilter({ dispatch, commit }, value) {
      commit("_webappFilter", value);
      dispatch("updateRoot");
    },
    setDataStudioFilter({ dispatch, commit }, value) {
      commit("_dataStudioFilter", value);
      dispatch("updateRoot");
    },
    setAddOnFilter({ dispatch, commit }, value) {
      commit("_addOnFilter", value);
      dispatch("updateRoot");
    },
    setOauthScopeFilter({ dispatch, commit }, value) {
      commit("_oauthScopeFilter", value);
      dispatch("updateRoot");
    },
    setAdvancedServiceFilter({ dispatch, commit }, value) {
      commit("_advancedServiceFilter", value);
      dispatch("updateRoot");
    },
    setLibraryFilter({ dispatch, commit }, value) {
      commit("_libraryFilter", value);
      dispatch("updateRoot");
    },
    setRuntimeVersionFilter({ dispatch, commit }, value) {
      commit("_runtimeVersionFilter", value);
      dispatch("updateRoot");
    },

    flipShowDetail({ state, dispatch, commit }) {
      commit("_showDetail", !state.showDetail);
      dispatch("updateRoot");
    },
    flipFilterPlus({ dispatch, state, commit }) {
      commit("_filterPlus", !state.filterPlus);
      dispatch("updateRoot");
    },
    updateRoot({ commit }, force) {
      // this allows re-render of whatever to show before waiting
      // for the length dom update
      if (force) { 
        commit("clearRoot")
      }
      commit("setMaking", true);
      commit("setInfoMoused", false);
      return delay(1).then(() => {
        commit("setRoot");
        commit("setMaking", false);
      });
    },
  },
};

export default _initial;
