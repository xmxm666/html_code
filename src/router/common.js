

export const commonRouter = [{
  meta: {title: "用户登录"},
  path: '/login',
  name: "Login",
  component: () => import('@/pages/login'),
},{
  path: '/msgPage',
  name: "MsgPage",
  component: () => import('@/pages/msg-page'),
},];

