// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 入口文件
import Vue from 'vue';
import App from './App';
import Axios from 'axios';

// 引入全局sytl样式
import 'common/stylus/index.styl';
import 'common/stylus/reset.styl';

// 引入路由文件
import router from './Router';

Vue.prototype.$http=Axios
Vue.config.productionTip = false

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
