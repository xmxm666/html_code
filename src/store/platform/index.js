import {requestByGet} from "../../utils/request";

export default {
  namespaced: true,
  state: {
    appPages: []
  },
  mutations: {
    SET_PAGES(state, data) {
      state.appPages = data;
    }
  },
  actions: {
    async getAppPage({commit}, params) {
      const {data} = await requestByGet("appPage/getAllAppPage");
      commit("SET_PAGES", data);
    }
  },
}
