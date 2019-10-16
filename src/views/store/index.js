import Vue from "vue";
import Vuex from "vuex";
import getTreeId from "./getTreeId";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    getTreeId
  }
});
