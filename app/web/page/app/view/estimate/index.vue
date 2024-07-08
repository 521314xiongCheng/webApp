<template>
  <div class="coach-home" :class="{ isAndroid: !isIos }">
    <NavBar
      left-text="返回"
      title="评估收入明细"
      :border="false"
      :safe-area-inset-top="true"
      @click-left="back"
    >
      <template #left>
        <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
      </template>
    </NavBar>
    <div class="coach-home-bg">
      <img src="../../images/estimate.png" alt="" width="100%" />
    </div>
    <div class="coach-home-content">
      <div class="title">
        <img src="../../images/careful.png" alt="" />
        <span
          >当前收益都是基于本人A状态下收益评估,实际收益请以实际收入为准,请知晓。</span
        >
      </div>
      <!-- 零售 -->
      <div class="retail">
        <div class="retail-title">
          <span class="retail-title-left">零售</span>
        </div>
        <div class="retail-sub">
          <div>
            绩效:
            <span class="retail-sub-num" style="color: #181818">{{
              getIncomedata.retail.productionAmt | formatMoney
            }}</span>
          </div>
          <div>
            收入:
            <span class="retail-sub-num" style="color: #f16eae"
              >¥{{ getIncomedata.retail.incomeAmt | formatMoney }}</span
            >
          </div>
        </div>
        <div class="retail-mes" v-html="getIncomedata.retail.describe"></div>
      </div>
      <!-- 美容顾问收益 -->
      <div class="retail">
        <div class="retail-title">
          <span class="retail-title-left">美容顾问</span>
        </div>
        <div class="retail-sub">
          <div>
            <span>绩效:</span>
            <span class="retail-sub-num" style="color: #181818">{{
              getIncomedata.team.productionAmt | formatMoney
            }}</span>
          </div>
          <div>
            <span>收入:</span>
            <span class="retail-sub-num" style="color: #f16eae"
              >¥{{ getIncomedata.team.incomeAmt | formatMoney }}</span
            >
          </div>
        </div>
        <div class="retail-mes" v-html="getIncomedata.team.describe"></div>
      </div>
      <!-- 管理沙龙 -->
      <div class="retail no-border" v-if="this.levelCode >= 60">
        <div class="retail-title">
          <span class="retail-title-left">管理沙龙</span>
        </div>
        <div class="retail-sub">
          <div>
            绩效:
            <span class="retail-sub-num" style="color: #181818">{{
              getIncomedata.unit.productionAmt | formatMoney
            }}</span>
          </div>
          <div>
            收入:
            <span class="retail-sub-num" style="color: #f16eae"
              >¥{{ getIncomedata.unit.incomeAmt | formatMoney }}</span
            >
          </div>
        </div>
        <div class="retail-mes" v-html="getIncomedata.unit.describe"></div>
      </div>
      <!-- 管理区域收入 -->
      <div class="retail retail-area" v-if="this.levelCode >= 70">
        <div class="retail-title">
          <span>管理区域</span>
          <!-- <span class="retail-title-right">
              <span class="retail-spac-title">收入:</span>
              <span class="retail-spac-num">¥{{getIncomedata.area.incomeAmt |formatMoney}}</span>
            </span> -->
        </div>
        <div class="retail-sub">
          <div>
            <!-- <span>月平均:</span>
            <span class="retail-sub-num" style="color: #181818">{{
              getIncomedata.area.productionAmt | formatMoney
            }}</span> -->
          </div>
          <div>
            <span>收入:</span>
            <span class="retail-sub-num" style="color: #f16eae"
              >¥{{ getIncomedata.area.incomeAmt | formatMoney }}</span
            >
          </div>
        </div>
        <div class="retail-mes">
          {{levelCode >= 90 ? '注：管理区域收入基于过去三个月首席管理服务费的平均值做预估，请知晓。' : '注：管理区域收入基于过去三个月管理服务费的平均值做预估，请知晓。'}}
        </div>
      </div>
      <div class="btn" @click="back()">知道了</div>
    </div>
  </div>
</template>

<script>
import { NavBar, Button, Icon } from "vant";
import { isIos, closeWebview, xxxxxx, formatMoney } from "../../utils/index";
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      levelCode: 59,
      isFullScreen: false,
      targetContactId: "",
      isIos: isIos(),
      getIncomedata: {
        retail: {},
        team: {},
        unit: {},
        area: {},
      },
    };
  },
  mounted() {
    this.getIncome();
    this.levelCode = Number(this.$route.query.levelCode);
    console.log(this.$route.query);
  },
  methods: {
    back() {
      closeWebview();
    },
    async getIncome() {
      // const params={}
      // if(this.$route.query.targetContactId){
      //   params.contactId=this.$route.query.targetContactId
      // }
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(`${baseApi}/estimate/income`);
      console.log("data", data);
      this.getIncomedata = data;
    },
  },
};
</script>

<style lang="less" scoped>
.coach-home {
  overflow: hidden;
  padding-bottom: 10px;
  &-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
  }
  &-content {
    z-index: 1000;
    position: relative;
    width: 706px;
    box-shadow: 0px 2px 12px 0px rgba(193, 193, 193, 0.5);
    margin: 0px auto;

    padding-left: 30px;
    padding-right: 30px;
    background-color: white;
    border-radius: 15px;
    overflow: hidden;
    .title {
      margin-top: 40px;
      img {
        vertical-align: middle;
        width: 32px;
      }
      font-size: 22px;
      font-weight: 500;
      color: #7f7f7f;
    }
  }
}
.isAndroid {
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}

/deep/.van-nav-bar {
  background-color: #f16eae;
  z-index: 10;
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
.retail {
  color: #7f7f7f;
  font-size: 22px;
  border-bottom: 1px dotted #e5e5e5;
  margin-top: 15px;
  padding-bottom: 25px;
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28px;
    color: #484848;
    font-weight: bold;
    padding: 18px 20px;
    line-height: 1;
  }
  &-title-left {
    position: relative;
    &::before {
      content: " ";
      width: 7px;
      height: 28px;
      background-color: #f16eae;
      position: absolute;
      left: -22px;
      top: 0;
    }
  }
  &-sub {
    display: flex;
    justify-content: space-between;
    padding: 0px 20px;
    align-items: center;
    &-num {
      font-size: 32px;
      // vertical-align: top;
    }
  }
  &-mes {
    padding: 0 20px;
    margin-top: 15px;
  }
}
.btn {
  width: 503px;
  height: 76px;
  background: #f16eae;
  border-radius: 53px;
  text-align: center;
  line-height: 76px;
  color: white;
  font-size: 30px;
  margin: 30px auto;
}
.retail-spac {
  font-size: 22px;
  margin-left: 10px;
  color: #7f7f7f;
  font-weight: 500;
}
.retail-area {
  background: #f8f8f8;
  border-radius: 13px;
  border-bottom: 0px;
}
.retail-spac-title {
  font-size: 22px;
  color: #7f7f7f;
  font-weight: 500;
}
.retail-spac-num {
  font-size: 32px;
  font-weight: 500;
}
.no-border {
  border: 0px;
}
.retail-sub {
  align-items: center;
  
}
.retail-sub > div {
  display: flex;
  align-items: center;
}
</style>
