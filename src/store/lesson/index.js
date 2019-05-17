import {requestByGet, requestByPost} from "../../utils/request";

export default {
  namespaced: true,
  state: {
    lessonList: [],
    lessonSettingList:[],
    lessonSpecialList:[]
  },
  mutations: {
    SET_LESSON_LIST(state, data) {
      state.lessonList = data;
    },
    SET_LESSON_SETTING_LIST(state, data) {
      state.lessonSettingList = data;
    },
    SET_SPECIAL_LESSON_SETTING_LIST(state, data) {
      state.lessonSpecialList = data;
    },
  },
  actions: {
    /***
     * 课程列表
     */
    async getLessonList({commit}, params) {
      const {data} = await requestByPost("server/teacher/courseList", {
        ...params, 
      });
      commit("SET_LESSON_LIST", data);
      return data
    },
    //删除课程
   async deleteLesson({commit}, params) {
      return await requestByPost("server/teacher/deleteCourse", params);
    },
    //移除课程
    
    async removeLesson({commit}, params) {
      return await requestByPost("regist/deletesp", params);
    },
    //添加修改课程
    addLesson({commit}, params) {
      return requestByPost("server/teacher/createCourse", {
        ...params,
      });
    },
    //课程详情
    getLessonDetails({commit}, params) {
      return requestByGet("server/teacher/findCourse", {
        ...params,
      });
    },
    //获取课程设置
    async getLessonSettingList({commit}, params) {
      const {data} = await requestByGet("regist/show", params);
      commit("SET_LESSON_SETTING_LIST", data);
    },
     //获取特别设置
     async showSpecial({commit}, params) {
      const {data} = await requestByGet("regist/showspecial", params);
      commit("SET_SPECIAL_LESSON_SETTING_LIST", data);

    },
    //获取课程设置详情
    async getLessonSettingDetails({commit}, params) {
      return await requestByGet("regist/showone", params);
    },
    //添加课程设置
    async addLessonSetting({commit}, params) {
      return await requestByPost("regist/condition", params);
    },
     //修改课程设置
     async upDataLessonSetting({commit}, params) {
      return await requestByPost("regist/updateco", params);
    },
      //删除课程设置
      async deleteLessonSetting({commit}, params) {
        return await requestByPost("regist/deleteco", params);
      },
      //启用停用课程
      async changeLessonStatus({commit}, params) {
        return await requestByPost("server/teacher/updateIsenable", params);
      },
      //下载课程
      async downLessonData({commit}, params) {
        return await requestByPost("server/fileDown/courseListDowm", params);
      },
      //设置所有时间
      async settingTimer({commit}, params) {
        return await requestByPost("apply/updatetime", params);
      },
     
  },
}
