//按钮增减组件
<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-descrease" v-show="food.count > 0" @click.stop.prevent="descreaseCart">
				<span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
	</div>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue'
	export default {
		props: {
			food: {
				type: Object
			}
		},
		methods: {
			// 添加商品按钮
			addCart (event) {
				// 防止被多次点击
				if (!event._constructed) {   //非自定义点击事件的情况下return掉，这样pc端就不会检测到两次点击事件。
					return
				}
				if (!this.food.count) {
					//给对象添加他不存在的属性时，这样的方式是不行的。需要用Vue的Vue.set()
					Vue.set(this.food, 'count', 1)
					this.food.count = 1
				} else {
					this.food.count++
				}
				this.$emit('cart-add', event.target)  //添加商品时，派发一个事件，将当前DOM传递给goods.vue
			},
			descreaseCart (event) {
				if (!event._constructed) {
					return
				}
				if (this.food.count) {
					this.food.count--
				}
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	.cartcontrol
		font-size: 0
		.cart-descrease
			display: inline-block
			padding: 6px
			transition: all 0.4s linear
			&.move-enter-active, &.move-leave-active
				opacity: 1
				transform: translate3d(0,0,0)
				.inner
					display: inline-block
					line-height: 24px
					font-size: 24px
					color: rgb(0,165,220)
					transition: all 0.4s linear
					transform: rotate(0)
			&.move-enter, &.move-leave-active
				opacity: 0
				transform: translate3d(24px,0,0)
				.inner
					transform: rotate(180deg)
			.inner
				display: inline-block 
				line-height: 24px
				font-size: 24px
				color: rgb(0,165,220)
		.cart-count
			display: inline-block
			vertical-align: top
			width: 12px
			padding-top: 6px
			line-height: 24px
			text-align: center
			font-size: 10px
			color: rgb(147,153,159)
		.cart-add
			display: inline-block
			padding: 6px
			line-height: 24px
			font-size: 24px
			color: rgb(0,165,220)
</style>