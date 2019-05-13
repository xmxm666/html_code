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
    //添加教师//管理员
    addTeacher({commit}, params) {
      return requestByPost("server/admin/createAdmin", {...params});
    },
  
    //修改教师//管理员
    upDataTeacher({commit}, params) {
      return requestByPost("server/admin/createAdmin", {...params});
    },
    //获取教师详情//管理员
    async getTeacherDetails({commit}, params) {
      return await requestByGet("server/admin/findAdmin", params);
    },
     //删除老师//管理员
     deleteTeacher({commit}, params) {
      return requestByGet("server/admin/deleteAdmin", params);
    },
  },
  modules: {}
}
