<template lang="pug">
.content
  .info
    span 对号
    .hint 订单已提交, 请于24小时内完成支付
      span.orange (逾期订单将被取消)
  .address   
    span 送货至: {{}}
  
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'ConfirmSuccess',

  computed: {
    ...mapState({orders: s=>s.order.orders}),
    orderId() {
      return this.$router.query.order_id
    },

  }
}
</script>
<style lang="stylus" scoped>
.info
  display flex
  padding 40px
  align-items center
  flex-direction column
.orange
  color orange
</style>