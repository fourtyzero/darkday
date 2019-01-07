<template lang="pug">
.order-detail
  div(v-if="fetching")
    div fetching...
    img(src="/static/misc/cog.png")
  div(v-else)
    .status {{status}}
    div 订单编号 {{order.id}}
    .items
      .item(v-for="item in (order.items)", :key="item.id")
        div {{item.product.name}}
        div {{item.price}}
        img(:src="item.product.images[0]") 
</template>
<script>
import {http} from '@/utils'
import {mapState} from 'vuex'

export default {
  name: 'MyOrderDetail',
  data() {
    return {
      order: {
        status: 0,
        items: []
      },
      fetching: false
    }
  },
  created() {
    this.fetching = true
    http.withToken(this.me.token)
    .get('/api/me/order/get', {params: {id: this.orderId}})
    .then((res) => {
      this.fetching = false
      this.order = res.data
    })
  },
  computed: {
    ...mapState({me: s=>s.user.me}),
    orderId() {
      return this.$route.params.id
    },
    status() {
                  // 0 : 待支付
            // 1 : 待发货(已支付)
            // 2 : 待收货
            // 3 :: 待确认
            // 4 :: 待评价
            // 5 :: 已评价
            const map = {0: '待支付', 1: '待发货'};
            return map[this.order.status];
    }
  }

}
</script>
<style lang="stylus" scoped>
.order-detail
  border solid 1px lightgray
</style>