import {requestByGet, requestByPost} from "../utils/request";

export default {
  namespaced: true,
  state: {
    schoolList: {},
    teacherList:[],
    adminList:[]
  },
  mutations: {
    SET_SCHOOL_LIST(state, data) {
      state.schoolList = data;
    },
    SET_TEACHER_LIST(state, data) {
      state.teacherList = data;
    },
    SET_ADMIN_LIST(state, data) {
      state.adminList = data;
    },
  },
  actions: {
    /***
     * 学校列表
     */
    async getSchoolList({commit}, params) {
      const {data} = await requestByPost("server/school/schoolList", {
        ...params,
      });
      commit("SET_SCHOOL_LIST", data);
      return data
    },
    /***
     * 教师列表
     */
    async getTeacherList({commit}, params) {
      const {data} = await requestByPost("server/admin/adminList", {
        ...params,
      });
      console.log({data})
      commit("SET_TEACHER_LIST", data);
      return data
    },
    //管理员列表
    async getAdminList({commit}, params) {
      const {data} = await requestByPost("server/admin/adminList", {
        ...params,
      });
      commit("SET_ADMIN_LIST", data);
    },
    addOrUpdateCarouselMap({commit}, params) {
      return requestByPost("advertisement/createOrUpdateAd", {
        ...params,
        isDefault: 0,
        type: 1
      });
    },
    addOrUpdateAdvertisement({commit}, params) {
      return requestByPost("advertisement/createOrUpdateAd", {
        ...params,
        isDefault: 0,
        type: 0
      });
    },
    /***
     * 启动图
     */
    async getAllLaunchImg({commit}, params) {
      const {data} = await requestByGet("advertisement/getAdByPage", {
        ...params,
        isDefault: 0,
        type: 2
      });
      commit("SET_CAROUSEL_MAP_LIST", data);
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        localStorage.removeItem('token');
        resolve()
      })
    }
  },
}
