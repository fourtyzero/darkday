<template lang="pug">
.breadcrumb
  .crumb 您所在的位置:
  .crumb 首页 &gt;
  .crumb(v-for="(c,index) in crumbs", :key="c")
    router-link(:to="c.url", v-if="index !== c.length-1") {{c.title}} 
    span(v-else) {{c.title}} 
    span(v-if="index !== c.length-1") &gt;
</template>
<script>
export default {
  name: 'Breadcrumb',
  props: ['crumbs']
}
</script>
<style lang="stylus" scoped>
.breadcrumb
  display flex
  height 50px
  line-height 50px
  padding  0 20px
  background-color lightgray
  .crumb
    padding 0 10px
</style>