

export const homeRouter = {
  meta: {title: "概览"},
  path: 'home',
  component: () => import('@/pages/home'),
  children: [
    {
      path: 'view',
      name: 'HomeView',
      component: () => import('@/pages/home/view'),
    }
  ]
};

