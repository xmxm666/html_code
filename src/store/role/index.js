import {requestByGet, requestByPost} from "../../utils/request";

export default {
  namespaced: true,
  state: {
    tableDataList:[],
    permissionList:[]
  },
  mutations: {
    SET_TABLE_DATA(state, data) {
      state.tableDataList = data;
    },
    SET_PERMISSION_DATA(state, data) {
      state.permissionList = data;
    }
  },
  actions: {
  //获取角色列表
   async getRoleList({commit}, params) {
    const {data} = await requestByPost("server/role/roleList", params);
    commit('SET_TABLE_DATA',data);
  },
  async getRoleListBySchool({commit}, params) {
    return await requestByPost("server/role/roleList", params);
  },
  //添加修改角色
  async addRole({commit}, params) {
    return await requestByPost("server/role/createRole", params);
  },
  //获取角色详情
  async getRoleDetails({commit}, params) {
    return await requestByGet("server/role/findRole", params);
  },
  //删除角色
  async delRole({commit}, params) {
    return await requestByGet("server/role/deleteRole", params);
  },
  //所有权限列表
  async allPermission({commit}, params) {
    const {data} = await requestByPost("server/role/allPermission", params);
    commit('SET_PERMISSION_DATA',data);
  }
  },
  modules: {}
}
