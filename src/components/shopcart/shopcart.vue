// goods下的购物车组件
<template>
    <div class="shopcart">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight':totalCount>0}">
                        <i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
                    </div>
                   <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <!-- 单价 -->
                <!-- 通过计算属性获取 -->
                <div class="price" :class="{'highlight': totalPrice > 0}">￥{{totalPrice}}</div>
                <!-- 描述 -->
                <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <template>
            <div class="content-right" @click.stop.prevent="pay">
                <div class="pay" :class="payClass">
                    {{payDesc}}
                </div>
            </div>
            </template>
        </div>
        <!-- 小球飞入组件 -->
        <div class="ball-container">
            <div v-for="ball in balls" :key="ball.id">
                <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                    <div v-show="ball.show" class="ball">
                        <div class="inner inner-hook">
                        </div>
                    </div>
                </transition>
            </div> 
        </div>
        <!-- 购物车详情 -->
        <transition name="transHeight">
        <div class="shopcart-list" v-show="listShow">
            <div class="list-header">
                <h1 class="title">购物车</h1>
                <span class="empty" @click="empty">清空</span>
            </div>
            <div class="list-content" ref="foodlist">
                <ul>
                    <li class="food" v-for="food in selectFoods">
                        <span class="name">{{food.name}}</span>
                        <div class="price">
                            <!-- <span>￥{{food.price * food.count}}</span> -->
                        </div>
                        <div class="cartcontrol-wrapper">
                            <!-- 记得将cartcontrol组件import到shopcart中，并注册components-->
                            <cartcontrol :food = "food"></cartcontrol>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        </transition>
        <div>
            <transition>
                <div class="list-mask" v-show="listShow" @click="hideList"></div>
            </transition>
        </div>
    </div>
</template>


<script>
import BScroll from "better-scroll"
// 增加和减少商品小球动画组件
import cartcontrol from "components/cartcontrol/cartcontrol";

export default {
    props:{
        //全局状态变化
        selectFoods:{
            type:Array,
            default(){
                return [
                ];
            }
        },
        deliveryPrice:{
            type:Number,
            default:0
        },
        minPrice:{
            type:Number,
            default:0
        }
    },
    data(){
        return{
            balls:[//每一个成员都用来维护当前小球的状态,初始状态都是隐藏的
                {
                    show:false
                },
                {
                    show:false
                },
                {
                    show:false
                },
                {
                    show:false
                },
                {
                    show:false
                }
            ],
            //添加一个变量，用来存贮已经下落的小球
            dropBalls: [],
            fold: true //购物车详情列表默认折叠
        }
    },
    computed:{
        totalPrice(){
            let total = 0;
            this.selectFoods.forEach((food)=>{
                total+= food.price*food.count;
            });
            return total;
        },
        totalCount () {
			let count = 0
			this.selectFoods.forEach((food) => {
				count += food.count
			})
			return count
        },
        payDesc(){
            if(this.totalPrice === 0 ){
                return `￥${this.minPrice}元起送`;
            }else if(this.totalPrice < this.minPrice){
                let diff = this.minPrice - this.totalPrice;
                return `还差￥${diff}元起送`;
            }else{
                return `去结算`;
            }
        },
        // 计算属性CSS结算样式
        payClass(){
            if(this.totalPrice < this.minPrice){
                return 'not-enough'
            } else {
                return 'enough'
            }
        },
        listShow(){
            if(!this.totalCount){
                this.fold = true;
                return false;
            }
            let show = !this.fold;
            if(show){
                this.$nextTick(()=>{
                    if(!this.scroll){
                        this.scroll = new BScroll(this.$refs.foodlist,{
                        click:true
                        });    
                    } else {
                        this.scroll.refresh();
                    }
                });
            }
            return show;
        }
    },
    methods:{
        _drop (target) {
			// 体验优化，异步执行下落动画
			this.$nextTick(() => {
				this.drop(target)
			})
		},
        drop(el) {
                //console.log(el); //验证是否能正确输出
                //遍历balls，拿到第一个show为false的球，做一个动画
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.show) { //show为false的球
                        ball.show = true; //小球下落
                        ball.el = el;//保留当前的DOM对象，用来计算位置
                        this.dropBalls.push(ball); //dropBalls存的是已经下落的小球,后续要对已经下落的小球进行处理
                        return;
                    }
                }
        },
        toggleList(){
            if(!this.totalCount){
                return;
            }
            this.fold = !this.fold;
        },
       //定义三个钩子函数实现动画
        beforeEnter(el) { //el为当前执行transition动画的DOM对象
        //先找到所有为true的小球（连续点击的情况）
            let count = this.balls.length;
            while (count--) {
                let ball = this.balls[count];
                if (ball.show) { //这个是要运动的小球true
                    let rect = ball.el.getBoundingClientRect();//获得元素相当于视口的位置
                    let x = rect.left - 32;
                    let y = -(window.innerHeight - rect.top - 22);
                    el.style.display = ''; //v-show默认display：none，设置为空，让它显示
                    //外层元素是纵向的动画，内层元素是横向的动画
                    el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                    el.style.transform = `translate3d(0,${y}px,0)`;
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
                    inner.style.transform = `translate3d(${x}px, 0, 0)`;
                }
            }
        },           
        enter(el) {
            /* 触发浏览器重绘，重绘之后才可以设置transform*/
            /* eslint-disable no-unused-vars */
            let rf = el.offsetHeight;
            this.$nextTick(() => { //样式重置
                el.style.webKitTransform = 'translate3d(0,0,0)';//没有变量时只能用单引，不能用反引
                el.style.transform = 'translate3d(0,0,0)';
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = 'translate3d(0,0,0)';
                inner.style.transform = 'translate3d(0,0,0)';
            });
        },
        afterEnter(el) { //动画完成
            let ball = this.dropBalls.shift();//删除并返回第一个ball
            if (ball) {
                ball.show = false; //重置ball.show的状态
                el.style.display = 'none';
            }
        },
        //清空购物车
        empty(){
            this.selectFoods.forEach((food)=>{
                food.count = 0;
            })
        },
        hideList(){
            this.fold = true;
        },
        pay(){
            if(this.totalPrice<this.minPrice){
                return;
            }
            window.alert(`支付${this.totalPrice}元`);
        }
    },
    components:{
        cartcontrol
    }
}
</script>

<style lang="stylus">
@import "../../common/stylus/mixin"
.shopcart
    position:fixed
    bottom:0
    left:0
    z-index:50
    width:100%
    height:48px
    .content
        display:flex
        background #141d27
        font-size 0
        .content-left
            flex:1
            .logo-wrapper
                display inline-block
                position relative
                top -10px
                margin: 0 12px
                padding: 6px
                width 56px
                height 56px
                box-sizing border-box
                vertical-align:top
                border-radius 50%
                background:#141d27
                .num
                    position absolute
                    top 0 
                    right 0 
                    width 24px
                    height 16px
                    line-height 16px
                    text-align center
                    border-radius 16px
                    font-size 9px
                    font-weight 700
                    color #fff
                    background rgb(240,20,20)
                    box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
                .logo
                    width 100%
                    height 100%
                    border-radius: 50%
                    background: #2b343c
                    text-align center
                    &.highlight
                        background:rgb(0,160,220)
                    .icon-shopping_cart
                        line-height 44px
                        font-size 24px
                        color:#fff
            .price
                display inline-block
                vertical-align top
                margin-top:12px
                line-height 24px
                padding-right 12px
                box-sizing border-box
                border-right 1px solid rgba(255,255,255,0.1)
                font-size 16px
                font-weight 700
                color rgba(255,255,255,0.4)
                &.highlight
                    color #fff
            .desc
                display inline-block
                vertical-align top
                margin 12px 0 0 12px
                line-height 24px
                color rgba(255,255,255,0.4)
                font-size 10px
        .content-right
            flex:0 0 105px
            width:105px
            .pay
                height 48px
                line-height 48px
                text-align center
                font-size 12px
                font-weight 700
                color rgba(255,255,255,0.4)
                background:#2b333b
                &.not-enough
                    background #2b333b
                &.enough
                    background #00b43c
                    color  #fff
    // CSS：在运动的时候拉一个贝塞尔曲线
    .ball-container 
        .ball 
            position: fixed  //相对于视口做布局
            left: 32px
            bottom: 22px
            width: 16px
            heigth: 16px
            z-index: 200
            .inner 
                width: 16px
                height: 16px
                border-radius: 50%;
                background: rgb(0,160,220)
            
            &.drop-enter-active,&.drop-leave-active 
                transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);
                .inner 
                    transition: all 0.4s linear;   ////x轴做一个线性的过渡即可
            
    .shopcart-list
        position absolute
        top 0
        left 0
        width 100%
        background white
        transform translate3d(0,-100%,0)
        z-index -1
        &.transHeight-enter-active,&.transHeight-leave-active
          transition all 0.5s
        &.transHeight-enter,&.transHeight-leave-active
          transform translate3d(0,0,0)
        .list-header
            height 40px
            line-height 40px
            background #f3f5f7
            border-bottom 1px solid rgba(7,17,27,0.1)
            .title
              display inline-block
              font-size 14px
              font-weight 200
              color rgb(7,17,27)
              padding-left 18px
            .empty
              position absolute
              right 8px
              font-size 12px
              color rgb(0,160,220)
              padding 0 10px
        .list-content
          max-height 217px
          overflow hidden
          padding: 0 18px
          background:#fff
          .food
            position relative
            display flex
            height 48px
            padding: 12px 0
            border-1px(rgba(7,17,27,0.1))
            .name
              flex 1
              font-size 14px
              color rgb(7,17,27)
              line-height 48px
              font-weight 700
            .price
              font-size 14px
              font-weight 700
              color rgb(240,20,20)
              padding 0 12px 0 18px
              line-height 48px
            .cartcontrol-wrapper
              font-size 14px
              margin-top 6px
.list-mask
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    background rgba(7,17,27,0.6)
    /* backdrop-filter blur(10px) */
    z-index -2
    &.fade-backdrop-enter-active,&.fade-backdrop-leave-active
      transition opacity 0.5s
    &.fade-backdrop-enter,&.fade-backdrop-leave-active
      opacity 0
</style>

