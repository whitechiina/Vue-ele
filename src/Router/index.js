// 引入vue和路由
import Vue from 'vue'
import Router from 'vue-router'

// 引入组件路径
import goods from  '@/components/goods/goods';
import ratings from '@/components/ratings/ratings';
import seller from '@/components/seller/seller';

// ？？？
Vue.use(Router);

// 配置路由
export default new Router({
  routes: [
    {
      path:'/goods',
      component:goods
    },
    {
      path:'/ratings',
      component:ratings
    },
    {
      path:'/seller',
      component:seller
    },
    {
      //当前面所有路由规则都没有命中时, 则redirect重定向到/one路径上
      path: '*', // 路径都没有命中, 则执行这里, *代表一切字符串,代表匹配所有
      redirect: '/goods' // 重定向到"/home"的路由下(修改#/路径为 /home)
    }
  ]
})

