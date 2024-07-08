<template>
  <div class="coach-home" :class="{ isAndroid: !isIos }">
    <van-sticky>
      <NavBar
        left-text="返回"
        title="绩效计算器"
        :border="false"
        :safe-area-inset-top="true"
        @click-left="back"
      >
        <template #left>
          <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
        </template>
      </NavBar>
    </van-sticky>
    <div class="coach-home-content">
      <div class="income">
        <div class="income-item income-real">
          <div class="income-item-num">
            <span>¥{{ this.calcIntro.rcOrderRetailAmt | formatMoney }} </span>
          </div>
          <div class="income-item-desc">顾客订单</div>
        </div>
        <div class="income-item income-real">
          <div class="income-item-num">
            <span>{{ this.calcIntro.rcRetailPer }}%</span>
          </div>
          <div class="income-item-desc">折扣</div>
        </div>
        <div class="line"></div>
        <div class="income-item income-target">
          <div class="income-item-num">
            <span>¥{{ this.calcIntro.bcOrderRetailAmt | formatMoney }}</span>
          </div>
          <div class="income-item-desc">顾问订单</div>
        </div>

        <div class="income-item income-target">
          <div class="income-item-num">
            <span>{{ this.calcIntro.bcRetailPer }}%</span>
          </div>
          <div class="income-item-desc">折扣</div>
        </div>
      </div>
      <div class="content">
        <div class="content-bg">
          <img src="../../images/index/icon_hot.png" alt="" />
          <span class="content-bg-text">{{
            this.calcIntro.retailPerDescribe
          }}</span>
        </div>
      </div>
      <div class="content">
        <div class="content-calc">
          <p class="content-title">—本月在线订购—</p>
        </div>
        <div class="content-intro">
          <p class="content-intro-title">从玫琳凯之窗下单</p>
          <!-- <input
            v-model="bcOrderRoutineRetailTotal"
            type="number"
            class="content-intro-input"
            placeholder="请输入实付金额
"
          /> -->
          <div class="numKey" @click="goNumber('bcOrderRoutineRetailTotal')">
            <span> {{ bcOrderRoutineRetailTotal }}</span>
            <span v-if="this.bcOrderRoutineRetailTotal == ''"
              >请输入实付金额</span
            >
          </div>
        </div>
        <div class="content-intro content-intro-sec">
          <p class="content-intro-title">从玫琳凯中国官方商城下单</p>
          <!-- <input
            type="number"
            v-model="rcOrderRoutineRetailTotal"
            class="content-intro-input"
            placeholder="请输入实付金额
          
"
          /> -->
          <div class="numKey" @click="goNumber('rcOrderRoutineRetailTotal')">
            <span> {{ rcOrderRoutineRetailTotal }}</span>
            <span v-if="this.rcOrderRoutineRetailTotal == ''"
              >请输入实付金额</span
            >
          </div>
        </div>
        <div class="content-mes">
          注意：输入的订单金额为订单折扣前的支付金额（促销折扣后金额，不含兑换的产品点数、优惠券、运费等）。
        </div>
        <div class="content-btn">
          <div class="content-btn-clear" @click="clear">清空</div>
          <div class="content-btn-save" @click="goCalc()">计算绩效</div>
        </div>
      </div>
      <div class="content">
        <div class="content-calc">
          <p class="content-title">计算结果</p>
          <div class="content-outcome">
            <div class="content-outcome-text">当前个人绩效</div>
            <div class="content-outcome-num">
              {{ this.calcIntro.productionAmount }}
            </div>
          </div>
          <div class="content-outcome">
            <div class="content-outcome-text">订购后个人绩效</div>
            <div class="content-outcome-num">
              {{ this.calcData.achieveProductionAmount }}
            </div>
          </div>
          <div class="content-outcome" v-if="this.levelCode >= 60">
            <div class="content-outcome-text">当前沙龙绩效</div>
            <div class="content-outcome-num">
              {{ this.calcIntro.unitProductionAmount }}
            </div>
          </div>
          <div class="content-outcome" v-if="this.levelCode >= 60">
            <div class="content-outcome-text">订购后沙龙绩效</div>
            <div class="content-outcome-num">
              {{ this.calcData.achieveUnitProductionAmount }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-number-keyboard
      v-model="pro"
      :show="show"
      theme="custom"
      close-button-text="完成"
      :hide-on-click-outside="true"
      @blur="
        show = false;
        fullscreen = false;
      "
      :z-index="zIndex"
      @input="onInput"
      @delete="onDelete"
    />
  </div>
</template>
<script>
import {
  NavBar,
  Button,
  Tabbar,
  TabbarItem,
  Dialog,
  Field,
  Col,
  Row,
  Sticky,
  NumberKeyboard,
  Toast,
} from "vant";
import {
  isIos,
  isIphoneX,
  getMaxZIndex,
  closeWebview,
  xxxxxx,
  formatMoney,
} from "../../utils/index";

export default {
  data() {
    return {
      pro: "0",
      show: false,
      zIndex: 100,
      levelCode: 97,
      targetContactId: "",
      isIos: isIos(),
      isIphoneX: isIphoneX(),
      //玫琳凯之窗
      bcOrderRoutineRetailTotal: "",
      //中国商城
      rcOrderRoutineRetailTotal: "",
      calcIntro: {
        rcOrderRetailAmt: 0,
        retailPerDescribe: "",
        bcRetailPer: 0,
        rcRetailPer: 0,
        bcOrderRetailAmt: 0,
        productionAmount: 0,
        unitProductionAmount: 0,
      },
      calcData: {
        productionAmount: 0,
        achieveProductionAmount: 0,
        achieveUnitProductionAmount: 0,
        unitProductionAmount: 0,
        achieveUnitProductionAmount: 0,
      },
      //当前点击的数字键盘
      keyWordName: "",
      from: "",
      pageName: "ButtonTab",
      accountType: "",
    };
  },
  created() {
    const { accountType, from } = this.$route.query;
    this.from = from;
    this.accountType = accountType;
    if (accountType === "operation") {
      this.pageName = "StaffPersonalProfilePage";
    } else {
      if (this.from === "profile") {
        this.pageName = "PersonalProfilePage";
      } else {
        this.pageName = "ButtonTab";
      }
    }
    this.initData();
  },
  mounted() {
    // 返回时需要刷新数据
    const onFronted = (data) => {
      this.initData();
    };
    this.$jsBridge.onFronted(onFronted);
  },
  methods: {
    goNumber(data) {
      let eventType;
      if (data === "rcOrderRoutineRetailTotal") {
        if (this.from === "profile") {
          eventType = "PersonalCalculatorRCOrderClick";
        } else {
          eventType = "CalculatorRCOrderClick";
        }
      }
      if (data === "bcOrderRoutineRetailTotal") {
        if (this.from === "profile") {
          eventType = "PersonalCalculatorIntouchOrderClick";
        } else {
          eventType = "CalculatorIntouchOrderClick";
        }
      }

      this.$track({
        context: this.pageName,
        behavior: eventType,
        item_type: this.pageName,
        item_id: eventType,
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      this.show = true;
      this.keyWordName = data;
    },
    onInput(key) {
      console.log(this.keyWordName);
      //   console.log('key',key)
      if (this.keyWordName == "bcOrderRoutineRetailTotal") {
        this.bcOrderRoutineRetailTotal += key;
        console.log(
          "bcOrderRoutineRetailTotal",
          this.bcOrderRoutineRetailTotal
        );
      } else {
        this.rcOrderRoutineRetailTotal += key;
        console.log(
          "rcOrderRoutineRetailTotal",
          this.rcOrderRoutineRetailTotal
        );
      }
    },
    onDelete() {
      if (this.keyWordName == "bcOrderRoutineRetailTotal") {
        this.bcOrderRoutineRetailTotal = this.bcOrderRoutineRetailTotal.slice(
          0,
          this.bcOrderRoutineRetailTotal.length - 1
        );
        console.log(
          "bcOrderRoutineRetailTotal",
          this.bcOrderRoutineRetailTotal
        );
      } else {
        console.log(
          "rcOrderRoutineRetailTotal",
          this.rcOrderRoutineRetailTotal
        );
        this.rcOrderRoutineRetailTotal = this.rcOrderRoutineRetailTotal.slice(
          0,
          this.rcOrderRoutineRetailTotal.length - 1
        );
      }
    },
    clear() {
      let eventType = "CalculatorClearButtonClick";
      if (this.from === "profile") {
        eventType = "PersonalCalculatorClearButtonClick";
      }
      this.$track({
        context: this.pageName,
        behavior: eventType,
        item_type: this.pageName,
        item_id: eventType,
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      this.bcOrderRoutineRetailTotal = "";
      this.rcOrderRoutineRetailTotal = "";
      this.calcData.achieveProductionAmount = 0;
      this.calcData.achieveUnitProductionAmount = 0;
    },
    async loadData() {
      let baseApi = this.$ctx.baseApiList.calc;
      console.log("api", baseApi);
      const params = {};
      const res = await this.$request.get(
        `${baseApi}/initProdCalc/${this.targetContactId}`,
        { params }
      );
      if (res.data) {
        console.log("data", res.data);
        this.calcIntro = res.data.data;

        this.calcIntro.bcRetailPer = this.calcIntro.bcRetailPer * 100;
        this.calcIntro.rcRetailPer = this.calcIntro.rcRetailPer * 100;
        // this.calcData.unitProductionAmount =
        // this.calcIntro.unitProductionAmount;
        // this.calcData.productionAmount = this.calcIntro.productionAmount;
      } else {
        return;
      }
    },
    async goCalc() {
      let eventType = "CalculateButtonClick";
      if (this.from === "profile") {
        eventType = "PersonalCalculateButtonClick";
      }
      this.$track({
        context: this.pageName,
        behavior: eventType,
        item_type: this.pageName,
        item_id: eventType,
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      var totalNum =
        this.rcOrderRoutineRetailTotal + this.bcOrderRoutineRetailTotal;
      if (totalNum == "") {
        Toast("请至少输入一项金额");
        return;
      } else if (totalNum[0] == 0) {
        Toast("请输入大于0的金额");
        return;
      }

      let baseApi = this.$ctx.baseApiList.calc;
      console.log("api", baseApi);
      const bcOrder = {
        routineRetailTotal: Number(this.bcOrderRoutineRetailTotal),
        //routineRetailTotal:1000.01
      };
      const rcOrder = {
        routineRetailTotal: Number(this.rcOrderRoutineRetailTotal),
        //routineRetailTotal:2000.01
      };
      const params = {
        bcOrder,
        rcOrder,
        contactId: Number(this.targetContactId),
      };
      const res = await this.$request.post(`${baseApi}/newProdCalc`, params);
      console.log(params);
      if (res.data) {
        console.log(res.data, "res");
        //个人订购绩效
        this.calcData.achieveProductionAmount =
          res.data.data.achieveProductionAmount;
        //沙龙订购
        this.calcData.achieveUnitProductionAmount =
          res.data.data.achieveUnitProductionAmount;
        //个人当前

        //沙龙当前
        console.log("this.calca", this.calcIntro);
      } else {
        return;
      }

      console.log("this.calcData", this.calcData);
    },
    async initData() {
      const { targetContactId, levelCode } = this.$route.query;
      this.targetContactId = targetContactId;
      this.levelCode = Number(levelCode);

      this.loadData();
    },
    back() {
      closeWebview();
    },
  },
  //   watch: {
  //      pro(val) {
  //          console.log('val',val)
  //     }

  // },
  components: {
    NavBar,
    "van-button": Button,
    "van-tabbar": Tabbar,
    "van-tabbar-item": TabbarItem,
    "van-dialog": Dialog.Component,
    "van-field": Field,
    "van-row": Row,
    "van-col": Col,
    "van-sticky": Sticky,
    "van-number-keyboard": NumberKeyboard,
  },
};
</script>
<style lang="less" scoped>
.coach-home {
  background-color: #fff;
  &-content {
    //padding-top: env(safe-area-inset-top);
    //margin-top: 80px;
  }
  .income {
    background-color: #ee4d9b;
    padding-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    .line {
      height: 59px;
      width: 1px;
      background-color: #fff;
    }
    &-item {
      text-align: center;
      flex: 1;
      color: #fff;
      &-num {
        font-size: 46px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &-desc {
        font-size: 28px;
        margin: 13px 0 30px 0;
      }
    }
    &-real {
      &-icon {
        width: 15px;
        margin-left: 10px;
      }
    }
    &-target {
      &-icon {
        width: 24px;
        margin-left: 10px;
      }
      .set-target {
        // width: 180px;
        padding: 0 30px;
        height: 48px;
        background-color: #fff;
        color: #f16eae;
        font-size: 30px;
        font-weight: bold;
        border: none;
        border-radius: 24px;
      }
    }
  }
  .content {
    width: 95%;
    margin: 15px auto;
    background-color: #fff;
    padding: 16px 22px;
    box-shadow: 0px 2px 12px 0px rgba(193, 193, 193, 0.5);
    border-radius: 16px;
    &-calc {
      text-align: center;
      font-size: 32px;
      color: #484848;
      margin: 20px 0px;
      p {
        font-weight: 700;
      }
    }
    &-intro {
      margin-top: 25px;
      &-title {
        font-size: 28px;

        font-weight: bold;
        color: #484848;
      }
      &-input {
        height: 98px;
        background: #f5f5f5;
        border-radius: 16px;
        border: 0px;
        width: 100%;
        padding: 0 10px;
        margin-top: 15px;
      }
    }
    &-bg-text {
      font-size: 22px;
      color: #484848;
      line-height: 28px;
    }
    &-mes {
      font-size: 22px;
      color: #484848;
      line-height: 28px;
      margin-top: 30px;
    }
    &-btn {
      display: flex;
      justify-content: space-between;
      margin: 40px 0px;
      &-clear {
        height: 98px;
        font-size: 32px;
        box-shadow: 0px 2px 12px 0px rgba(193, 193, 193, 0.5);
        border-radius: 16px;
        color: #7f7f7f;
        text-align: center;
        background: white;
        width: 30%;
        line-height: 98px;
        border: 1px solid #b6b6b6;
      }
      &-save {
        width: 66%;
        background: #f16eae;
        font-size: 32px;
        text-align: center;
        color: white;
        height: 98px;
        box-shadow: 0px 2px 12px 0px rgba(193, 193, 193, 0.5);
        border-radius: 16px;

        line-height: 98px;
      }
    }
    &-outcome {
      display: flex;
      //padding: 15px 0px;
      line-height: 106px;
      border-bottom: 1px dotted #b1b6c0;
      &-text {
        flex: 1;
        font-size: 28px;
        text-align: left;
        color: #484848;
      }
      &-num {
        flex: 1;
        font-size: 28px;
        text-align: right;
        color: #f16eae;
      }
    }
  }
}
.isAndroid {
  .coach-home-content {
    //margin-top: 135px;
  }
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
.target_dialog {
  background-color: transparent;
  .target_content {
    position: relative;
    top: 0;
    width: 542px;
    height: 662px;
    background-image: url("../../images/index/target_bg.png");
    background-size: 100% 100%;
    text-align: center;
    margin: 0 auto;
    &-title {
      width: 100%;
      position: absolute;
      font-size: 45px;
      top: 190px;
      font-weight: bold;
      color: #181818;
      padding: 0 80px;
    }
    &-input {
      position: absolute;
      top: 278px;
      width: 213px;
      left: 170px;
      border-bottom: 3px solid #f16eae;
      .van-field {
        background-color: transparent;
        font-size: 40px;
        line-height: 56px;
        padding: 0;
        /deep/.van-field__control {
          text-align: center;
          color: #f16eae;
        }
      }
    }
    &-tip {
      width: 100%;
      position: absolute;
      top: 382px;
      text-align: left;
      display: flex;
      align-items: flex-start;
      img {
        width: 30px;
        height: 30px;
        margin-left: 28px;
        margin-right: 8px;
      }
      font-size: 24px;
      line-height: 28px;
      color: #181818;
    }
    &-btn {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .btn {
        background: linear-gradient(180deg, #f9a7d7 0%, #f16eae 100%);
        border-radius: 53px;
        height: 76px;
        width: 417px;
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .cer_close {
    margin: 50/7.5vw auto 0;
    width: 58/7.5vw;
    height: 58/7.5vw;
    img {
      width: 100%;
    }
  }
}
/deep/.van-nav-bar {
  background-color: #ee4d9b;
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
.income-item > div {
  flex: 1;
}
.content-title {
  font-weight: 700;
}
.numKey {
  width: 100%;
  margin-top: 15px;
  height: 98px;
  background: #f5f5f5;
  border-radius: 16px;
  padding: 0px 18px;
  font-size: 28px;
  line-height: 98px;
  color: #7f7f7f;
}
.content-bg img {
  width: 22px;
  height: 28px;
  margin-right: 20px;
}
.content-intro-sec {
  margin-top: 30px !important;
}
</style>
