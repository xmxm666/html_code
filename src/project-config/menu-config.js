export const menu = [{
  legend: "首页",
  path: "/home/view",
  icon: "el-icon-menu",
  children: []
}, {
  legend: "课程管理",
  icon: "el-icon-menu",
  path: "/page/lesson/list",
  children: [
    {
    legend: "课程列表",
    path: "/page/lesson/list",
    },
    {
      legend: "报名条件设置",
      path: "/page/lesson/setting/list",
    },
    {
      legend: "精品课程",
      path: "/page/lesson/goodlesson/list",
    }
  ]
},
{
  legend: "学员管理",
  icon: "el-icon-menu",
  path: "/student/list",
  children: [
    {
      legend: "学员列表",
      path: "/student/list",
    },
    {
      legend: "请假列表",
      path: "/student/leaveList",
    },
    {
      legend: "注销列表",
      path: "/student/logoutList",
    },
    {
      legend: "投稿列表",
      path: "/student/submission/list",
    },
    {
      legend: "学员展示",
      path: "/student/goodsubmission/list",
    }

  ]
},
{
  legend: "报名管理",
  icon: "el-icon-menu",
  path: "/trade/school/list",
  children: [
    {
      legend: "学校缴费信息",
      path: "/trade/school/list",
    },
    {
      legend: "学员缴费列表",
      path: "/trade/student/list",
    }
  ]
},
{
  legend: "教师管理",
  icon: "el-icon-menu",
  path: "/teacher/manage/list",
  children: [
    {
      legend: "教师列表",
      path: "/teacher/manage/list",
    },
    {
      legend: "教师风采",
      path: "/goodteacher/list",
    }
  ]
},
 {
  legend: "学校管理",
  icon: "el-icon-menu",
  path: "/school/view",
  children: [
    {
      legend: "学校概览",
      path: "/school/view",
    }, {
      legend: "学校列表",
      path: "/school/list",
    },
    {
      legend: "学校通知",
      path: "/school/notice/list",
    },
    {
      legend: "联盟资讯",
      path: "/school/alliance/list",
    },
    {
      legend: "校园介绍",
      path: "/school/Introduction/list",
    },
    {
      legend: "政策法规",
      path: "/school/legal/list",
    },
    {
      legend: "活动列表",
      path: "/school/activity/list",
    }
  ]
},
{
  legend: "售卖管理",
  icon: "el-icon-menu",
  path: "/shop/teaching/list",
  children: [
    {
      legend: "教材列表",
      path: "/shop/teaching/list",
    }
  ]
},
{
  legend: "权限管理",
  icon: "el-icon-menu",
  path: "/permission/role/list",
  children: [
    {
      legend: "角色列表",
      path: "/permission/role/list",
    },
    {
      legend: "人员列表",
      path: "/permission/admin/list",
    }
  ]
},

{
  legend: "设置",
  icon: "el-icon-setting",
  children: []
},
  {
  legend: "帮助",
  icon: "el-icon-service",
  children: []
}];
