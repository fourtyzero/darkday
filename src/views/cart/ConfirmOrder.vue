<template lang="pug">
.content.confirm-order
  .addresses-info
    .header
      span 收货人信息
      f-button(secondary, @click="addNewAddress") 使用新地址
    .addresses(v-if="me.addresses.length>0")
      transition-expand
        .addresses-wrapper(v-show="expanded")
          .address(v-for="a in upAddresses", :key="a.id", )
            .left
              radio(:value="selected === a.id", @input="selectAddress(a.id)")
              span {{addr2String(a)}}
            .right
              span 修改
              span(@click="deleteAddress(a.id)") 删除
              span(@click="setDefault(a.id)", v-if="a.id !== defaultAddress.id") 设为默认地址
      //- and the selected address
      .address#seleted-address
        .left
          radio(:value="selected === selectedAddress.id", @input="selectAddress(selectedAddress.id)")
          span {{addr2String(selectedAddress)}}
        .right
          span 修改
          span(@click="deleteAddress(defaultAddress.id)") 删除
          span(@click="setDefault(selectedAddress.id)", v-if="selectedAddress.id !== defaultAddress.id") 设为默认地址
      transition-expand
        .addresses-wrapper(v-show="expanded")
          .address(v-for="a in downAddresses", :key="a.id", )
            .left
              radio(:value="selected === a.id", @input="selectAddress(a.id)")
              span {{addr2String(a)}}
            .right
              span 修改
              span(@click="deleteAddress(a.id)") 删除
              span(@click="setDefault(a.id)", v-if="a.id !== defaultAddress.id") 设为默认地址
      .expand
        span(@click="toggleAddresses(true)") 展开其他地址
        span(@click="toggleAddresses(false)") 收起地址
    .groups
      .group(v-for="(items, k) in groups", :key="k")
        cart-group(confirmed, :items="items")
        hr
        h3 开票信息
        .ticket-info
          radio()
          span 不需要
          radio
          span 个人
          radio
          span 单位
        .ticket
          span 发票抬头:
          input(ref="tickets")
          span * 请填写后核对信息
        hr
        h3 添加订单备注
        input(ref="notes")
    .choose-time
      h3 次日达.礼拜五专享
      div 选择送达时间 {{deliveryTime}}
        input(type="datetime-local", v-model="deliveryTime")
    .footer
      .total-price 实付金额:
        span.price {{totalPrice}}
      .redeem 完成后获得积分:
        span.price {{redeems}}
      f-button(big, secondary, @click="submit") 提交订单
</template>
<script>
import { mapState } from 'vuex'
import { groupBy, pickBy } from 'lodash'
import CartGroup from '@/components/cart/CartGroup'

export default {
  name: 'ConfirmOrder',
  components: {
    CartGroup,
  },
  data() {
    return {
      deliveryTime: new Date().toString(),
      selected: 0,
      expanded: false,
    }
  },
  created() {
    this.selected = this.me.default_address
  },
  computed: {
    ...mapState({ me: (s) => s.user.me, items: (s) => s.cart.items }),
    addresses() {
      return this.me.addresses
    },
    checkedItems() {
      return pickBy(this.items, (i) => i.checked)
    },
    groups() {
      // return items grouped by seller
      return groupBy(this.checkedItems, (item) => item.seller.id)
    },
    upAddresses() {
      const ind = this.addresses.findIndex((x) => x.id === this.selected)
      return this.addresses.slice(0, ind)
    },
    downAddresses() {
      const ind = this.addresses.findIndex((x) => x.id === this.selected)
      return this.addresses.slice(ind + 1)
    },
    selectedAddress() {
      return this.addresses.find((a) => a.id === this.selected)
    },
    defaultAddress() {
      return this.addresses.find((a) => a.id === this.me.default_address)
    },
    restAddresses() {
      return this.addresses.filter((a) => a.id !== this.selected)
    },
    totalPrice() {
      return Object.values(this.checkedItems).reduce(
        (sum, i) => sum + i.quantity * i.spec.current_price,
        0
      )
    },
    redeems() {
      return Math.ceil(this.totalPrice / 10)
    },
  },
  methods: {
    addr2String(a) {
      return `${a.contact} ${a.province.name}${a.region.name}${a.city.name}${
        a.detail
      }`
    },
    addNewAddress() {},
    setDefault(id) {
      this.$store.dispatch('user/setDefaultAddress', id)
    },
    selectAddress(id) {
      this.selected = id
    },
    deleteAddress(id) {
      this.$store.dispatch('user/deleteAddress')
    },
    toggleAddresses(f) {
      this.expanded = f
    },
    submit() {
      this.$store.dispatch('cart/confirmOrder', {
        cb: (id) => {
          this.$router.push({name: 'to-pay', params: { id } })
        },
        address_id: this.selected,
        // extra: 
      })
    },
  },
}
</script>
<style lang="stylus" scoped>
.address
  display flex
  justify-content space-between
  background #F4FFF2

.price
  color red

.header
  display flex
  justify-content space-between

.footer
  display flex
  flex-direction column
  align-items flex-end
  justify-content flex-end
  padding 40px
  border solid 1px lightgray
</style>