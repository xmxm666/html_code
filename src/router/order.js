
const Order = () => import('@/pages/order/container');
const orderServing = () => import('@/pages/order/serving/container');

const List = () => import('@/pages/order/serving/list');
const Withdraw = () => import('@/pages/finance/propose/withdraw');
const Setting = () => import('@/pages/finance/propose/setting');




export const orderRouter = {
  meta: {title: "订单"},
  path: 'order',
  component: Order,
  children: [
    {
      path: 'serving',
      name: 'orderServing',
      component: orderServing,
      children: [{
        path: 'list',
        name: 'List',
        component: List,
      }]
    },
   
    
  ]
};

