
export const schoolRouter = {
  meta: {title: "概览"},
  path: 'school',
  component: () => import('@/pages/school/container'),
  children: [
    {
      path: 'view',
      name: 'schoolView',
      component:  () => import('@/pages/school/view'),
    }, {
      path: 'list',
      name: 'schoolManageList',
      component: () => import('@/pages/school/list'),
    }, {
      path: 'add',
      name: 'schoolAdd',
      component: () => import('@/pages/school/add'),
    },
    {
      path: 'notice',
      name: 'schoolNotice',
      component: () => import('@/pages/school/notice/container'),
      children:[
        {
          path: 'list',
          name: 'schoolNoticeList',
          component:  () => import('@/pages/school/notice/list'),
        },
        {
          path: 'add',
          name: 'schoolNoticeAdd',
          component:  () => import('@/pages/school/notice/add'),
        }
      ]
    },
    {
      path: 'legal',
      name: 'schoolLegal',
      component: () => import('@/pages/school/legal/container'),
      children:[
        {
          path: 'add',
          name: 'schoolLegalAdd',
          component:  () => import('@/pages/school/legal/add'),
        },
        {
          path: 'list',
          name: 'schoolLegalList',
          component:  () => import('@/pages/school/legal/list'),
        }
      ]
    },
    {
      path: 'alliance',
      name: 'schoolAlliance',
      component: () => import('@/pages/school/alliance/container'),
      children:[
        {
          path: 'add',
          name: 'schoolAllianceAdd',
          component:  () => import('@/pages/school/alliance/add'),
        },
        {
          path: 'list',
          name: 'schoolAllianceList',
          component:  () => import('@/pages/school/alliance/list'),
        }
      ]
    },
    {
      path: 'introduction',
      name: 'schoolIntroduction',
      component: () => import('@/pages/school/introduction/container'),
      children:[
        {
          path: 'add',
          name: 'schoolIntroductionAdd',
          component:  () => import('@/pages/school/introduction/add'),
        },
        {
          path: 'list',
          name: 'schoolIntroductionList',
          component:  () => import('@/pages/school/introduction/list'),
        }
      ]
    },
    {
      path: 'activity',
      name: 'schoolActivity',
      component: () => import('@/pages/school/activity/container'),
      children:[
        {
          path: 'add',
          name: 'schoolActivityAdd',
          component:  () => import('@/pages/school/activity/add'),
        },
        {
          path: 'list',
          name: 'schoolActivityList',
          component:  () => import('@/pages/school/activity/list'),
        }
      ]
    },
  ]
};

