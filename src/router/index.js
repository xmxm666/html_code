import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import {homeRouter} from "./home";
import {lessonRouter} from "./lesson";
import {teacherRouter} from "./teacher";
import {schoolRouter} from "./school";
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import {commonRouter} from "./common";
import {orderRouter} from './order';
import {studentRouter} from './student';


Vue.use(Router);

const router = new Router({
  mode: "history",
  base: "/manage/",
  routes: [
    ...commonRouter,
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [
        homeRouter,
        lessonRouter,
        teacherRouter,
        schoolRouter,
        orderRouter,
        studentRouter,
        
      ]
    }
  ]
});
const allowPath = ["/msgPage", "/login",];

router.beforeEach((to, form, next) => {
  NProgress.start();
  if (to.meta.title) {
    document.title = to.meta.title
  }
  const token = localStorage.getItem("token");
  const isNotAllowPath = allowPath.every(path => path !== to.path);
  //未登录的情况
  if (!token && isNotAllowPath) {
    next("/login");
    NProgress.done();
    console.log("未登录");
  } else {
    console.log("正常");
    next();
  }
  next();
});
router.afterEach((to, from) => {
  NProgress.done();
})
export default router;
