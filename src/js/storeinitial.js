/*global gapi*/
import { gasVizzyInit, delay } from "./gasvizzy";
import {
  logEvent,
  getPickerKey,
  signin,
  signinGithub,
  isGoogleTokenValid,
  signout
} from "./fb";
import { applyFilters } from "./filtering";
import { tree, arrangeTreeData } from "./d3prep";
import { setTokenData, getTokenData } from "./forager";

const vTypes = [
  {
    name: "libraries",
    idAccessor: "libraryId",
    filterName: "libraryFilter",
  },
  {
    name: "advancedServices",
    idAccessor: "serviceId",
    filterName: "advancedServiceFilter",
  },

  {
    name: "oauthScopes",
    idAccessor: "",
    filterName: "oauthScopeFilter",
  },
  {
    name: "addOns",
    idAccessor: "id",
    filterName: "addOnFilter",
    objectKeys: true,
  },
  {
    name: "runtimeVersion",
    idAccessor: "",
    filterName: "runtimeVersionFilter",
  },
  {
    name: "webapp",
    idAccessor: "access",
    filterName: "webappFilter",
  },
  {
    name: "dataStudio",
    idAccessor: "name",
    filterName: "dataStudioFilter",
  },
  {
    name: "timeZone",
    idAccessor: "",
    filterName: "timeZoneFilter",
  },
];

const _initial = {
  state: {
    treeModel: [],
    pinned: null,
    pickerKey: getPickerKey(),
    githubToken: null,
    googleToken: null,
    showPullDialog: false,
    user: null,
    gd: null,
    mf: null,
    cfManifests: null,
    // this'll get set to a proper value once the dom is loaded
    width: 100,
    hireableOwners: false,
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
    interlockedFilters: true,
    dob: null,
    fob: null,
    root: null,
    cacheTimestamp: null,
    making: false,
    showDetail: false,
    infoData: null,
    infoMoused: false,
    vizInfo: true,
    fobOwners: null,
    fobRepos: null,
    viewType: "owners",
    colors: {
      spinner: "amber accent-1",
      bigTree: null,
      smallTree: null,
      info: "pink",
      dotChildren: "lime",
      dotNoChildren: "pink",
      vizTextHovered: "#C2185B",
      vizText: "#212121",
    },
    vTypes,
  },
  mutations: {
    setTreeModel(state, value) { 
      state.treeModel = value
    },
     clearTokens(state) {
      state.githubToken = null;
      state.googleToken = null;
    },
    setGithubToken(state, value) {
      console.log("setting githubtoken", value);
      state.githubToken = value;
    },
    setGoogleToken(state, value) {
      state.googleToken = value;
    },
    setPickerApiKey(state, value) {
      state.pickerApiKey = value;
    },
    flipPullDialog(state) {
      state.showPullDialog = !state.showPullDialog;
    },
    setPullDialog(state, value) {
      state.showPullDialog = value;
    },
    setUser(state, value) {
      state.user = value;
    },
    setVizInfo(state, value) {
      state.vizInfo = value;
    },
    setInfoMoused(state, value) {
      state.infoMoused = value;
    },
    clearRoot(state) {
      state.root = null;
    },
    setRoot(state) {
      const data = arrangeTreeData(state);
      state.root = data ? tree({ data, width: state.width }) : null;
    },
    setDob(state, value) {
      state.dob = value;
    },
    setFob(state, value) {
      state.fob = value;
      state.fobOwners = value && value.owners && value.owners.allFiltered();
      state.fobRepos = value && value.repos && value.repos.allFiltered();
    },
    setMaking(state, value) {
      state.making = value;
    },
    setCfManifests(state, mf) {
      state.cfManifests = mf;
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
    _viewType(state, value) {
      state.viewType = value;
    },
    _interlockedFilters(state, value) {
      state.interlockedFilters = value;
    },
    _hireableOwners(state, value) {
      state.hireableOwners = value;
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
      state.filterPls = value;
    },
    setPinned(state, value) {
      state.pinned = value;
    },
  },
  getters: {
    pickerKey() {
      return getPickerKey();
    },
    isLoggedIn(state) {
      return Boolean(state.user);
    },
    userImage(state, getters) {
      return getters.isLoggedIn ? state.user.photoURL : null;
    },
    userName(state, getters) {
      return getters.isLoggedIn ? state.user.displayName : null;
    },
    fobOwners(state) {
      return state.fob && state.fob.owners && state.fob.owners.allFiltered();
    },
    leaves(state) {
      return (state.root && state.root.leaves().length) || null;
    },
  },
  actions: {
    signout({ commit }) {
      return signout(commit);
    },
    signin({ commit, dispatch }) {
      return signin(commit, dispatch);
    },
    signinGithub({ commit, dispatch }) {
      return signinGithub(commit, dispatch);
    },
    newUser({ commit }, value) {
      return commit("setUser", value);
    },
    setStoredTokens({ state }) {
      const { githubToken, googleToken } = state;
      return setTokenData({ githubToken, googleToken });
    },
    getStoredTokens({ commit }) {
      return getTokenData().then((result) => {
        console.log("getting stored tokend", result);
        if (result) {
          const { githubToken, googleToken } = result;
          if (githubToken) commit("setGithubToken", githubToken);
          if (googleToken) commit("setGoogleToken", googleToken);
        }
      });
    },
    vizzyInit({ commit, dispatch }) {
      commit("setMaking", true);

      return gasVizzyInit().then(({ gd, mf, timestamp, dob, fob }) => {
        commit("setGd", gd);
        commit("setMf", mf);
        commit("setCacheTimestamp", timestamp);
        commit("setDob", dob);
        commit("setFob", fob);
        dispatch("updateRoot");
      });
    },
    setInterlockedFilters({ dispatch, commit }, value) {
      commit("_interlockedFilters", value);
      logEvent("filter", {
        name: "interlockedFilters",
        value,
      });
      dispatch("updateRoot");
    },
    setHireableOwners({ dispatch, commit }, value) {
      commit("_hireableOwners", value);
      logEvent("filter", {
        name: "hireableOwners",
        value,
      });
      dispatch("updateRoot");
    },
    setViewType({ dispatch, commit }, value) {
      commit("_viewType", value);
      logEvent("filter", {
        name: "viewType",
        value,
      });
      dispatch("updateRoot");
    },
    setOwnerFilter({ dispatch, commit }, value) {
      commit("_ownerFilter", value);
      logEvent("filter", {
        name: "owners",
        value,
      });
      dispatch("updateRoot");
    },
    setRepoFilter({ dispatch, commit }, value) {
      commit("_repoFilter", value);
      logEvent("filter", {
        name: "repos",
        value,
      });
      dispatch("updateRoot");
    },
    setTimeZoneFilter({ dispatch, commit }, value) {
      commit("_timeZoneFilter", value);
      logEvent("filter", {
        name: "timeZones",
        value,
      });
      dispatch("updateRoot");
    },
    setWebappFilter({ dispatch, commit }, value) {
      commit("_webappFilter", value);
      logEvent("filter", {
        name: "webapps",
        value,
      });
      dispatch("updateRoot");
    },
    setDataStudioFilter({ dispatch, commit }, value) {
      commit("_dataStudioFilter", value);
      logEvent("filter", {
        name: "dataStudios",
        value,
      });
      dispatch("updateRoot");
    },
    setAddOnFilter({ dispatch, commit }, value) {
      commit("_addOnFilter", value);
      logEvent("filter", {
        name: "addOns",
        value,
      });
      dispatch("updateRoot");
    },
    setOauthScopeFilter({ dispatch, commit }, value) {
      commit("_oauthScopeFilter", value);
      logEvent("filter", {
        name: "oauthScopes",
        value,
      });
      dispatch("updateRoot");
    },
    setAdvancedServiceFilter({ dispatch, commit }, value) {
      commit("_advancedServiceFilter", value);
      logEvent("filter", {
        name: "advancedServices",
        value,
      });
      dispatch("updateRoot");
    },
    setLibraryFilter({ dispatch, commit }, value) {
      commit("_libraryFilter", value);
      logEvent("filter", {
        name: "libraries",
        value,
      });
      dispatch("updateRoot");
    },
    setRuntimeVersionFilter({ dispatch, commit }, value) {
      commit("_runtimeVersionFilter", value);
      logEvent("filter", {
        name: "runtimeVersions",
        value,
      });
      dispatch("updateRoot");
    },

    flipShowDetail({ state, dispatch, commit }) {
      commit("_showDetail", !state.showDetail);
      logEvent("filter", {
        name: "showDetail",
        value: state.showDetail,
      });
      dispatch("updateRoot");
    },
    flipFilterPlus({ dispatch, state, commit }) {
      commit("_filterPlus", !state.filterPlus);
      logEvent("filter", {
        name: "filterPlus",
        value: state.filterPlus,
      });
      dispatch("updateRoot");
    },
    flipVizInfo({ state, commit }) {
      commit("setVizInfo", !state.vizInfo);
      logEvent("filter", {
        name: "vizInfo",
        value: state.vizInfo,
      });
    },
    gapi() {
      gapi.load("picker", () => {
        console.log("gapi picker loaded");
      });
    },
    pickerStuff({ commit, dispatch }) {
      signin(commit, dispatch);
    },
    async isGoogleTokenValid({ state }) {
      const isit = await isGoogleTokenValid(state.googleToken);
      return isit
    },
    updateRoot({ commit, state }, force) {
      // this allows re-render of whatever to show before waiting
      // for the length dom update
      if (force) {
        commit("clearRoot");
      }

      commit("setMaking", true);
      commit("setInfoMoused", false);
      const { mf, cfManifests } = applyFilters(state);

      commit("setCfManifests", cfManifests);
      commit("setFob", state.fob);
      commit("setMf", mf);

      return delay(1).then(() => {
        commit("setRoot");
      });
    },
  },
};

export default _initial;
