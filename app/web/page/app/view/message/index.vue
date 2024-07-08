<template>
  <div class="opaque-wrap" :class="{'isAndroid':!isIos}">
    <NavBar 
      left-text="返回" 
      fixed 
      title="事业机会" 
      :border="false"
      :safe-area-inset-top="true"
      @click-left="back"
      @click-right="customer">
      <template #left>
        <img class="back_btn" src="../../images/index/icon_back.png" alt="">
      </template>
      <template #right>
        <img class="customer_btn" src="../../images/index/icon_customer.png" alt="">
      </template>
    </NavBar>
    <div class="opaque-wrap-content">
      <div class="update-time">{{new Date() | formatDate('YYYY/MM/DD HH:mm:ss')}}</div>
      <div class="page-content">
        <div class="message-item" 
          v-for="(message,index) in messages"
          :key="`message_${index}`"
        >
          <div class="message-item-title">{{message.title}}</div>
          <div v-html="message.message"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { NavBar } from 'vant'
import { isIos, closeWebview } from '../../utils/index'
import { getICSH5Url } from '../../utils/customer'
export default {
  data() {
    return {
      isIos: isIos(),
      messages: []
    };
  },
  created() {
    this.initPage()
  },
  methods: {
    async initPage() {
      //https://mybiz-gateway-latest.qa.pcf.mkc.io/intouch-coach-api/api/v1/messages?access_token=699226a6d76d8d3f445f85e0065d893022728289
      const { data } = await this.$request.get(`${this.$ctx.baseApi}/messages`)
      console.log(data)
      this.messages = data
    },
    back() {
      closeWebview()
    },
    customer() {
      let customerUrl = `${getICSH5Url()}&title=我的客服`
      this.$jsBridge.openSchema(customerUrl)
    },
  },
  components: {
    NavBar
  }
};
</script>
<style lang="less" scoped>
.opaque-wrap {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  background-color: #FAFAFA;
  min-height: 100vh;
  &-content {
    padding-top: 80px;
    .update-time {
      width: 330px;
      font-size: 26px;
      color: #484848;
      line-height: 50px;
      border-radius: 25px;
      background-color: #E8E8E8;
      margin: 30px auto;
      text-align: center;
    }
    .page-content {
      padding: 0 30px;
      .message-item {
        margin-bottom: 30px;
        background-color: #fff;
        border-radius: 10px;
        padding: 22px;
        font-size: 28px;
        line-height: 35px;
        color: #484848;
        &-title {
          font-size: 32px;
          line-height: 34px;
          margin-bottom: 15px;
          font-weight: bold;
        }
      }
    }
  }
}
.isAndroid {
  .opaque-wrap-content {
    padding-top: 135px;
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
      .customer_btn {
        width: 40px;
        height: 40px;
      }
    }
  }
  .van-nav-bar__title {
    color: #fff;
    font-size: 30px;
  }
}
</style>