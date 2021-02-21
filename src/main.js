import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./js/store";
import JsonViewer from "vue-json-viewer";
import {cacheInit} from "./js/cache"

// firebase analytics
import { initFb, fbuiInit } from "./js/fb";
initFb();

// initialize firebase auth
fbuiInit(store);
cacheInit(store);

Vue.use(JsonViewer);

import TabVisibility from "@/js/classes/tabvisibility";
const tabVisibility = new TabVisibility();

Vue.config.productionTip = false;

// initialize github

// initialize gapi
store.dispatch("gapi");

// get initial git data from cache
store.dispatch("vizzyInit");

new Vue({
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");

// when tab comes in view, its possible a new render is needed
tabVisibility
  .onVisible(() => store.dispatch("updateRoot", true))
  .onHidden(() => store.commit("setInfoMoused", false));
