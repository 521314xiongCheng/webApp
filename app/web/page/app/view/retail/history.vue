<!-- 沙龙详情 -->
<template>
  <div
    class="unit-detail"
    :class="{ isAndroid: !isIos, isFullScreen: isFullScreen }"
  >
    <NavBar
      v-if="!isFullScreen"
      left-text="返回"
      fixed
      title="零售历史详情"
      :border="false"
      :safe-area-inset-top="true"
      @click-left="back"
    >
      <template #left>
        <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
      </template>
      <template #right>
        <van-popover
          v-model="showPopover"
          trigger="click"
          placement="bottom-end"
          :actions="popoverActions"
          @select="popoverSelect"
          v-if="levelCode >= 90"
        >
          <template #reference>
            <img class="icon-more" src="../../images/dot.png" alt="" />
          </template>
        </van-popover>
        <template v-else>
          <span @click="gofullscreen()">
            <img class="icon-screen" src="../../images/screen.png" alt="" />
          </span>
        </template>
      </template>
    </NavBar>
    <div class="unit-content">
      <common-table
        id="table-content"
        ref="gemPointTable"
        :border="false"
        :tableData="tableData"
        :isFullScreen="isFullScreen"
      >
      </common-table>
    </div>
    <img
      v-if="isFullScreen"
      @click="resetToPortraitScreen"
      src="../../images/portraitscreen.png"
      class="resetToPortraitScreen"
      alt=""
    />
  </div>
</template>
<script>
import { NavBar, Button, Icon } from "vant";
import { isIos, closeWebview, xxxxxx, formatMoney } from "../../utils/index";
import commonTable from "../../components/commonTable.vue";
import horizontalScreen from "../../mixin/horizontalScreen";
export default {
  components: {
    commonTable,
    NavBar,
    "van-button": Button,
    "van-icon": Icon,
  },
  mixins: [horizontalScreen],
  data() {
    return {
      tableName: "retail",
      isIos: isIos(),
      tableData: {
        header: [
          {
            label: "月份",
            prop: "monthKey",
            fixed: "left",
            formatter: (row) => {
              row.monthKey = row.monthKey.toString();
              return row.monthKey
                ? `${row.monthKey.substr(0, 4)}-${row.monthKey.substr(4, 6)}`
                : "-";
            },
          },
          {
            label: "零售绩效",
            prop: "productionAmt",
            formatter: (row) => {
              return formatMoney(row.productionAmt);
            },
          },
          {
            label: "零售金额",
            prop: "retailAmt",
            formatter: (row) => {
              return `¥${formatMoney(row.retailAmt)}`;
            },
          },
          {
            label: "点数+返利",
            prop: "rcProductionAmt",
            width: 100,
            formatter: (row) => {
              return `${formatMoney(row.rcProductionAmt)}`;
            },
          },
          {
            label: "顾客RC订单",
            prop: "rcOrderRetail",
            width: 100,
            formatter: (row) => {
              return `¥${formatMoney(row.rcOrderRetail)}`;
            },
          },
          {
            label: "顾问RC订单",
            prop: "rcBcOrderRetail",
            width: 100,
            formatter: (row) => {
              return `¥${formatMoney(row.rcBcOrderRetail)}`;
            },
          },
          {
            label: "顾问BC订单",
            prop: "bcOrderRetail",
            width: 100,
            formatter: (row) => {
              return `¥${formatMoney(row.bcOrderRetail)}`;
            },
          },
        ],
        data: [],
      },
      targetContactId: "",
      filterParams: {},
      levelCode: "",
      pageName: "HomePage",
      landscapeEventName: "RetailHistoryLandscapeClick",
      export2ExcelEventName: "RetailHistoryExcelExportClick",
    };
  },
  mounted() {
    const { targetContactId, levelCode, from, accountType } = this.$route.query;
    this.targetContactId = targetContactId;
    this.levelCode = levelCode;
    if (accountType === "operation") {
      this.pageName = "StaffPersonalProfilePage";
      this.landscapeEventName = "ProfileRetailHistoryLandscapeClick";
      this.export2ExcelEventName = "ProfileRetailHistoryExcelExportClick";
    } else {
      if (from === "profile") {
        this.pageName = "PersonalProfilePage";
        this.landscapeEventName = "PersonalRetailHistoryLandscapeClick";
        this.export2ExcelEventName = "PersonalRetailHistoryExcelExportClick";
      } else {
        this.pageName = "HomePage";
        this.landscapeEventName = "RetailHistoryLandscapeClick";
        this.export2ExcelEventName = "RetailHistoryExcelExportClick";
      }
    }
    this.loadData();
    console.log("targetContactId", targetContactId);
  },
  methods: {
    back() {
      closeWebview();
    },
    async loadData() {
      console.log();
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/reports/retail/details`
      );
      console.log(data);
      this.tableData.data = data.retails;
    },
  },
};
</script>
<style lang="less" scoped>
.unit-detail {
  .unit-content {
    padding-top: env(safe-area-inset-top);
    margin-top: 80px;
    .avatar {
      width: 80px;
      border-radius: 50%;
    }
    &-filter {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 28px;
      font-weight: bold;
      color: #f16eae;
      line-height: 28px;
      padding: 37px 20px;
      .icon {
        width: 22px;
        margin-right: 8px;
      }
      .num {
        font-size: 22px;
        color: #000;
      }
    }
    .assess-performance {
      position: relative;
      &-btn {
        padding: 0 30px;
        height: 42px;
        background-color: #fff7fd;
        color: #f16eae;
        font-size: 24px;
        border-color: #ffa7d2;
        border-radius: 9px;
      }
      &-tip {
        position: absolute;
        width: 24px;
        right: 0;
        top: 0;
      }
    }
  }
}
.isAndroid {
  .unit-content {
    margin-top: 135px;
  }
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
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
.isFullScreen {
  .unit-content {
    margin-top: 0;
  }
}
</style>
