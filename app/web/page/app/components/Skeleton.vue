<template>
  <content-placeholders class="row-padding30" :animated="false">
    <content-placeholders-img />
    <content-placeholders-img />
    <content-placeholders-img />
    <content-placeholders-img />
  </content-placeholders>
</template>

<script>
  import Vue from 'vue'
  import VueContentPlaceholders from 'vue-content-placeholders'
  Vue.use(VueContentPlaceholders)
  export default {
    data () {
      return {}
    },
    created () {},
    methods: {},
    components: {},
  }
</script>

<style lang="less" scoped>
.search-input {
  /deep/.vue-content-placeholders-text__line {
    margin: 20px auto 30px;
    height: 64px;
    border-radius: 32px;
    width: 100%;
  }
}
.banner {
  margin-bottom: 50px;
}
.categories {
  display: flex;
  justify-content: flex-start;
  /deep/.vue-content-placeholders-text__line {
    height: 100px;
    width: 100px;
    margin: 0 auto 30px;
    // width: 100%;
  }
}
.list-header /deep/.vue-content-placeholders-text__line{
  width: 100%;
  height: 40px;
  margin-top: 20px;
  margin-bottom: 40px;
}

</style>