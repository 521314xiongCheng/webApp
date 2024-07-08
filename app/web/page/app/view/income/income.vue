<template>
  <div class="my-income" :class="{ isAndroid: !isIos }">
    <NavBar
      left-text="返回"
      :right-text="hiddenHistoryBtn ? '' : '历史收入'"
      fixed
      title=""
      :border="false"
      :safe-area-inset-top="true"
      @click-left="back"
      @click-right="next"
    >
      <template #left>
        <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
      </template>
    </NavBar>
    <div class="my-income-sum">
      <div class="my-income-sum-box">
        <div class="title">{{ monthKey }}收入参考汇总</div>
        <div class="amount">¥ {{ format_number(total) }}</div>
      </div>
    </div>
    <div class="my-income-content">
      <div>
        <div class="message" v-if="messageShow">
          <p>
            首席竞赛服务费包括：顾问销售收益，基本服务费，特别服务费，管理服务费，首席形象代言费，全球领袖发展奖金，精英执行首席经销商发展奖金。
          </p>
          <img
            @click="messageBtn"
            src="../../images/income/icon_delete.png"
            alt=""
          />
        </div>
        <div class="list-item">
          <van-collapse v-model="activeNames" :border="false">
            <van-collapse-item
              v-for="(income, index) in myIncomes"
              :key="`income_${index}`"
              :title="income.title"
              :label="income.showLabel ? income.subTitle : ''"
              :border="false"
              title-class="list-item-title"
              value-class="list-item-value"
              label-class="list-item-label"
              :is-link="income.dataList && income.dataList.length > 0"
              :disabled="!income.dataList || !income.dataList.length"
              :name="index"
            >
              <template #value>
                <div v-if="income.total >= 0">
                  ¥ {{ format_number(income.total) }}
                </div>
                <div v-else>- ¥{{ format_number(Math.abs(income.total)) }}</div>
              </template>
              <div>
                <div
                  class="list-item-content"
                  v-for="(data, dIndex) in income.dataList"
                  :key="`data_${dIndex}`"
                >
                  <span class="whispace">{{ data.description }}</span>
                  <div class="list-item-content-amount" v-if="data.value >= 0">
                    + ¥
                    {{ format_number(data.value) }}
                  </div>
                  <div class="list-item-content-amount" v-else>
                    - ¥
                    {{ format_number(Math.abs(data.value)) }}
                  </div>
                </div>
              </div>
            </van-collapse-item>
          </van-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, Collapse, CollapseItem } from "vant";
import { isIos, xxxxxx, closeWebview, go } from "../../utils/index";

export default {
  components: {
    NavBar,
    "van-collapse": Collapse,
    "van-collapse-item": CollapseItem,
  },
  data() {
    return {
      isIos: isIos(),
      monthKey: "",
      options: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: ".",
        prefix: "¥ ",
        suffix: "",
        decimalPlaces: 2,
      },
      total: 0,
      myIncomes: [],
      activeNames: [0],
      messageShow: false,
      impersonatedContactId: "20002868550",
      hiddenHistoryBtn: false,
    };
  },
  watch: {
    // activeNames(newData){
    //   this.myIncomes.forEach(m=>m.showLabel=false)
    //   newData.forEach(n=>{
    //     this.myIncomes[n].showLabel = true
    //   })
    // }
  },
  async mounted() {
    const { hiddenHistoryBtn } = this.$route.query;
    this.hiddenHistoryBtn = hiddenHistoryBtn
      ? JSON.parse(hiddenHistoryBtn)
      : false;
    console.log("hiddenHistoryBtn", hiddenHistoryBtn);
    let monthKey = this.$route.query.monthKey;
    this.monthKey = `${monthKey.substr(0, 4)}年${monthKey.substr(4, 6)}月`;
    // let baseApi = 'https://mock.marykay.com.cn/mock/428/api/v1'
    const params = {
      monthKey: monthKey,
    };
    let baseApi = this.$ctx.baseApiList.income;
    let url = `${baseApi}/prodIncome/myIncomes?monthKey=${params.monthKey}`;
    try {
      this.impersonatedContactId = this.$ctx.targetContactId;
      const res = await this.$request.get(url, {
        headers: {
          impersonatedContactId: this.impersonatedContactId,
        },
      });
      this.myIncomes = res.data.myIncome.incomeList.filter(
        (income) => income.total !== 0 || income.keepShow
      );
      this.myIncomes.forEach((o) => {
        if (o.dataList) {
          o.dataList = o.dataList.filter((d) => d.value !== 0);
        }
      });
      this.total = this.$route.query.amount
        ? this.$route.query.amount * 1
        : res.data.myIncome.total;
      // myIncome[0].total为空时
      // this.myIncomes[0].total = this.myIncomes[0].total ? this.myIncomes[0].total : this.total
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    back() {
      closeWebview();
    },
    next() {
      if (this.hiddenHistoryBtn) return;
      const { from } = this.$route.query;
      if (from === "UnitDetailsPage") {
        this.$track({
          context: "UnitDetailsPage",
          behavior: "UnitDetailsMoreHistoryIcomeClick",
          item_type: "UnitDetailsPage",
          item_id: "UnitDetailsMoreHistoryIcomeClick",
        });
      } else {
        this.$track({
          context: "HomePage",
          behavior: "HistoryIncomeClick",
          item_type: "HomePage",
          item_id: "HistoryIncomeClick",
        });
      }
      let url = `${window.location.origin}/incomeList`;
      go(url, {
        opaque: false,
        targetContactId: this.impersonatedContactId,
      });
    },
    format_number(num) {
      if (num === null) return "-";
      num = num.toFixed(2);
      num += "";
      let x = num.split(".");
      let x1 = x[0];
      let x2 = x.length > 1 ? "." + x[1] : "";
      let rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
      }
      return x1 + x2;
    },
    messageBtn() {
      this.messageShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.my-income {
  background-color: #ee4d9b;
  &-sum {
    padding-top: env(safe-area-inset-top);
    margin-top: 80px;
    width: 100vw;
    padding-bottom: 50/7.5vw;
    background-color: #ee4d9b;
    color: #fff;
    &-box {
      text-align: center;
      width: 100vw;
      bottom: 121/7.5vw;
      .title {
        font-size: 26/7.5vw;
      }
      .amount {
        font-size: 56/7.5vw;
      }
    }
  }
  &-content {
    padding: 30/7.5vw;
    width: 100vw;
    background-color: #fff;
    border-radius: 20/7.5vw 20/7.5vw 0 0;
    min-height: 30vh;
    .list-item {
      margin-top: 14/7.5vw;
      margin-bottom: 16/7.5vw;
      &-content {
        display: flex;
        justify-content: space-between;
        white-space: normal;
        &-amount {
          flex: none; //不能被压缩或放大
        }
      }
    }
  }
  /deep/.van-cell {
    padding: 30/7.5vw 0 30/7.5vw 0;
    position: relative;
  }
  /deep/.van-cell--clickable:active {
    background-color: transparent;
  }
  /deep/.van-collapse-item__wrapper {
    padding: 30/7.5vw;
    background-color: #f6f7fa;
    border-radius: 12/7.5vw;
    .van-collapse-item__content {
      background-color: #f6f7fa;
      padding: 0;
      font-size: 28/7.5vw;
      color: #666;
      line-height: 74/7.5vw;
    }
  }
  .message {
    position: relative;
    padding: 17/7.5vw 46/7.5vw 17/7.5vw 20/7.5vw;
    background-color: #fefce3;
    border-radius: 20px;
    p {
      font-size: 24/7.5vw;
      line-height: 32/7.5vw;
      color: #f49433;
    }
    img {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 32/7.5vw;
    }
  }
  /deep/.list-item-title {
    font-size: 28/7.5vw;
    color: #333;
    font-weight: bold;
    // line-height: 1;
  }
  /deep/.list-item-value {
    font-size: 28/7.5vw;
    color: #333;
    position: absolute;
    right: 6vw;
    z-index: 2;
    background: #fff;
    font-weight: bold;
    // line-height: 1;
  }
  /deep/.list-item-label {
    font-size: 24/7.5vw;
    color: #999;
    // line-height: 1;
    margin-bottom: 4px;
  }
  /deep/ .van-collapse-item__wrapper {
    transition: height 0.01s ease-in;
  }
  /deep/ .van-notice-bar__content {
    font-size: 24/7.5vw;
    line-height: 32/7.5vw;
  }
}

.isAndroid {
  .my-income-sum {
    margin-top: 135px;
  }
  /deep/.van-nav-bar {
    padding-top: 55px;
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
      .van-nav-bar__text {
        color: #fff;
        font-size: 30/7.5vw;
      }
    }
  }
}
</style>
