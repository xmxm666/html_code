
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

