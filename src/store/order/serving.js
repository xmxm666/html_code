import {requestByGet, requestByPost} from "../../utils/request";

export default {
  namespaced: true,
  state: {
    tableDataList: {},
    orderDataList:{},
    detailData:{}
  },
  mutations: {
    SET_TABLE_DATA(state, data) {
      state.tableDataList = data;
    },
    SET_ORDERTABLE_DATA(state,data){
      state.orderDataList=data;
    },
    SET_DETAIL_DATA(state,data){
      state.detailData=data
    }

  },
  actions: {
      //获取商家列表
      async getCompanyListByPage({commit},params){
        const {data}=await requestByGet("company/getCompanyListByPage",params);
        commit("SET_TABLE_DATA", data)
      },
      //修改添加商家
      updateOrCreateteacherSetting({commit}, params) {
        return requestByPost("system/updateOrCreateteacherSetting", params);
      }, 
      //获取服务列表
      async getServiceOrderByPage({commit},params){
        const {data}=await requestByGet("order/getServiceOrderByPage",params);
        commit("SET_TABLE_DATA", data)
      },
     
  },
}
