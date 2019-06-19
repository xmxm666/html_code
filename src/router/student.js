

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
          {
            path: 'submission',
            meta:{title:'投稿'},
            name: 'Submission',
            component:  () => import('@/pages/student/submission/container'),
            children: [
              {
                path: 'add',
                meta:{title:'添加投稿'},
                name: 'SubmissionAdd',
                component: () => import('@/pages/student/submission/add'),
              },
               {
                path: 'list',
                meta:{title:'投稿列表'},
                name: 'SubmissionList',
                component:  () => import('@/pages/student/submission/list'),
              }
            ]
          },
          {
            path: 'goodsubmission',
            meta:{title:'投稿'},
            name: 'goodSubmission',
            component:  () => import('@/pages/container'),
            children: [
              {
                path: 'add',
                meta:{title:'添加学员展示'},
                name: 'goodSubmissionAdd',
                component: () => import('@/pages/student/goodstudent/add'),
              },
               {
                path: 'list',
                meta:{title:'学员展示列表'},
                name: 'goodSubmissionList',
                component:  () => import('@/pages/student/goodstudent/list'),
              } 
            ]
          }
        ]
      }
    ]
  };
  
  