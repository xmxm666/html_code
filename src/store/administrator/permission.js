import {requestByGet, requestByPost} from "../../utils/request";

export default {
  namespaced: true,
  state: {
    permissionList: {},
    permissionPathList: [],
  },
  mutations: {
    SET_PERMISSION_LIST(state, data) {
      state.permissionList = data;
    }, SET_PERMISSION_PATH_LIST(state, data) {
      state.permissionPathList = data;
    },
  },
  actions: {
    async getAllPermissionList({commit}, params) {
      const {data} = await requestByGet("web/permission/getPermissionList", params)
      commit("SET_PERMISSION_LIST", data);
    }, async getAllPermissionPath({commit}, params) {
      const {data} = await requestByGet("web/permission/getAllPermissionPath", params)
      commit("SET_PERMISSION_PATH_LIST", data);
    }, async updateOrAddPermissionAction({commit}, params) {
      return await requestByPost("web/permission/createOrUpdatePermission", params)
    },
    async getAllPurePermission({commit}) {
      const {data} = await requestByGet("web/permission/getAllPurePermission")
      return data;
    }, async getUserAllPermissionPath({commit}) {
      const {data} = await requestByGet("web/permission/getUserAllPermissionPath")
      return data;
    }, async deletePermissionAction({commit}, params) {
      return await requestByPost("web/permission/deletePermissionList", params)
    },
  },
}
