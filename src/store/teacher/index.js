import {requestByGet, requestByPost} from "../../utils/request";

export default {
  namespaced: true,
  state: {
    teacherList: {},
    tableDatagoodList:{}
  },
  mutations: {
    SET_TABLE_DATA(state, data) {
      state.tableDataList = data;
    },
    SET_Good_LIST_DATA(state,data){
      state.tableDatagoodList=data;
      console.log(state.tableDatagoodList)
    }
  },
  actions: {
    //添加教师//管理员
    addTeacher({commit}, params) {
      return requestByPost("server/admin/createAdminRole", {...params});
    },

    //修改教师//管理员
    upDataTeacher({commit}, params) {
      return requestByPost("server/admin/createAdminRole", {...params});
    },
    //获取教师详情//管理员
    async getTeacherDetails({commit}, params) {
      return await requestByGet("server/admin/findAdmin", params);
    },
     //删除老师//管理员
     deleteTeacher({commit}, params) {
      return requestByGet("server/admin/deleteAdmin", params);
    },
    //获取教师风采列表
    async getGoodList({commit}, params) {
      const {data,code,msg} = await requestByPost("/server/findTeacherShowAll", params);
      commit('SET_Good_LIST_DATA',data);
      console.log({data,code,msg})
      return data
     },
     //删除教师风采列表信息
    async deleteteacher({commit}, params) {
      console.log(111)
      return await requestByPost("/server/WorksShow/deleteTeacherShowById", params);
    },
    //添加修改教师风采
    async addArticle({commit},params){
      return await requestByPost("/server/WorksShow/updateTeacherShowById",params)
    },
    //获取该条教师风采
    async getArticlDetails2({commit},params){
      return await requestByGet("/server/queryTeacherShowById",params)
    }
  },
  modules: {}
}
