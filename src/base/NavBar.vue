<template lang='pug'>
.navs
  span(@mouseover="show()" @mouseleave="hide()")
    router-link(to="") 分类
    ul(v-show="isShow", @mouseout="selectTab(0)")
      li(v-for="item in classify", @mouseover="selectTab(item.id)", :key="item.id", )
        img(:src="item.img")
        span {{item.txt}}
        .subcategories
          .sub-category(v-for="c in subs.slice(0,6)", :key="c.id") 
            //- show 6 and more
            .sub-name {{c.name}}
            .triples
              .triple(v-for="tc in c.categories.slice(0,7)", :key="tc.id") {{tc.name}}
              .triple 更多
          .span 更多分类

  span
    router-link(to="/home") 首页
  span
    router-link(to="city") 同城
  span
    router-link(to="/friday") 礼拜五
  span
    router-link(to="mall") 积分商城
  span
    router-link(to="/nav") 导航+
</template>
<script>
import {mapState, mapActions} from 'vuex'
export default {
  data() {
    return {
      isShow: false,
      tab: 0,
      classify: [
        { id: 1,img: "/static/classify/1.png", txt: "新鲜水果" },
        { id: 2,img: "/static/classify/2.png", txt: "日用家居" },
        { id: 3,img: "/static/classify/3.png", txt: "精美礼盒" },
        { id: 4,img: "/static/classify/4.png", txt: "食用粮油" },
        { id: 5,img: "/static/classify/5.png", txt: "零食酒水" },
        { id: 6,img: "/static/classify/6.png", txt: "蛋奶素食" },
        { id: 7,img: "/static/classify/7.png", txt: "肉类家禽" },
        { id: 8,img: "/static/classify/8.png", txt: "田园蔬菜" },
        { id: 9,img: "/static/classify/9.png", txt: "新鲜水果" }
      ]
    };
  },
  created() {
    if(!this.categories.length) this.fetchCategories()
  },
  computed: {
    ...mapState({categories: s=>s.category.categories}),
    subs() {
      const c =  this.categories.find(x=>x.id === this.tab)
      if(c) return c.categories
      return []
    }
  },
  methods: {
    ...mapActions({fetchCategories: 'category/fetchRemote'}),
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    selectTab(x) {
      this.tab = x
    },
    // getChildren(c){
    //   // get the children categories of the level 1 categories
    //   return 
    // }
  }
};
</script>
<style lang='stylus'scoped>
.navs
  box-sizing border-box

  span
    display inline-block
    padding 15px 0

    &:hover
      background-color #f08200

    &:last-child a
      border-right none

  a
    display inline-block
    box-sizing border-box
    padding 0 60px
    font-size 16px
    border-right 1px solid #dddddd
    text-decoration none
    color #000

.navs span:hover, .navs span:hover a
  color #fff

.navs span:first-child
  position relative
.subcategories
  display flex
  flex-direction column
  padding 20px
  background-color #EBFFE7
  .sub-category
    display flex
    color #498E3D
    font-size 18px
    .sub-name 
      width 100px
    .triples
      color #333
      font-size 14px
      width 320px
      display flex
      flex-wrap wrap
      .triple
        width 80px
        text-align center
ul, li
  list-style none
  padding 0
  margin 0
  background-color #fff

ul
  width 153px
  border 1px solid #dddddd
  position absolute
  top 50px
  left 0
  z-index 999
  height 500px
  box-sizing border-box

li
  text-align center
  border-bottom 1px solid #dddddd
  color #333333
  width 100%
  height 11.11%
  &:hover
    background-color #f08200
    .subcategories
      display block
  .subcategories
    position absolute
    height 500px
    padding 20px
    top 0
    left 153px
    display none
    .sub-category
      height 70px

li img
  width 30px
  height 30px
  margin-right 10px
  vertical-align middle

li span
  vertical-align middle
  font-size 16px
</style>