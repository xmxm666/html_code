
export const teacherRouter = {
  meta: {title: "概览"},
  path: 'teacher',
  component: () => import('@/pages/teacher/container'),
  children: [
    {
      path: 'manage',
      name: 'teacherManage',
      component:  () => import('@/pages/teacher/manage/container'),
      children: [
        {
          path: 'add',
          name: 'teacherManageAdd',
          component:  () => import('@/pages/teacher/manage/add'),
        }, {
          path: 'list',
          name: 'teacherManageList',
          component: () => import('@/pages/teacher/manage/list'),
        },
      ],
    },
  ],
};


export const adminRouter = {
  meta: {title: "概览"},
  path: 'admin',
  component: () => import('@/pages/teacher/container'),
  children: [
        {
          path: 'add',
          name: 'adminManageAdd',
          component:  () => import('@/pages/teacher/admin/add'),
        }, {
          path: 'list',
          name: 'adminManageList',
          component: () => import('@/pages/teacher/admin/list'),
        },
      ],

};
export const goodRouter = {
  meta: {title: "教师风采"},
  path: 'goodteacher',
  component: () => import('@/pages/teacher/container'),
  children: [
        {
          path: 'add',
          name: 'adminManageAdd2',
          component:  () => import('@/pages/teacher/goodteacher/add'),
        }, {
          path: 'list',
          name: 'adminManageList2',
          component: () => import('@/pages/teacher/goodteacher/list'),
        },
      ],

};



