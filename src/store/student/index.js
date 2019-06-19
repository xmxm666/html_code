import {requestByGet, requestByPost} from "../../utils/request";

export default {
  namespaced: true,
  state: {
    studentList: {},
    leaveList:{},
    logoutList:{},
    tableDataList:[],
    tableDatagoodList:[]
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
      },
      SET_TABLE_LIST_DATA(state,data){
        state.tableDataList=data
      },
      SET_Good_LIST_DATA(state,data){
        state.tableDatagoodList=data
      }
  },
  actions: {
     // 获取学员列表
    async getStudentList({commit}, params) {
     const {data,code} = await requestByPost("server/teacher/userList", params);
     commit('SET_STUDENT_DATA',data);
     return {data,code}
    },
     // 获取请假列表
       async getLeaveList({commit}, params) {
        const {data} = await requestByPost("server/teacher/vacateList", params);
        commit('SET_LEAVE_LIST_DATA',data);
       },
       //获取学员风采列表
       async getGoodList({commit}, params) {
        const {data} = await requestByPost("server/findUserShowAll", params);
        commit('SET_Good_LIST_DATA',data);
        return data
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
      //获取投稿信息
      async getStudentInfo({commit}, params) {
        return await requestByGet("user/findContributeByCid", params);
      },
      //删除学员信息
      async deleteStudent({commit}, params) {
        console.log('删除')
        return await requestByPost("user/UpdateUserSchoolId", params);
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
    //获取学员投稿列表
    async getContributeList({commit}, params) {
      const {data} = await requestByPost("server/admin/contributeList", params);
      commit('SET_TABLE_LIST_DATA',data);
      return data
    },
    //修改投稿状态
    async passStudentContribute({commit}, params) {
      return await requestByPost("server/admin/auditContribute", params);
    },
    //修改投稿信息
    async passStudentContriType({commit}, params) {
      return await requestByPost("/server/admin/updateUserContribute", params);
    },
    //删除学员投稿
    async deleteStudentUp({commit}, params) {
      return await requestByPost("user/deleteUserContribute", params);
    },
      //获取精品课程详情
    async getArticlDetails({commit}, params) {
      return await requestByGet("/server/fineCourse/findFineCourse", params);
    },
      //获取学员风采详情
      async getArticlDetails2({commit}, params) {
        return await requestByGet("/server/queryUserShowById", params);
      },

    //添加修改展示学员
    async addArticle({commit}, params) {
      return await requestByPost("/server/WorksShow/updateUserShowById", params);
    },
    //添加修改精品课程
    async addgoodArticle({commit}, params) {
      return await requestByPost("/server/fineCourse/createFineCourse", params);
    },
    //删除请假列表信息
    async deletestudent({commit}, params) {
      return await requestByPost("/server/WorksShow/deleteUserShowById", params);
    },
  },
  modules: {}
}
