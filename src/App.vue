<template>
  <div class="app">
    <Header :seller="seller"></Header>
    <div class="tab border-1px">
      <!-- 使用 router-link 组件来导航. -->
      <!-- 通过传入 `to` 属性指定链接. -->
      <!-- <router-link> 默认会被渲染成一个`<a>`标签 -->
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
// 引入头部组件
import Header from "./components/header/header";
import axios from "axios";

const ERR_OK = 0
export default {
  data() {
    return {
      seller: {}
    }
  },
  created() {
    // 请求本地数据
    axios.get('static/data.json').then((res) => {
      this.seller = res.data.seller
    })
  },
  // 注册组件
  components: {
    Header
  }
};
</script>


// 下载stylus依赖   {vue-loader依赖postcss插件,自动兼容浏览器css问题}
<style lang="stylus">
@import './common/stylus/mixin.styl';

.tab {
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
  // 实现移动端1px
  // border-bottom:1px solid rgba(7,17,27,0.1)
  border-1px(rgba(7, 17, 27, 0.1));

  .tab-item {
    flex: 1;
    text-align: center;

    & > a {
      display: block;
      font-size: 16px;
      color: rgb(77, 85, 93);
    }

    .router-link-active {
      color: rgb(240, 20, 20);
    }
  }
}
</style>
