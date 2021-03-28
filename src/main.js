import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./js/store";
import JsonViewer from "vue-json-viewer";
import { forageInit } from "./js/forager";
import { initFb, fbuiInit } from "./js/auth";
import { dealWithParams } from "./js/params";

// local storage
forageInit();

// firebase analytics
initFb();

// initialize firebase auth
fbuiInit(store.dispatch);

// get any stored tokens
store.dispatch('getStoredTokens');

Vue.use(JsonViewer);

import TabVisibility from "@/js/classes/tabvisibility";
// eslint-disable-next-line no-unused-vars
const tabVisibility = new TabVisibility();

Vue.config.productionTip = false;

// initialize gapi
store.dispatch("gapi");

// get any url params
dealWithParams(store);

// get initial git data from cache
store.dispatch("vizzyInit");

new Vue({
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");

// when tab comes in view, its possible a new render is needed
// this seems to be taking care of itself without the need for this
// except for occassionally from developer tools interactions
// so let's leave this out for now
/*
tabVisibility
  .onVisible(() => store.dispatch("updateRoot", true))
  .onHidden(() => store.commit("setInfoMoused", false));
*/