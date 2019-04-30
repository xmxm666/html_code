import {requestByGet, requestByPost} from "../../utils/request";
import {base64decode} from "../../utils";
import permission from './permission'

export default {
  namespaced: true,
  state: {
    administratorList: {},
    adminUser: {}
  },
  mutations: {
    SET_USER(state, data) {
      if (!data) return;
      state.adminUser = data;
    }, SET_ADMINISTRATOR_LIST(state, data) {
      state.administratorList = data;
    },
  },
  actions: {
    async login({commit}, params) {
      const res = await requestByPost("server/admin/login", params);
      const {data, code} = res;
      if (code === '200') {
        localStorage.setItem("token", data.token);
        commit("SET_USER", data.administrator);
      }
      return res;
    },
    initAdmin({commit}) {
      const token = localStorage.getItem("token");
      if (token) {
        const body = token.split(".")[1];
        commit("SET_USER", (base64decode(body)).sub);
      }
    }, async getAllAdministratorArr({commit}, params) {
      const res = await requestByGet("web/administrator/getAllAdministrator", params);
      commit("SET_ADMINISTRATOR_LIST", res.data);
      return res;
    }, async updateOrAddAdministrator({commit}, params) {
      const res = await requestByPost("web/administrator/createOrUpdateAdministrator", params);
      if (res.data) {
        localStorage.setItem("token", res.data);
        const body = res.data.split(".")[1];
        commit("SET_USER", (base64decode(body)).sub);
      }
      return res;
    }, async deleteAdministratorAction({commit}, params) {
      return await requestByPost("web/administrator/deleteAdministratorAction", params);
    },
  },
  modules: {
    permission
  }
}
