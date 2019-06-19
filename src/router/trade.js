export const tradeRouter = {
    meta: {title: "报名管理"},
    path: 'trade',
    component: () => import('@/pages/container'),
    children: [
      {
        path: 'school',
        name: 'tradeschool',
        component: () => import('@/pages/container'),
        children: [
          {
            path: 'list',
            meta:{title:'学校缴费'},
            name: 'tradeschoolList',
            component: () => import('@/pages/trade/school/list')
          },
          {
            path: 'add',
            meta:{title:'学校缴费'},
            name: 'tradeschoolAdd',
            component: () => import('@/pages/trade/school/add')
          }
        ]
      },
      {
        path: 'student',
        name: 'tradestudent',
        component: () => import('@/pages/container'),
        children: [
          {
            path: 'list',
            meta:{title:'学校学员缴费'},
            name: 'tradestudentlist',
            component: () => import('@/pages/trade/student/list')
          },
          {
            path: 'add',
            meta:{title:'添加学校学员缴费'},
            name: 'tradestudentadd',
            component: () => import('@/pages/trade/student/add')
          }
        ]
      },
      {
        path: 'setting',
        name: 'tradesetting',
        component: () => import('@/pages/container'),
        children: [
          {
            path: 'list',
            meta:{title:'学校学员缴费'},
            name: 'tradesettingList',
            component: () => import('@/pages/trade/setting/list')
          },
          {
            path: 'add',
            meta:{title:'添加学校学员缴费'},
            name: 'tradesettingAdd',
            component: () => import('@/pages/trade/setting/add')
          }
        ]
      }
    ]
  };
  
  