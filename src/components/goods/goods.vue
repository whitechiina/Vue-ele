// 商品模块内容
<template>
  <div class="goods">
    <!-- 菜单 -->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item, index) in goods" :key="item.key" class="menu-item" :class="{'current': currentIndex === index}"  @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="ClassMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!-- 商品列表 -->
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol v-on:cart-add="cartAdd" :food="food"></cartcontrol> <!-- 传入food!!!-->
               </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 购物车组件 -->
    <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>


<script>
import axios from "axios";
import BScroll from "better-scroll"
// 引入组件需要注册

// 购物车组件
import shopcart from "components/shopcart/shopcart";
// 增加和减少商品小球动画组件
import cartcontrol from "components/cartcontrol/cartcontrol";
// 商品详情组件
import food from "components/food/food";

export default {
  props: {
    seller: {
      type:Object
    }
  },
  data(){
    return{
      goods:[],
      listHeight:[],
      scrollY: 0,
      selectedFood:{}
    }
  },
  computed:{
    currentIndex () {
			for (let i = 0; i < this.listHeight.length; i++) {
				let height1 = this.listHeight[i]
				let height2 = this.listHeight[i + 1]
				if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
					return i
				}
      }
      return 0;
    },
    selectFoods(){
      let foods = [];
      this.goods.forEach((good)=>{
        good.foods.forEach((food)=>{
          if (food.count) {
            foods.push(food)
          }
        })
      });
      return foods;
    }
  },
  created() {
    this.ClassMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

    // 请求本地数据
    axios.get("static/data.json").then((res) => {
      this.goods = res.data.goods;
      // console.log(this.goods)
      this.$nextTick(() => {
        this._initScroll(); // 初始化scroll
        this._calculateHeight();
      })
    });
  },
  methods: {
    cartAdd(target){
      //拿到traget(DOM对象)之后，将其传入shopcart组件中drop(target){}方法，
      //此处用this.$refs调用子组件,访问DOM时用的是ref="menuWrapper"
      this.$nextTick(() => { //回调函数异步执行，两个动画效果就不会卡顿了
        this.$refs.shopcart.drop(target);
      });
    },
    selectMenu (index, event) {
				if (!event._constructed) {
					return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
				let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300)
        console.log(index)
    },
    selectFood(food,event){
      if(!event._constructed){
        return;
      }
      this.selectedFood = food;
      this.$refs.food.show();
    },
    _initScroll() {
      this.menuWrapper = new BScroll(this.$refs.menuWrapper,{
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
        click: true,
        probeType: 3
      });
      this.foodsScroll.on('scroll', (pos) => {
				this.scrollY = Math.abs(Math.round(pos.y))
			})
    },
    _calculateHeight(){
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
					let item = foodList[i]
					height += item.clientHeight
					this.listHeight.push(height)
      }
    }
  },
  // 注册组件
  components:{
    shopcart,
    cartcontrol,
    food
  },
};
</script>


<style lang="stylus">
  @import "../../common/stylus/mixin"

.goods
  display: flex
  position: absolute
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .menu-wrapper 
    flex: 0 0 80px
    width: 80px
    background: #f3f5f7
    .menu-item
      display table
      height 54px
      width 56px
      line-height 14px
      padding 0 12px
      &.current
        position relative
        z-index 10
        margin-top -1px
        background:#fff
        font-weight:700
        .text
          border-none()
      .icon
        display: inline-block
        width: 12px
        height: 12px
        margin-right:2px
        background-size:12px 12px
        background-repeat:no-repeat
        &.decrease
          bg-image('decrease_3')
        &.discount
          bg-image('discount_3')
        &.guarantee
          bg-image('guarantee_3')
        &.invoice
          bg-image('invoice_3')
        &.special
          bg-image('special_3')
      .text
          display table-cell
          vertical-align middle
          font-size 12px
          font-weight 200
          white-space normal
          line-height 14px
          .iconMap
            vertical-align middle

// 商品列表样式
  .foods-wrapper 
    flex: 1
    .title
      padding-left 14px
      height 26px
      line-height 26px
      border-left 2px solid #d9dde1
      font-size 12px
      color rgb(147,153,159)
      background:#f3f5f7
    .food-item
      display flex
      margin 18px
      padding-bottom 18px
      border-1px(rbg(7,17,27,0.1))
      &:last-child
        border-none()
        margin-bottom:0
      .icon
        flex: 0 0 57px
        margin-right 10px
      .content
        flex: 1
        .name
          margin 2px 0 8px 0
          height: 14px
          line-height 14px
          font-size 14px
          color:rgb(7,17,27)
        .desc,.extra
          line-height 10px
          font-size 10px
          color:rgb(147,153,159)
        .desc
          margin-bottom 8px
          line-height 12pxVB
        .extra
          line-height 10px
          &.count
            margin-right 12px
        .price
          font-weight 700
          line-height 24px
          .now
            margin-right 8px
            font-size 14px
            color:rgb(240,20,20)
          .old
            text-decoration line-through
            font-size 10px
            color:rgb(147,153,159)
        .cartcontrol-wrapper
          position absolute
          right 0 
          bottom 12px
</style>