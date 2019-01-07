<template lang="pug">
.content
  .info
    span 对号
    .hint 订单已提交, 请于24小时内完成支付
      span.orange (逾期订单将被取消)
  .address   
    span 送货至: {{}}
  .pay-info
    span 应付金额: {{totalPrice}}
    //- span 订单编号: {{order.id}}
  .payments
    radio(:value="pay ==='alipay'", @input="choosePay('alipay')")
    span 支付宝
    radio(:value="pay === 'wechat'", @input="choosePay('wechat')")
    span 微信支付
  .pay-method
    img.alipay(src="/static/misc/alipay.png", v-if="pay==='alipay'", @click="payMoney()")
    img(src="/static/misc/wechat.png", v-else, @click="payMoney()")
  .modal(v-if="showModal")
    .modal-content
      h2 支付完成前请不要关闭此页面
      .buttons
        f-button(big, secondary,@click="complete") 
          div 已经完成支付
          div 查看订单详情
        f-button(big, primary, @click="changePayment")
          div 支付失败
          div 更换支付方式
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'ConfirmSuccess',
  data() {
    return {pay: 'alipay',
    showModal: false
    }
  },
  computed: {
    ...mapState({orders: s=>s.order.orders}),
    orderId() {
      return this.$route.params.id
    },
    totalPrice() {
      return 1000
    }
  },
  methods: {
    choosePay(p) {
      this.pay = p
    },
    payMoney() {
      this.showModal = true
    const opened = window.open(`http://localhost:5500/${this.pay}.html`, '_blank',
      "toolbar=yes,top=500,left=500,width=400,height=400" )
      window.onmessage = (e) => {
        if(e.data.type==="pay") {
          if(e.data.success) {
            // payment success
            this.$router.push({name: 'paysuccess', params: {id: this.orderId}})
            this.$store.dispatch('cart/payOrder', {orderId: this.orderId})
          }
        }
      }
    },
    complete() {
      this.showModal = false

    },
    changePayment() {
      this.showModal = false
    }
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
.modal
  position fixed
  top 0
  left 0
  width 100vw
  height 100vh
  background-color rgba(30,30,30, 0.5)
  display flex
  justify-content center
  align-items center
  .modal-content
    width 400px
    height 300px
    background #fff
    display flex
    justify-content center
    align-items center
</style>