<template lang="pug">
.content.results
  breadcrumb(:crumbs="crumbs")
  .conditions
    .left
      span 排序
      .sorters
        .sorter(@click="setSorter('sales')", :class="{active: sorter === 'sales'}") 销量
        .sorter(@click="setSorter('price')", :class="{active: sorter === 'price'}") 价格
          span.arrow(v-if="!price") ▾
          span.arrow(v-else) ▵
        .sorter(@click="setSorter('rating')", :class="{active: sorter === 'rating'}") 评分最高
    .right 
      span 筛选
      .filters
        span.filter(@click="setFilter('all')", :class="{active: filter === 'all'}") 全国
        span.filter(@click="setFilter('next')", :class="{active: filter === 'next'}") 次日达
  .none(v-if="!fetching && results.length ===0")
    span 没有你找的商品
  .fetching(v-if="fetching")  
    img(src="/static/misc/cog.png", class="cog")
    span 正在搜索
  .search-results.clearfix
    .products
      router-link(:to="{name: 'product', params:{id: p.id}}", v-for="p in results",:key="p.id")
        product-classify( :product="p", myclass="product")
          template(slot="info")
            div
              span 销量 {{p.sales}}
              span 评分 {{p.rating}}
  paginator(:base="$route.fullPath",:current="page | toInt", :last="last" ,v-if="results.length>0")
</template>
<script>
import Product from '@/components/common/Product'
import ProductClassify from '@/components/common/ProductClassify'
import axios from 'axios'
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  name: 'SearchResult',
  components: {
    Product,
    ProductClassify,
  },
  data() {
    return {
      sorter: 'sales',
      price: true,
      filter: 'all',
    }
  },
  created() {
    const { q, categories, sort, filter, page } = this.$route.query
    this.updateParams({ q, categories, sort, filter, page })
    this.search()
  },
  computed: {
    // q, categories, sort, filter
    // keyword() {
    //   return
    // }
    ...mapState({
      results: (s) => s.search.results,
      fetching: (s) => s.search.searching,
      last: s=>s.search.last
    }),
    sentSorter() {
      if(this.sorter === 'price') {
        const d = this.price ? 'up' : 'down'
        return `price${d}`
      }
      return this.sorter
    },
    crumbs() {
      return
    },
    page() {
      return this.$route.query.page || 1
    },
  },
  watch: {
    page() {
      this.$store.commit('search/setPage', this.page)
      this.search()
    }
  },
  methods: {
    ...mapActions({
      search: 'search/search',
    }),
    ...mapMutations({

      updateParams: 'search/setParams',
      updateSorter: 'search/setSorter',
      updateFilter: 'search/setFilter',
    }),
    setSorter(s) {
      if (this.sorter === 'price' && s === 'price') {
        this.price = !this.price
      } else {
        this.sorter = s
      }
      this.updateSorter(this.sentSorter)
      this.search()
    },
    setFilter(s) {
      this.filter = s
      this.updateFilter(this.filter)
      this.search()
    },
    // search(query) {
    //   this.fetching = true
    //   axios.get('/api/search', { params: query }).then(({ data }) => {
    //     this.fetching = false
    //     this.results = data.data
    //     this.last = data.last_page
    //   })
    // },
  },
}
</script>
<style lang="stylus" scoped>
.results
  margin auto
  min-height 500px

.none
  text-align center
  line-height 500px

.fetching
  text-align center

.conditions
  display flex
  padding 15px 0
  justify-content space-between

  .left
    display flex

    .sorters
      display flex

      .sorter
        margin-right 20px
        border solid 1px lightgray

        &.active
          border-color green
          border-width 3px

  .right
    display flex

    .filters
      display flex

      .filter
        margin-left 20px
        background-color lightgray

        &.active
          background-color green
          color white

.product
  float left
  margin-right 20px
  margin-bottom 20px

a:nth-child(4n)
  .product
    margin-right 0

.cog
  animation rotate infinite 1s linear

@keyframes rotate
  from
    transform rotateZ(0deg)

  to
    transform rotateZ(360deg)
</style>