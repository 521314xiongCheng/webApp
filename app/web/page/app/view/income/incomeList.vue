<template>
  <div class="my-income" :class="{ isAndroid: !isIos }">
    <NavBar
      left-text="返回"
      fixed
      right-text=""
      title="历史收入"
      :border="false"
      :safe-area-inset-top="true"
      @click-left="back"
      @click-right="customer"
    >
      <template #left>
        <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
      </template>
      <template #right>
        <img
          class="customer_btn"
          src="../../images/index/icon_customer.png"
          alt=""
        />
      </template>
    </NavBar>
    <div class="my-income-content">
      <div>
        <div
          v-for="(income, index) in incomeData"
          :key="`income_${index}`"
          class="income-data"
        >
          <div class="income-data-year">{{ income.year }}年度</div>
          <el-table
            :data="income.monthDatas"
            stripe
            :border="false"
            @row-click="toDetail"
          >
            <el-table-column prop="monthKey" label="月份"></el-table-column>
            <el-table-column prop="amount" label="收入" align="right">
              <template slot-scope="{ row }">
                <div class="table-amount">
                  {{ format_number(row.amount) }}
                  <img src="../../images/income/link.png" alt="" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NoticeBar, NavBar, Toast } from "vant";
import { isIos, xxxxxx, closeWebview, go } from "../../utils/index";
import { getICSH5Url } from "../../utils/customer";
export default {
  components: {
    "van-notice-bar": NoticeBar,
    NavBar,
  },
  data() {
    return {
      isIos: isIos(),
      options: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: ".",
        prefix: "￥ ",
        suffix: "",
        decimalPlaces: 2,
      },
      tableOptions: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: ".",
        prefix: "",
        suffix: "",
        decimalPlaces: 2,
      },
      incomeData: [],
      impersonatedContactId: "20002868550",
      monthKey: null,
    };
  },
  async mounted() {
    // let baseApi = 'https://mock.marykay.com.cn/mock/428/api/v1'
    const { monthKey } = this.$route.query;
    console.log("monthKey", monthKey);
    this.monthKey = monthKey;
    let baseApi = this.$ctx.baseApiList.income;
    baseApi = baseApi.replace("v1", "v2");
    try {
      this.impersonatedContactId = this.$ctx.targetContactId;
      const res = await this.$request.get(`${baseApi}/prodIncome/incomeTotal`, {
        headers: {
          impersonatedContactId: this.impersonatedContactId,
        },
      });
      let incomeList = res.data.data.sort((a, b) => {
        return b.monthKey - a.monthKey;
      });
      let years = [...new Set(incomeList.map((o) => o.monthKey.slice(0, 4)))];
      this.incomeData = [];
      years.forEach((y) => {
        this.incomeData.push({
          year: y,
          monthDatas: incomeList.filter((o) => o.monthKey.includes(y)),
        });
      });
    } catch (err) {
      // Toast('请求服务器出错，请稍后重试')
      console.log(err);
    }
  },
  methods: {
    back() {
      closeWebview();
    },
    async customer() {
      let url = await getICSH5Url();
      let customerUrl = `${url}&title=我的客服`;
      this.$jsBridge.openSchema(customerUrl);
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
    async toDetail(row) {
      let url = `${window.location.origin}/income`;
      const params = {
        monthKey: row.monthKey,
        amount: row.amount,
        opaque: false,
        targetContactId: this.impersonatedContactId,
        hiddenHistoryBtn: true,
      };
      // 每个月1号 或者收入明细各项都为0进维护页
      let day = new Date().getDate();
      let baseApi = this.$ctx.baseApiList.income;
      let query = {
        monthKey: row.monthKey,
      };
      let requestUrl = `${baseApi}/prodIncome/myIncomes?monthKey=${query.monthKey}`;

      let hasDetail = false;
      try {
        const res = await this.$request.get(requestUrl, {
          headers: {
            impersonatedContactId: this.impersonatedContactId,
          },
        });
        res.data.myIncome.incomeList.forEach((income) => {
          if (income.total && income.total !== 0) {
            hasDetail = true;
            income.dataList.forEach((data) => {
              if (data.value && data.value !== 0) {
                hasDetail = true;
              }
            });
          }
        });
      } catch (err) {}
      console.log(hasDetail);
      if ((day === 1 && row.monthKey === this.monthKey) || !hasDetail) {
        params.day = day;
        url = `${window.location.origin}/processing`;
      }
      go(url, params);
    },
  },
};
</script>

<style lang="less" scoped>
.my-income {
  background-color: #ee4d9b;
  &-content {
    padding-top: env(safe-area-inset-top);
    margin-top: 80px;
    width: 100vw;
    background-color: #fff;
    min-height: 30vh;
  }
  .income-data {
    border-bottom: 20/7.5vw solid #f3f4f7;
    &-year {
      font-size: 32/7.5vw;
      color: #333;
      line-height: 82/7.5vw;
      padding: 0 30/7.5vw;
      font-weight: bold;
    }
  }
  .table-amount {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    img {
      width: 11/7.5vw;
      height: 18/7.5vw;
      margin-left: 15/7.5vw;
    }
  }
  /deep/ .van-notice-bar__content {
    font-size: 24/7.5vw;
    line-height: 32/7.5vw;
  }
  /deep/ .van-hairline--bottom::after {
    border: none;
  }
}
/deep/.el-table th.el-table__cell > .cell,
/deep/.el-table .cell {
  padding: 0 30/7.5vw;
}
/deep/.el-table td,
/deep/.el-table th.is-leaf {
  border: none;
}
/deep/.el-table::before {
  height: 0;
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
</style>
