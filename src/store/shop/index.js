import {requestByGet, requestByPost} from "../../utils/request";

export default {
  namespaced: true,
  state: {
    textbookList:{}
  },
  mutations: {
    SET_LESSON_LIST(state, data) {
        state.textbookList = data
    }
  },
  actions: {
    //获取教材列表
    async textbooklist({commit},params){
      const {code,data,msg} = await requestByGet("booksell/shows",params)
      commit("SET_LESSON_LIST",data)
      return {code,data,msg}
    },
    //获取id教材
    async textbookID({commit},params){
      return await requestByGet("booksell/showone",params)
    },
    //添加教材信息
    async addTextbook({commit}, params) {
        return await requestByPost("booksell/addbooks", params);
    },
    //修改教材信息
    async selectTextbook({commit}, params) {
      return await requestByPost("booksell/updateco", params);
    },
    //删除教材信息
    async DeleteTextbook({commit},params){
      const {code,data,msg} = await requestByPost("booksell/deleteco",params)
      return {code,data,msg}
    },
    //开启关闭教材
    async selectType({commit},params){
      const {code,data,msg} = await requestByPost("booksell/UpdataIsOnSale",params)
      return {code,data,msg}
    },
    //一键开启关闭教材
    async AllselectType({commit},params){
      const {code,data,msg} = await requestByPost("booksell/bathUpdataIsOnSale",params)
      return {code,data,msg}
    },
  },
  modules: {}
}
