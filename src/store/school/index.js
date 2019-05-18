import {requestByGet, requestByPost} from "../../utils/request";

export default {
  namespaced: true,
  state: {
    teacherList: {},
    tableDataList:[]
  },
  mutations: {
    SET_TABLE_DATA(state, data) {
      state.tableDataList = data;
    }
  },
  actions: {
     // 删除学校
    async deleteSchool({commit}, params) {
     return await requestByGet("server/school/deleteSchool", params);
    },
     // 添加学校
     async addSchool({commit}, params) {
        return await requestByPost("server/school/create", params);
       },
       // 修改学校
     async upDataSchool({commit}, params) {
      return await requestByPost("server/school/updateSchool", params);
     },
     //获取学校信息
     async getSchoolDetails({commit}, params) {
      return await requestByGet("server/school/findSchool", params);
     },
    //获取通知公告
    async getSchoolNoticeList({commit}, params) {
      return await requestByPost("server/article/findNoticeAll", params);
    },
  // 删除文章
    async deleteArticle({commit}, params) {
      return await requestByGet("server/article/deleteNotice", params);
    },
    //添加文章

  async addArticle({commit}, params) {
    return await requestByPost("server/article/addNotice", params);
  },
    //获取文章详情
  async getArticlDetails({commit}, params) {
    return await requestByGet("server/article/findNotice", params);
  },
  //获取活动列表
   async getActivityList({commit}, params) {
    const {data} = await requestByPost("server/activities/activitiesList", params);
    commit('SET_TABLE_DATA',data);
  },
  //添加修改活动
  async addActivity({commit}, params) {
    return await requestByPost("server/activities/createActivities", params);
  },
  //获取活动详情
  async getActivityDetails({commit}, params) {
    return await requestByGet("server/activities/findActivities", params);
  },
  //删除活动列表
  async delActivity({commit}, params) {
    return await requestByGet("server/activities/deleteActivities", params);
  },
  },
  modules: {}
}
