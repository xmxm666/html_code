import Vuex from 'vuex';
import Vue from 'vue';
import administrator from './administrator'
import lesson from './lesson'
import teacher from './teacher'
import platform from './platform'
import order from './order'
import common from './common'
import school from './school'
import student from './student';
import trade from './trade'
import shop from './shop'
import role from './role'
import {requestByGet, requestByPost} from "../utils/request";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    author: "vijay",
    systemInfo: {}
  },
  mutations: {
    setSystemInfo(state, data) {
      state.systemInfo = data;
    }
  },
  actions: {
    async getSystemInfo({commit}) {
      const {data} = await requestByGet("basic/system/getSystemInfo");
      commit("setSystemInfo", data);
    }, async updateSystemInfo({commit}, params) {
      return await requestByPost("basic/system/updateSystemInfo", params);
    },
    logout(){}
  },
  plugins: [],
  modules: {
    administrator, lesson, platform, teacher,order,common,school,student,trade,shop,role
  }
})
