import Vuex from "vuex";
import Vue from 'vue';
import storeInitial from './storeinitial';

Vue.use(Vuex);
export default new Vuex.Store(storeInitial);
