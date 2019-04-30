

export const lessonRouter = {
  meta: {title: "页面管理"},
  path: 'page',
  component: () => import('@/pages/container'),
  children: [
    {
      path: 'lesson',
      name: 'lesson',
      component: () => import('@/pages/lesson/container'),
      children: [
        {
          path: 'add',
          name: 'LessonAdd',
          component: () => import('@/pages/lesson/add'),
        }, {
          path: 'list',
          name: 'LessonList',
          component:  () => import('@/pages/lesson/list'),
        },
        {
          path: 'setting',
          name: 'Setting',
          component:  () => import('@/pages/lesson/setting/container'),
          children:[

            {
              path: 'list',
              name: 'SettingList',
              component:  () => import('@/pages/lesson/setting/list'),
            },
            {
              path: 'add',
              name: 'SettingAdd',
              component:  () => import('@/pages/lesson/setting/add'),
            },
          ]
        },
      ]
    }
  ]
};

