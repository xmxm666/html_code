
export const permissionRouter = {
  meta: {title: "权限管理"},
  path: 'permission',
  component: () => import('@/pages/container'),
  children: [
    {
      path: 'role',
      name: 'role',
      component: () => import('@/pages/permission/role/container'),
      children: [
        {
          path: 'add',
          meta:{title:'添加角色'},
          name: 'RoleAdd',
          component: () => import('@/pages/permission/role/add'),
        },
        {
          path: 'list',
          meta:{title:'角色列表'},
          name: 'RoleList',
          component:  () => import('@/pages/permission/role/list'),
        }
      ]
    },
    {
      path: 'admin',
      name: 'admin',
      component: () => import('@/pages/permission/role/container'),
      children: [
        {
          path: 'add',
          meta:{title:'添加人员'},
          name: 'AdminAdd',
          component: () => import('@/pages/permission/admin/add'),
        },
        {
          path: 'list',
          meta:{title:'人员列表'},
          name: 'AdminList',
          component:  () => import('@/pages/permission/admin/list'),
        }
      ]
    },

  ]
};

