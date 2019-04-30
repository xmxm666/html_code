import {requestByGet, requestByPost} from "../../utils/request";

export default {
  namespaced: true,
  state: {
    studentList: {},
    leaveList:{},

  },
  mutations: {
    SET_STUDENT_DATA(state, data) {
      state.studentList = data;
    },
    SET_LEAVE_LIST_DATA(state, data) {
        state.leaveList = data;
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
  },
  modules: {}
}
