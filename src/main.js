// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import { InputNumber } from 'iview';
Vue.component('InputNumber', InputNumber);
import plugins from './plugins';
import '../static/reset.css';
import './assets/element-variables.scss';
import "animate.css";
import store from './store';


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(plugins);
Vue.use(InputNumber);

new Vue({
  el: '#app',
  router, store,
  components: {App},
  template: '<App/>'
})
