import {requestByGet, requestByPost} from "../../utils/request";

export default {
  namespaced: true,
  state: {
    studentList: {},
    leaveList:{},
    logoutList:{}

  },
  mutations: {
    SET_STUDENT_DATA(state, data) {
      state.studentList = data;
    },
    SET_LEAVE_LIST_DATA(state, data) {
        state.leaveList = data;
      },
      SET_LOGOUT_LIST_DATA(state, data) {
        state.logoutList = data;
      }
  },
  actions: {
     // 获取学员列表
    async getStudentList({commit}, params) {
     const {data} = await requestByPost("server/teacher/userList", params);
     commit('SET_STUDENT_DATA',data);
    },
     // 获取请假列表
     async getLeaveList({commit}, params) {
        const {data} = await requestByPost("server/teacher/vacateList", params);
        commit('SET_LEAVE_LIST_DATA',data);
       },
       //删除请假列表信息
       async deleteLeave({commit}, params) {
        return await requestByGet("server/teacher/deleteVacate", params);
      },
       //添加学员
       async addStudent({commit}, params) {
         return await requestByPost("server/teacher/createUser", params);
       },
       //获取学员信息
       async getStudentDetails({commit}, params) {
        return await requestByPost("server/teacher/findUser", params);
      },
      //删除学员信息
      async deleteStudent({commit}, params) {
        return await requestByPost("user/deleteUserItem", params);
      },
      //获取学员申请列表
      async getLogoutList({commit}, params) {
        const {data} = await requestByPost("server/teacher/userWithdrawList", params);
        commit('SET_LOGOUT_LIST_DATA',data);
      },
      /*
      *学员审核
      *checkin 	0:通过，1：待审核，2：拒绝
      */
     async passStudent({commit}, params) {
      return await requestByPost("server/teacher/auditUser", params);
    },
     //注销审核
     async passStudentLogout({commit}, params) {
      return await requestByPost("server/teacher/auditWithdraw", params);
    },
  },
  modules: {}
}
