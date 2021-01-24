import { gasVizzyInit, delay } from "./gasvizzy";

import {
  tree,
  makeOwnerTreeData,
  getOwners,
  getLibraries,
  getAdvancedServices,
  getOauthScopes,
  getAddOns,
  getRuntimeVersions,
  getWebapps,
  getTimeZones,
  getRepos,
  getDataStudios,
} from "./d3prep";

const mapVersions = (ot) => {
  return (ot || []).map((f) => ({
    library: f,
    name: f.label,
    id: f.id,
    versionNames: `versions:${Array.from(f.versions.values())
      .map((g) => g.version)
      .join(",") || f.label}`,
  }));
};

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
    vizInfo: true,
    infoData: null,
    infoMoused: false,
    colors: {
      spinner: "amber accent-1",
      bigTree: "red accent-1",
      smallTree: "pink accent-1",
      info: "pink",
    },
  },
  getters: {
    showVizInfo(state) {
      return Boolean(state.vizInfo && state.infoData && state.infoMoused);
    },
    selectOwners(state) {
      const ot = getOwners({ gd: state.gd });
      return (ot || []).map((f) => f.fields);
    },

    selectRepos(state) {
      const ot = getRepos({ gd: state.gd });
      return (ot || []).map((f) => f.fields);
    },
    selectLibraries(state) {
      return mapVersions(getLibraries(state.mf));
    },

    selectAdvancedServices(state) {
      return mapVersions(getAdvancedServices(state.mf));
    },

    selectRuntimeVersions(state) {
      return mapVersions(getRuntimeVersions(state.mf));
    },
    selectWebapps(state) {
      return mapVersions(getWebapps(state.mf));
    },
    selectDataStudios(state) {
      return mapVersions(getDataStudios(state.mf));
    },
    selectTimeZones(state) {
      return mapVersions(getTimeZones(state.mf));
    },
    selectOauthScopes(state) {
      const ot = getOauthScopes(state.mf);
      return (ot || []).map((f) => ({
        oauthScope: f,
        name: f.label.replace("https://www.googleapis.com/auth/", ""),
        id: f.id,
        versionNames: f.label,
      }));
    },

    selectAddOns(state) {
      const ot = getAddOns(state.mf);

      return (ot || []).map((f) => ({
        addOn: f,
        name: f.label,
        id: f.id,
        versionNames: `${f.label} addOns`,
      }));
    },
  },
  mutations: {
    setInfoMoused(state, value) {
      state.infoMoused = value;
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
    setVizInfo(state, value) {
      state.vizInfo = value;
    },
    setInfoData(state, value) {
      state.infoData = value;
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
    setOwnerFilter({ state, dispatch }, value) {
      state.ownerFilter = value;
      dispatch("updateRoot");
    },
    setRepoFilter({ dispatch, state }, value) {
      state.repoFilter = value;
      dispatch("updateRoot");
    },
    setTimeZoneFilter({ dispatch, state }, value) {
      state.timeZoneFilter = value;
      dispatch("updateRoot");
    },
    setWebappFilter({ dispatch, state }, value) {
      state.webappFilter = value;
      dispatch("updateRoot");
    },
    setDataStudioFilter({ dispatch, state }, value) {
      state.dataStudioFilter = value;
      dispatch("updateRoot");
    },
    setAddOnFilter({ dispatch, state }, value) {
      state.addOnFilter = value;
      dispatch("updateRoot");
    },
    setOauthScopeFilter({ dispatch, state }, value) {
      state.oauthScopeFilter = value;
      dispatch("updateRoot");
    },
    setAdvancedServiceFilter({ dispatch, state }, value) {
      state.advancedServiceFilter = value;
      dispatch("updateRoot");
    },
    setLibraryFilter({ dispatch, state }, value) {
      state.libraryFilter = value;
      dispatch("updateRoot");
    },
    setRuntimeVersionFilter({ dispatch, state }, value) {
      state.runtimeVersionFilter = value;
      dispatch("updateRoot");
    },

    flipShowDetail({ state, dispatch }) {
      state.showDetail = !state.showDetail;
      dispatch("updateRoot");
    },
    flipFilterPlus({ dispatch, state }) {
      state.filterPlus = !state.filterPlus;
      dispatch("updateRoot");
    },
    updateRoot({ commit }) {
      // this allows re-render of whatever to show before waiting
      // for the length dom update
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
