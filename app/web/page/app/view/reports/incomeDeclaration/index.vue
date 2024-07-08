<template>
  <div class="unit-detail" :class="{ isAndroid: !isIos }">
    <div>
      <van-sticky>
        <NavBar
          left-text="返回"
          :border="false"
          :safe-area-inset-top="true"
          @click-left="back"
        >
          <template #left>
            <img
              class="back_btn"
              src="../../../images/index/icon_back.png"
              alt=""
            />
          </template>
          <template #title>
            税务申报信息（部分）
            <img
              class="icon_q"
              @click="
                showDialog = !showDialog;
                showButton = false;
              "
              src="../../../images/icon_q.png"
              alt=""
            />
          </template>
        </NavBar>
      </van-sticky>
    </div>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      :head-height="100"
    >
      <template #pulling>
        <div class="refresh-icon">
          <img src="../../../images/refresh-icon.gif" alt="" />
        </div>
        <p class="refresh-text">下拉刷新</p>
      </template>
      <template #loosing>
        <div class="refresh-icon">
          <img src="../../../images/refresh-icon.gif" alt="" />
        </div>
        <p class="refresh-text">松开刷新</p>
      </template>
      <template #loading>
        <div class="refresh-icon">
          <img src="../../../images/refresh-icon.gif" alt="" />
        </div>
        <p class="refresh-text">刷新中</p>
      </template>
      <List
        :finished="finished"
        v-model="loading"
        :finished-text="
          tableData.data && tableData.data.length ? '没有更多了' : ''
        "
        @load="loadData"
        v-if="showTable"
      >
        <common-table
          id="table-content"
          ref="gemPointTable"
          :border="false"
          :tableData="tableData"
          @sortChange="sortChange"
        >
        </common-table>
      </List>
      <div v-show="!showTable" class="nodata">
        <img src="../../../images/nodata1.png" alt="" />
        <div>暂时没有数据</div>
      </div>
    </van-pull-refresh>
    <van-popup
      v-model="showDialog"
      position="center"
      round
      :closeable="!showButton"
    >
      <div class="dialog-wrap">
        <div class="dialog-content">
          <div class="dialog-title">
            <img
              src="../../../images/reports/incomeDeclaration/hg.png"
              alt=""
            />
            规则说明
          </div>
          <div class="dialog-box">
            <div class="content-scroll" :class="{ 'no-button': !showButton }">
              <div class="content-item">
                <div class="sub-title">一、沟通对象&内容</div>
                <p>对象：有执照的销售队伍（不含收稻平台）</p>
                <p>
                  内容：为了帮助销售队伍轻松、合规地开展玫琳凯业务，公司贴心为您准备“业务收入报表”供您用于税务申报时参考。
                </p>
              </div>
              <div class="content-item">
                <div class="sub-title">
                  二、玫琳凯业务取得的收入包含以下三项：
                </div>
                <p>1.服务费</p>
                <p>2.RC商城销售收入</p>
                <p>3.玫琳凯之窗销售收入</p>
                <div class="sub-sub-title">
                  举例：2022年4月，督导小玫的玫琳凯业务活动如下：
                </div>
                <p>Ÿ 从公司取得服务费5000元</p>
                <p>Ÿ 幸福小店（RC商城）订单销售额（零售价）3000元</p>
                <p>
                  Ÿ
                  玫琳凯之窗订单销售额（零售价）1000元，其中100元用于顾客试用（非销售用途）
                </p>
                <p>
                  Ÿ
                  因此，小玫4月应申报的玫琳凯业务收入是8900元（5000+3000+1000-100）。
                </p>
              </div>
              <div class="content-item">
                <div class="sub-title">注意事项</div>
                <p>
                  Ÿ 按照税法规定，您需要同时就以上三项收入按月或按季进行税务申报
                </p>
                <p>
                  Ÿ
                  如您还有玫琳凯之窗订单零售销售，请结合实际情况后向主管税务局进行税务申报
                </p>
                <p>
                  Ÿ
                  T月业务收入可以在“T+1”月查看；T月订单调整的零售额，会在“T+1”月中调整
                </p>
              </div>
            </div>
          </div>
          <img
            class="icon-xin"
            src="../../../images/reports/incomeDeclaration/xin.png"
            alt=""
          />
        </div>
        <div class="dialog-button" v-show="showButton">
          <van-button class="button-cancel" @click="handleClick(false)"
            >拒绝</van-button
          >
          <van-button @click="handleClick(true)">接受</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import {
  NavBar,
  List,
  Button,
  Icon,
  Dialog,
  Sticky,
  PullRefresh,
  Popup,
} from "vant";
import {
  isIos,
  closeWebview,
  formatMoneyKeepDecimals,
  deepCopy,
} from "../../../utils/index";
import commonTable from "../../../components/commonTable.vue";
import storage from "good-storage";
export default {
  name: "component_name",
  data() {
    return {
      showTable: true,
      isIos: isIos(),
      loading: false,
      finished: false,
      refreshing: false,
      showDialog: false,
      showButton: true,
      tableData: {
        header: [
          {
            label: "收入\n月份",
            minWidth: 60,
            prop: "monthKey",
            formatter: (row) => {
              if (!row.monthKey) return "/";
              let year = row.monthKey.toString().substr(0, 4),
                month = row.monthKey.toString().substr(4, 6);
              return `${year}/${month}`;
            },
          },
          {
            label: "服务费",
            minWidth: 60,
            prop: "serviceFee",
            formatter: (row) => {
              return formatMoneyKeepDecimals(row.serviceFee, 2);
            },
          },
          {
            label: "RC商城\n零售额",
            minWidth: 60,
            prop: "rcSalesIncome",
            formatter: (row) => {
              return formatMoneyKeepDecimals(row.rcSalesIncome, 2);
            },
          },
          {
            label: "零售金额\n调整",
            minWidth: 60,
            prop: "retailAmountAdjustment",
            formatter: (row) => {
              return formatMoneyKeepDecimals(row.retailAmountAdjustment, 2);
            },
          },
          {
            label: "总额",
            minWidth: 60,
            prop: "totalIncome",
            formatter: (row) => {
              return formatMoneyKeepDecimals(row.totalIncome, 2);
            },
          },
        ],
        data: [{}],
      },
    };
  },
  components: {
    commonTable,
    List,
    NavBar,
    "van-button": Button,
    "van-icon": Icon,
    "van-sticky": Sticky,
    "van-pull-refresh": PullRefresh,
    "van-popup": Popup,
  },
  created() {},
  mounted() {
    let hiddenDialog = storage.get("hiddenDialog");
    this.showButton = true;
    if (hiddenDialog) {
      this.showDialog = false;
    } else {
      this.showDialog = true;
    }
  },
  methods: {
    back() {
      closeWebview();
    },
    onRefresh() {
      this.loadData();
    },
    handleClick(type) {
      if (!type) {
        closeWebview();
      } else {
        this.showDialog = false;
        storage.set("hiddenDialog", true);
      }
    },
    async loadData() {
      this.loading = true;
      let baseApi = this.$ctx.baseApiList.income;
      const { data } = await this.$request.get(`${baseApi}/declarations`);
      console.log(data);
      this.loading = false;
      this.refreshing = false;
      this.finished = true;
      this.tableData.data = data;
    },
    sortChange() {},
  },
};
</script>
<style lang="less" scoped>
.dialog-wrap {
  width: 670px;
  height: 80vh;
  padding: 0 40px;
  position: relative;
  font-size: 24px;
  line-height: 32px;
  color: #595959;
  .dialog-content {
    // height: calc(80vh - 152px);
    border-radius: 36px;
    padding: 55px;
    position: relative;
    background: linear-gradient(180deg, #ffdeef 0%, #fff 100%);
    .dialog-title {
      position: relative;
      font-size: 36px;
      color: #541b5a;
      text-align: center;
      line-height: 1;
      img {
        position: absolute;
        left: 150px;
        top: -22px;
        width: 32px;
        height: 30px;
      }
    }
    .dialog-box {
      overflow: hidden;
    }
    .content-scroll {
      height: calc(80vh -336px);
      overflow-y: scroll;
      .content-item {
        margin-top: 36px;
        .sub-title {
          font-size: 32px;
          color: #541b5a;
          margin-bottom: 16px;
          line-height: 40px;
        }
        .sub-sub-title {
          font-size: 26px;
          color: #595959;
          margin: 20px 0 10px 0;
          font-weight: bold;
        }
      }
    }
    .no-button {
      height: calc(80vh -195px);
    }
    .icon-xin {
      position: absolute;
      bottom: -40px;
      right: -40px;
      width: 129px;
      height: 99px;
    }
  }
  .dialog-button {
    position: absolute;
    bottom: 0;
    text-align: center;
    display: flex;
    justify-content: space-between;
    width: 590px;
    .van-button {
      border-radius: 48px;
      background-color: #f7dae1;
      color: #541b5a;
      font-size: 32px;
      width: 267px;
      height: 93px;
    }
    .button-cancel {
      background-color: transparent;
      border: 5px solid #fff;
      color: #fff;
    }
  }
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.isAndroid {
  // .unit-content {
  //   margin-top: 135px;
  // }
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
.van-pull-refresh {
  min-height: 80vh;
}
/deep/.van-nav-bar__placeholder {
  // height: 75px!important;
  background-color: #ee4d9b;
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
    .van-nav-bar__title {
      display: flex;
      align-items: center;
      .icon_q {
        width: 30px;
        height: 30px;
        margin-left: 10px;
      }
    }
    .van-nav-bar__right {
      .icon-search {
        width: 46px;
        margin-right: 25px;
      }
      .icon-more {
        width: 42px;
      }
      .icon-screen {
        width: 42px;
        vertical-align: top;
      }
    }
  }
  .van-nav-bar__title {
    color: #fff;
    font-size: 30px;
  }
}
/deep/.van-popup {
  background-color: transparent;
  .van-popup__close-icon {
    top: 20px;
    right: 60px;
    color: #f8b4c4;
  }
}
</style>
