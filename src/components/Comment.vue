<template lang="pug">
.comments
  .comments_left
    .avatar
      img(:src='comment.user.avatar')
      .name {{comment.user.name | safe-name}}
      .phone {{comment.user.mobile | safe-phone}}
  .comments_right
    rating(:star="comment.rating")
    .time {{comment.created_at | dateFormat('YYYY.MM.DD')}}
    .comment {{comment.content}}
    .pictuers
      img.picture(:src="i", v-for="(i,index) in comment.images", :key="i")
</template>
<script>
export default {
  name: 'Comment',
  props: ['comment']
}
</script>
<style lang="stylus" scoped>
.comments
  padding 20px 0
  border-bottom 1px solid #f2f2f2
  overflow hidden

  .comments_left
    float left

    .avatar
      margin-right 30px

      img
        width 100px
        height 100px

      .phone
        font-size 16px

  .comments_right
    float-right
    padding 0 20px

    .starts
      overflow hidden

      img
        margin 0 2px

      .time
        float right

    .comment
      font-size 16px
      margin 5px 0

    .pictuers
      img
        margin 0 1px
        width 50px
        height 50px
</style>