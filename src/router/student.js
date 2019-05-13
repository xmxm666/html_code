

export const studentRouter = {
    meta: {title: "学员管理"},
    path: '/',
    component: () => import('@/pages/container'),
    children: [
      {
        path: 'student',
        name: 'student',
        component: () => import('@/pages/student/container'),
        children: [
          {
            path: 'add',
            meta:{title:'添加学生'},
            name: 'StudentAdd',
            component: () => import('@/pages/student/add'),
          },
           {
            path: 'list',
            meta:{title:'学生列表'},
            name: 'StudentList',
            component:  () => import('@/pages/student/list'),
          },
          {
            path: 'leaveList',
            meta:{title:'请假列表'},
            name: 'LeaveList',
            component:  () => import('@/pages/student/leave-list'),
          },
          {
            path: 'logoutList',
            meta:{title:'审核列表'},
            name: 'LogoutList',
            component:  () => import('@/pages/student/logout-list'),
          },
        ]
      }
    ]
  };
  
  