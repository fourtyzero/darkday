<template lang="pug">
panel(title="我的收藏")
  .fav-main
    div(v-if="favorites.length ===0") 还没有收藏
    .favorites(v-else,)
      product-favorite.favorite(v-for="f in favorites", :key="f.id", :product="f")
</template>
<script>
import ProductFavorite from '@/components/common/ProductFavorite'
import {mapState, mapActions} from 'vuex'
export default {
  name: 'MyFavorite',
  components: {
    ProductFavorite,
  },
  data(){
    return {
      // me: {favorites: [
      //   {id: 1, product: {images: ['/static/goods/i1.png'], status: -1,
      //   digest: '花蜜般的甘甜百吃不厌', name: '新西兰佳沛黄金奇异果', original_price: 32,current_price: 20,
      //   }, },
      //   {id: 2, product: {images: ['/static/goods/i2.png'], status: 1,
      //   digest: '花蜜般的甘甜百吃不厌', name: '新西兰佳沛黄金奇异果', original_price: 32,current_price: 20,
      //   }, },
      //   {id: 3, product: {images: ['/static/goods/i3.png'], status: 1,
      //   digest: '真好吃呀', name: '伊朗猕猴桃', original_price: 32,current_price: 20,
      //   }, }
      // ]}
    }
  },
  computed: {
    ...mapState({favs: s => s.favorite.favs}),
    favorites() {
      return Object.values(this.favs)
    }
  }
}
</script>
<style lang='stylus' scoped>
.fav-main
  padding 20px
  .favorites
    overflow hidden
    .favorite
      float left
      margin 10px 20px
      border 1px solid #f4f4f4
</style>