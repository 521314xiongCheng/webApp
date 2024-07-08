<template>
  <div>
    <van-overlay :show="show" class-name="download-mask">
      <div class="download-mask_box">
        <van-circle v-model="downloadInfo.currentRate" :rate="0" :speed="100" :text="circleText" layer-color="rgba(255,255,255,.5)" color="#FF357D" fill="#fff" strokeWidth="60">
          <div class="van-circle__text" v-if="downloadInfo.currentRate < 100">{{circleText}}</div>
          <img class="van-circle__img" v-else width="40" height="41" src="../images/hook.png" alt="">
        </van-circle>
        <div class="text">{{downloadInfo.downloadText}}</div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
import { Overlay } from 'vant'
import Circle from './Circle.js'
export default {
  name: "DownloadCircle",
  data() {
    return {
      show: true
    };
  },
  props: {
    downloadInfo:{
      type:Object,
      default: ()=>{
        return {}
      }
    }
  },
  computed: {
    circleText() {
      return `${this.downloadInfo.currentRate}%`
    }
  },
  components: {
    'van-circle': Circle,
    'van-overlay': Overlay
  }
};
</script>
<style lang="less" scoped>
.download-mask {
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2003;
  &_box {
    /deep/.van-circle {
      display: flex;
      justify-content: center;
      align-items: center;
      .van-circle__text {
        color: #FF357D;
        font-size: 40px;
      }
      .van-circle__img {
        position: absolute;
      }
    }
    .text {
      font-size: 30px;
      text-align: center;
      margin-top: 10px;
      color: #fff;
    }
  }
}
</style>