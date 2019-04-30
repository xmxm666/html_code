import {requestByGet, requestByPost} from "../../utils/request";

export default {
  namespaced: true,
  state: {
    teacherList: {}
  },
  mutations: {
    SET_TABLE_DATA(state, data) {
      state.tableDataList = data;
    }
  },
  actions: {
    //添加教师
    addTeacher({commit}, params) {
      return requestByPost("server/admin/createTeacher", params);
    },
    //修改教师
    upDataTeacher({commit}, params) {
      return requestByPost("server/admin/updateAdmin", params);
    },
    //获取教师详情
    async getTeacherDetails({commit}, params) {
      return await requestByGet("server/admin/findTeacher", params);
    },
     //删除老师
     deleteTeacher({commit}, params) {
      return requestByGet("server/admin/deleteAdmin", params);
    },
  },
  modules: {}
}
