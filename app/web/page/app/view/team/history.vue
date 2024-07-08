<!-- 美容顾问历史详情 -->
<template>
  <div
    class="unit-detail"
    :class="{ isAndroid: !isIos, isFullScreen: isFullScreen }"
  >
    <NavBar
      v-if="!isFullScreen"
      left-text="返回"
      fixed
      title="美容顾问历史详情"
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
          v-if="levelCode >= 90 && accountType != 'operation'"
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
import {
  isIos,
  closeWebview,
  xxxxxx,
  formatMoney,
  formatDate,
} from "../../utils/index";
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
      accountType: "",
      targetContactId: "",
      filterParams: {},
      tableName: "teamHistory",
      isIos: isIos(),
      tableData: {
        header: [
          {
            label: "月份",
            prop: "monthKey",
            formatter: (row) => {
              row.monthKey = row.monthKey.toString();
              return row.monthKey
                ? `${row.monthKey.substr(0, 4)}-${row.monthKey.substr(4, 6)}`
                : "-";
            },
          },
          {
            label: "绩效目标",
            prop: "estimateProductionAmt",
            formatter: (row) => {
              return formatMoney(row.estimateProductionAmt);
            },
          },
          {
            label: "销售绩效",
            prop: "productionAmt",
            formatter: (row) => {
              return formatMoney(row.productionAmt);
            },
          },
          {
            label: "达成比例",
            prop: "productionAmtRate",
            formatter: (row) => {
              return `${row.productionAmtRate}%`;
            },
          },
        ],
        data: [],
      },
      pageName: "HomePage",
      landscapeEventName: "TeamHistoryLandscapeClick",
      export2ExcelEventName: "TeamHistoryExcelExportClick",
    };
  },
  created() {
    this.loadData();
    this.targetContactId = this.$route.query.targetContactId;
    this.levelCode = this.$route.query.levelCode;
    this.accountType = this.$route.query.accountType;
    console.log(" this.targetContactId", this.targetContactId);
  },
  methods: {
    back() {
      closeWebview();
    },
    async loadData() {
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(
        `${baseApi}/reports/team/history`
      );
      console.log(data);

      this.tableData.data = data.sort((a, b) => b.monthKey - a.monthKey);
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
