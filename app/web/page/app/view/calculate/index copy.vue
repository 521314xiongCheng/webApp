<template>
  <div class="coach-home" :class="{ isAndroid: !isIos }">
    <NavBar
      left-text="返回"
      fixed
      title="绩效计算器"
      :border="false"
      :safe-area-inset-top="true"
      @click-left="back"
    >
      <template #left>
        <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
      </template>
    </NavBar>
    <div class="coach-home-content">
      <div class="income">
        <div class="income-item income-real">
          <div>
            <div class="income-item-num">
              <span>{{ this.calcIntro.rcOrderRetailAmt | formatMoney }} </span>
            </div>
            <div class="income-item-desc">顾客订单金额</div>
          </div>
          <div>
            <div class="income-item-num">
              <span>{{ this.calcIntro.rcRetailPer }}%</span>
            </div>
            <div class="income-item-desc">折扣</div>
          </div>
        </div>
        <div class="line"></div>
        <div class="income-item income-target">
          <div>
            <div class="income-item-num">
              <span>{{
                this.calcIntro.bcOrderRetailAmt | formatMoney
              }}</span>
            </div>
            <div class="income-item-desc">顾问订单金额</div>
          </div>
          <div>
            <div class="income-item-num">
              <span>{{ this.calcIntro.bcRetailPer }}%</span>
            </div>
            <div class="income-item-desc">折扣</div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="content-bg">
          <img src="../../images/popularity-icon.png" alt="" width="15px" />
          <span class="content-bg-text"
            >{{this.calcIntro.retailPerDescribe}}</span
          >
        </div>
      </div>
      <div class="content">
        <div class="content-calc">
          <p>—本月在线订购—</p>
        </div>
        <div class="content-intro">
          <p class="content-intro-title">从玫琳凯之窗下单</p>
          <input
            v-model="bcOrderRoutineRetailTotal"
            type="number"
            class="content-intro-input"
            placeholder="请输入实付金额
"
          />
        </div>
        <div class="content-intro">
          <p class="content-intro-title">从玫琳凯中国官方商城下单</p>
          <input
            type="number"
            v-model="rcOrderRoutineRetailTotal"
            class="content-intro-input"
            placeholder="请输入实付金额
          
"
          />
        </div>
        <div class="content-mes">
          注意：输入订单金额为折扣前订单金额，不包含兑换的产品点数，不包含新人券等优惠券。
        </div>
        <div class="content-btn">
          <div class="content-btn-clear" @click="clear">清空</div>
          <div class="content-btn-save" @click="goCalc()">计算绩效</div>
        </div>
      </div>
      <div class="content">
        <div class="content-calc">
          <p>计算结果</p>
          <div class="content-outcome">
            <div class="content-outcome-text">当前个人绩效</div>
            <div class="content-outcome-num">{{this.calcData.productionAmount}}</div>
          </div>
          <div class="content-outcome">
            <div class="content-outcome-text">订购后个人绩效</div>
            <div class="content-outcome-num">{{this.calcData.achieveProductionAmount}}</div>
          </div>
          <div class="content-outcome">
            <div class="content-outcome-text">当前沙龙绩效</div>
            <div class="content-outcome-num">{{this.calcData.unitProductionAmount}}</div>
          </div>
          <div class="content-outcome">
            <div class="content-outcome-text">订购后沙龙绩效</div>
            <div class="content-outcome-num">{{this.calcData.achieveUnitProductionAmount}}</div>
          </div>
        </div>
      </div>
    </div>
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
} from "vant";
import {
  isIos,
  isIphoneX,
  closeWebview,
  xxxxxx,
  formatMoney,
} from "../../utils/index";

export default {
  data() {
    return {
      levelCode: 97,
      targetContactId: "",
      isIos: isIos(),
      isIphoneX: isIphoneX(),
      //玫琳凯之窗
      bcOrderRoutineRetailTotal: 0,
      //中国商城
      rcOrderRoutineRetailTotal: 0,
      calcIntro: {},
      calcData:{},
    };
  },
  created() {
    this.initData();
    this.loadData();
  },
  mounted() {
    // 返回时需要刷新数据
    const onFronted = (data) => {
      this.initData();
    };
    this.$jsBridge.onFronted(onFronted);
  },
  methods: {
    clear() {
      this.bcOrderRoutineRetailTotal = "";
      this.rcOrderRoutineRetailTotal = "";
    },
    async loadData() {
      let baseApi = this.$ctx.baseApiList.calc;
      console.log("api", baseApi);
      const params = {};
      const res = await this.$request.get(
        `${baseApi}/initProdCalc/${this.$route.query.targetContactId}`,
        { params }
      );
      this.calcIntro = res.data.data;
      this.calcIntro.bcRetailPer = this.calcIntro.bcRetailPer * 100;
      this.calcIntro.rcRetailPer = this.calcIntro.rcRetailPer * 100;
      
      
    },
    async goCalc() {
      let baseApi = this.$ctx.baseApiList.calc;
      console.log("api", baseApi);
      const bcOrder = {
        routineRetailTotal: this.bcOrderRoutineRetailTotal,
      };
      const rcOrder = {
        routineRetailTotal: this.rcOrderRoutineRetailTotal,
      };
      const params = {
        bcOrder,
        rcOrder,
        CareerLevelID:'90',

      };
      const res = await this.$request.post(
        `${baseApi}/newProdCalc`,
        { params }
      );
      console.log(res.data,'res')
      //个人订购绩效
      this.calcData.achieveProductionAmount=res.data.data.achieveProductionAmount
       //沙龙订购
      this.calcData.achieveUnitProductionAmount=res.data.data.achieveUnitProductionAmount
      //个人当前
     
      this.calcData.productionAmount=this.calcIntro.productionAmount
      //沙龙当前
      this.calcData.unitProductionAmount=this.calcIntro.unitProductionAmount

     console.log('this.calcData',this.calcData)
    },
    async initData() {
      if (xxxxxx) {
        let userProfile = await this.$jsBridge.getUserProfile();
        userProfile =
          typeof userProfile === "string"
            ? JSON.parse(userProfile)
            : userProfile;
        console.log(userProfile);
        this.levelCode = Number(userProfile.career_level_code);
        this.targetContactId = userProfile.contact_id;
      } else {
        this.targetContactId = this.$route.query.targetContactId;
        this.levelCode = Number(this.$route.query.levelCode);
      }
    },
    back() {
      closeWebview();
    },
  },
  components: {
    NavBar,
    "van-button": Button,
    "van-tabbar": Tabbar,
    "van-tabbar-item": TabbarItem,
    "van-dialog": Dialog.Component,
    "van-field": Field,
    "van-row": Row,
    "van-col": Col,
  },
};
</script>
<style lang="less" scoped>
.coach-home {
  background-color: #fff;
  &-content {
    padding-top: env(safe-area-inset-top);
    margin-top: 80px;
  }
  .income {
    background-color: #ee4d9b;
    // padding-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 40px 0px 40px;
    .line {
      height: 59px;
      width: 1px;
      background-color: #fff;
    }
    &-item {
      text-align: center;
      flex-grow: 1;
      color: #fff;
      display: flex;
      &-num {
        font-size: 46px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &-desc {
        font-size: 28px;
        margin: 24px 0 42px 0;
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
      justify-content: space-around;
      margin: 35px 0px;
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
    margin-top: 135px;
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
</style>