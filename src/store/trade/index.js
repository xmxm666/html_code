import {requestByGet, requestByPost} from "../../utils/request";

export default {
  namespaced: true,
  state: {
    teacherList: {},
    tableDataList:[],
    lessonList: [],
  },
  mutations: {
    SET_LESSON_LIST(state, data) {
        state.lessonList = data;
    },
    SET_TABLE_DATA(state, data) {
      state.tableDataList = data;
    }
  },
  actions: {
    //添加修改学校信息
    async addActivity({commit}, params) {
        return await requestByPost("address/addinfo", params);
    },
    //添加修改学校信息
    async addActivity2({commit}, params) {
        return await requestByPost("address/updateinfo", params);
    },
    //获取学校信息详情
    async getActivityDetails({commit}, params) {
        return await requestByGet("address/showone", params);
    },
    //删除学校信息列表
    async delActivity({commit}, params) {
        return await requestByPost("address/deleteone", params);
    },
    /***
     * 学生信息列表
     */
    async getLessonList({commit}, params) {
        const {data,code} = await requestByGet("payoff/shows", {
          ...params, 
        });
        commit("SET_LESSON_LIST", data);
        return {data,code}
      },
    //获取学校信息列表
    async getActivityList({commit}, params) {
        const {data} = await requestByGet("address/show", params);
        commit('SET_TABLE_DATA',data);
        return data
    },
    //缴费
    async deleteorder({commit}, params) {
      const {data,code,msg} = await requestByPost("payoff/updatepaystatus", params);
      return {data,code,msg}
    },
    //缴费
    async thatdeleteorder({commit}, params) {
      const {data,code,msg} = await requestByPost("offorder/delete", params);
      return {data,code,msg}
    },
    //一键缴费
    async Alldeleteorder({commit}, params) {
      const {data,code,msg} = await requestByPost("payoff/bathupdatepaystatus", params);
      return {data,code,msg}
    },
    //导出
    async updata({commit}, params) {
      const {data,code,msg} = await requestByGet("payoff/donwshows", params);
      console.log({data,code,msg})
      return {data,code,msg}
    },
    
  },
  
  modules: {}
}
