/*global gapi*/
import { gasVizzyInit, delay } from "./gasvizzy";
import {
  logEvent,
  signin,
  signinGithub,
  signout,
  gapiInit,
  getPickerKey,
  getProjectId,
  gapiCheckScopes,
  gapiAdditionalScopes,
} from "./auth";
import { applyFilters } from "./filtering";
import { tree, arrangeTreeData, depths } from "./d3prep";
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
    gettingData: false,
    urlParams: null,
    resvg: false,
    showMessage: null,
    showError: false,
    spinning: false,
    appId: getProjectId(),
    pickerKey: getPickerKey(),
    isSignedIn: false,
    treeModel: [],
    pinned: null,
    githubToken: null,
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
      gettingData: "red",
      making: "orange",
      tagChip: "teal accent-4",
    },
    vTypes,
    depth: depths.REPO,
  },
  mutations: {
    incrementDepth(state, value) {
      state.depth += value;
    },
    setDepth(state, value) {
      state.depth = value;
    },
    setGettingData(state, value) {
      state.gettingData = value;
    },
    setUrlParams(state, value) {
      state.urlParams = value;
    },
    setUrlParamsDone(state) {
      state.urlParams = {
        ...state.urlParams,
        doit: false,
      };
    },
    setResetsvg(state, value) {
      state.resetSvg = value;
    },
    setShowError(state, value) {
      state.showError = !!value;
      state.showMessage = value;
    },
    setSpinning(state, value) {
      state.spinning = value;
    },
    setIsSignedIn(state, value) {
      state.isSignedIn = value;
    },
    setTreeModel(state, value) {
      state.treeModel = value;
    },

    clearTokens(state) {
      state.githubToken = null;
    },
    setGithubToken(state, value) {
      state.githubToken = value;
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
    _filterPlus(state, value) {
      state.filterPls = value;
    },
    setPinned(state, value) {
      state.pinned = value;
    },
  },
  getters: {
    canDeeper(state) {
      return state.depth <= depths.FILE;
    },
    canShallower(state) {
      return state.depth > depths.REPO;
    },
    dataColor(state) {
      return state.gettingData
        ? state.colors.gettingData
        : state.making
        ? state.colors.making
        : "accent";
    },
    checkScopes(state, getters) {
      return gapiCheckScopes(getters.isLoggedIn && state.user);
    },
    googleToken(state, getters) {
      const t = getters.isLoggedIn && state.user.getAuthResponse(true);
      return t && t.access_token;
    },
    isLoggedIn(state) {
      return state.user && state.user.isSignedIn();
    },
    userImage(state, getters) {
      return getters.isLoggedIn
        ? state.user.getBasicProfile().getImageUrl()
        : null;
    },
    userName(state, getters) {
      return getters.isLoggedIn ? state.user.getBasicProfile().getName() : null;
    },
    userEmail(state, getters) {
      return getters.isLoggedIn
        ? state.user.getBasicProfile().getEmail()
        : null;
    },
    fobOwners(state) {
      return state.fob && state.fob.owners && state.fob.owners.allFiltered();
    },
    leaves(state) {
      return (state.root && state.root.leaves().length) || null;
    },
  },
  actions: {
    goDeeper({ commit, dispatch }) {
      commit("incrementDepth", 1);
      dispatch("updateRoot");
    
    },

    goShallower({ commit, dispatch }) {
      commit("incrementDepth", -1);
      dispatch("updateRoot");
    },
    signout({ commit }) {
      return signout(commit);
    },
    signin() {
      return signin();
    },
    signinGithub({ commit, dispatch }) {
      return signinGithub(commit, dispatch);
    },
    setStoredTokens({ state }) {
      const { githubToken } = state;
      return setTokenData({ githubToken });
    },
    getStoredTokens({ commit }) {
      return getTokenData().then((result) => {
        if (result) {
          const { githubToken } = result;
          if (githubToken) commit("setGithubToken", githubToken);
        }
      });
    },
    vizzyInit({ commit, dispatch }, force) {
      commit("setMaking", true);
      commit("setGettingData", true);
      return gasVizzyInit(force).then(({ gd, mf, timestamp, dob, fob }) => {
        commit("setGettingData", false);
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
    moreScopes({ state }) {
      gapiAdditionalScopes(state.user);
    },
    gapi({ commit }) {
      gapi.load("picker:auth2:client", () => {
        // the gapi modules are loaded
        // now initialize the auth
        gapiInit((user) => {
          // record this user
          commit("setUser", user);
        }).catch((error) => {
          console.log("failed to gapiinit", error);
        });
      });
    },
    fixParamsLevel({ commit, state }, vp) {
      // its possible we're not at a deep enough level for the param being sought
      if (vp && vp.type === "manifest" && state.depth < depths.FILE) {
        commit("setDepth", depths.FILE)
      } 
      commit("setUrlParams", vp);
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
