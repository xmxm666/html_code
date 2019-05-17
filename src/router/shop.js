

export const shopRouter = {
    meta: {title: "售卖管理"},
    path: 'shop',
    component: () => import('@/pages/container'),
    children: [
      {
        path: 'teaching',
        name: 'Teaching',
        component: () => import('@/pages/shop/container'),
        children: [
          {
            path: 'add',
            meta:{title:'添加教材'},
            name: 'TeachingAdd',
            component: () => import('@/pages/shop/teaching-material/add'),
          },
           {
            path: 'list',
            meta:{title:'教材列表'},
            name: 'teachingList',
            component:  () => import('@/pages/shop/teaching-material/list'),
          },
        ]
      }
    ]
  };
  
  