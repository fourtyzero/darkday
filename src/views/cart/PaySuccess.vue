<template lang="pug">
.content.pay-success 
  h2 支付完成 👌
  router-link(:to="`/me/order/${id}`")  查看订单
  
</template>
<script>
export default {
  name: 'PaySuccess',
  computed: {
    id() {
      return this.$route.params.id
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>