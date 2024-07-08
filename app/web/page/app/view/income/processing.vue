<template>
  <div class="my-income" :class="{'isAndroid':!isIos}">
    <NavBar 
      left-text="返回" 
      right-text="历史收入"
      fixed 
      title="" 
      :border="false"
      :safe-area-inset-top="true"
      @click-left="back"
      @click-right="next">
      <template #left>
        <img class="back_btn" src="../../images/index/icon_back.png" alt="">
      </template>
    </NavBar>
    <div class="my-income-content">
      <img src="../../images/income/processing.jpg" alt="">
      <div v-if="day === 1">收入明细数据正在准备中，<br/>预计2号正常显示～</div>
      <div v-else>亲，您本月还没有收入数据。</div>
    </div>
  </div>
</template>

<script>
import { NavBar} from 'vant';
import { closeWebview, isIos,go } from '../../utils/index'
export default {
  components: {
    NavBar
  },
  data() {
    return {
      isIos: isIos(),
      day: 1
    }
  },
  async mounted() {
    let day = Number(this.$route.query.day)
    this.day = day
  },
  methods: {
    back() {
      closeWebview()
    },
    next() {
      let url = `${window.location.origin}/incomeList`;
      go(url,{
        opaque: false,
        targetContactId: this.$route.query.targetContactId
      });
    },
  }
}
</script>

<style lang="less" scoped>
.my-income {
  background-color: #EE4D9B;
  &-content{
    padding-top: env(safe-area-inset-top);
    margin-top: 80px;
    width: 100vw;
    background-color: #fff;
    min-height: 30vh;
    text-align: center;
    font-size: 46/7.5vw;
    color: #d15b8e;
    img{
      width: 100vw;
      margin-bottom: 20/7.5vw;
    }
  }
}
.isAndroid {
  .my-income-content {
    margin-top: 135px;
  }
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
/deep/.van-nav-bar {
  background-color: #EE4D9B;
  .van-nav-bar__content {
    height: 80px;
    .van-nav-bar__left {
      .back_btn {
        width: 17px;
        height: 32px;
      }
    }
    .van-nav-bar__right {
      .van-nav-bar__text {
				color: #fff;
				font-size: 30/7.5vw;
      }
    }
  }
  .van-nav-bar__title {
    color: #fff;
    font-size: 30px;
  }
}
</style>