<template lang="pug">
.stars
  .star(v-for="i in [1,2,3,4, 5]", :key="i")
    img(src="/static/products/star-full.png", v-if="i<=star")
    img(src="/static/products/star.png", v-else)
</template>
<script>
export default {
  name: 'Rating',
  props: ['star', 'still'],
  computed: {
    isStill() {
      return this.still === undefined ? true : this.still;
    }
  }
}
</script>
<style lang="stylus" scoped>
.stars
  display flex
  .star
    margin-right 5px
</style>