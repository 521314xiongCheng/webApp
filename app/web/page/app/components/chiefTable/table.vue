<template>
  <div class="common-table">
    <el-table
      ref="commonTable"
      :data="tableData"
      :stripe="true"
      :element-loading-text="loadingText"
      :border="border"
    >
      <el-table-column
        v-for="item1 in tableHeader"
        :key="item1.labelOne"
        :label="item1.labelOne"
        align="center"
        :fixed="item1.labelOne == '基本信息'"
        :width="item1.labelOne == '基本信息' ? 100 : ''"
      >
        <el-table-column
          v-for="item2 in item1.labelTwo"
          :key="item2.prop"
          :prop="item2.prop"
          :fixed="item2.prop == 'name'"
          align="center"
          :width="
            item2.prop == 'name' ||
            item2.prop == 'sdirName' ||
            item2.prop == 'esdName'
              ? 100
              : item2.prop == 'unitAvgBcRcRetailAmt' ||
                item2.prop == 'unitAvgBcRcIncomeAmt'
              ? 120
              : 80
          "
        >
          <template slot="header"
            >{{ item2.top }}<br />{{ item2.bottom }}</template
          >
          <template slot-scope="{ row }">
            <div class="user" v-if="item2.prop == 'name'">
              <div class="user-info">
                <div class="user_name">
                  <span class="climp">{{ row.name }}</span>
                  <img
                    class="icon"
                    @click="callMobile(row.mobile)"
                    src="../../images/icon_phone.png"
                  />
                </div>
              </div>
              <div class="no-self">
                <span class="level">{{ row.careerLevelCode }}</span>
                <span class="line"></span>
                <span class="status">{{ row.activityStatusCode }}</span>
              </div>
            </div>
            <div
              class="user"
              v-else-if="item2.prop == 'sdirName' && row.sdirName"
            >
              <div class="user-info">
                <div class="user_name">
                  <span class="climp">{{ row.sdirName }}</span>
                  <img
                    class="icon"
                    @click="callMobile(row.sdirMobile)"
                    src="../../images/icon_phone.png"
                  />
                </div>
              </div>
              <div class="no-self">
                <span class="level">{{ row.sdirCareerLevelCode }}</span>
                <span class="line"></span>
                <span class="status">{{ row.sdirActivityStatusCode }}</span>
              </div>
            </div>
            <div
              class="user"
              v-else-if="item2.prop == 'esdName' && row.esdName"
            >
              <div class="user-info">
                <div class="user_name">
                  <span class="climp">{{ row.esdName }}</span>
                  <img
                    class="icon"
                    @click="callMobile(row.esdMobile)"
                    src="../../images/icon_phone.png"
                  />
                </div>
              </div>
              <div class="no-self">
                <span class="level">{{ row.esdCareerLevelCode }}</span>
                <span class="line"></span>
                <span class="status">{{ row.esdActivityStatusCode }}</span>
              </div>
            </div>
            <span v-else>
              {{ item2.formatter ? item2.formatter(row) : row[item2.prop] }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <slot></slot>
      <!-- <template slot="empty">
        <img class="table-empty__bg" src="../images/nodata.png" alt="">
        <span>暂无数据</span>
      </template> -->
    </el-table>
  </div>
</template>

<script>
import { formatMoney, formatDate } from "../../utils/index";
export default {
  name: "table-list",
  props: {
    tableData: Array,
    tableHeader: {
      type: Array,
      default: () => [
        {
          labelOne: "基本信息",
          labelTwo: [
            {
              top: "顾问",
              bottom: "姓名",
              prop: "name",
            },
            {
              top: "管理",
              bottom: "区域",
              prop: "offspringLineNumber",
            },
            {
              top: "晋升",
              bottom: "时间",
              prop: "dirDebuteDate",
              formatter: (row) => {
                return row.dirDebuteDate
                  ? formatDate(row.dirDebuteDate, "YYYY-MM-DD")
                  : "--";
              },
            },
            {
              top: "停职",
              bottom: "时间",
              prop: "terminationDate",
              formatter: (row) => {
                return row.terminationDate
                  ? formatDate(row.terminationDate, "YYYY-MM-DD")
                  : "--";
              },
            },
            {
              top: "SDIR",
              bottom: "姓名",
              prop: "sdirName",
              formatter: (row) => {
                return row.sdirName || "--";
              },
            },
            {
              top: "ESD+",
              bottom: "姓名",
              prop: "esdName",
              formatter: (row) => {
                return row.esdName || "--";
              },
            },
            {
              top: "ESD+",
              bottom: "区域",
              prop: "esdOffspringLineNumber",
              formatter: (row) => {
                return row.esdOffspringLineNumber || "--";
              },
            },
          ],
        },
        {
          labelOne: "个人",
          labelTwo: [
            {
              top: "个人",
              bottom: "绩效",
              prop: "productionAmt",
              formatter: (row) => {
                return formatMoney(row.productionAmt);
              },
            },
            {
              top: "产品点数",
              bottom: "使用",
              prop: "rcProductionAmt",
              formatter: (row) => {
                return formatMoney(row.rcProductionAmt);
              },
            },
            {
              top: "RC顾客",
              bottom: "绩效",
              prop: "rcCustomerProductionAmt",
              formatter: (row) => {
                return formatMoney(row.rcCustomerProductionAmt);
              },
            },
            {
              top: "RC",
              bottom: "顾客人数",
              prop: "orderRcCustomerCount",
            },
            {
              top: "新RC",
              bottom: "顾客人数",
              prop: "newRcCustomerCount",
            },
            {
              top: "历史RC",
              bottom: "顾客总数",
              prop: "totalRcCustomerCount",
              formatter: (row) => {
                return formatMoney(row.totalRcCustomerCount);
              },
            },
            {
              top: "新顾问",
              bottom: "人数",
              prop: "teamNewRecruitCount",
            },
            {
              top: "新顾问",
              bottom: "A人数",
              prop: "teamActiveNewRecruitCount",
            },
            {
              top: "新顾问",
              bottom: "活动率",
              prop: "teamActiveNewRecruitOrderRate",
              formatter: (row) => {
                return `${row.teamActiveNewRecruitOrderRate}%`;
              },
            },
            {
              top: "新顾问",
              bottom: "小店开张数",
              prop: "teamNewRecruitShopOpenCount",
              formatter: (row) => {
                return formatMoney(row.teamNewRecruitShopOpenCount);
              },
            },
          ],
        },
        {
          labelOne: "美容顾问",
          labelTwo: [
            {
              top: "美容顾问",
              bottom: "绩效",
              prop: "teamProductionAmt",
              formatter: (row) => {
                return formatMoney(row.teamProductionAmt);
              },
            },
            {
              top: "顾问",
              bottom: "人数",
              prop: "teamNonTerminatedCount",
            },
            {
              top: "顾问",
              bottom: "A人数",
              prop: "teamActiveCount",
            },
            {
              top: "下单",
              bottom: "人数",
              prop: "teamOrderCount",
            },
            {
              top: "小店",
              bottom: "开张数",
              prop: "teamShopOpenCount",
              formatter: (row) => {
                return formatMoney(row.teamShopOpenCount);
              },
            },
          ],
        },
        {
          labelOne: "沙龙",
          labelTwo: [
            {
              top: "沙龙",
              bottom: "绩效",
              prop: "unitProductionAmt",
              formatter: (row) => {
                return formatMoney(row.unitProductionAmt);
              },
            },
            {
              top: "RC绩效",
              bottom: "占比",
              prop: "unitRcProductionAmtRate",
              formatter: (row) => {
                return `${row.unitRcProductionAmtRate || 0}%`;
              },
            },
            {
              top: "沙龙",
              bottom: "人数",
              prop: "unitNonTerminatedCount",
            },
            {
              top: "上月沙龙",
              bottom: "人数",
              prop: "unitLastMonthNonTerminatedCount",
            },
            {
              top: "沙龙",
              bottom: "A人数",
              prop: "unitActiveCount",
            },
            {
              top: "NBC",
              bottom: "人数",
              prop: "unitNewRecruitCount",
            },
            {
              top: "NBC",
              bottom: "人数A",
              prop: "unitActiveNewRecruitCount",
            },
            {
              top: "新进率",
              bottom: "",
              prop: "unitNewRecruitRate",
              formatter: (row) => {
                return `${row.unitNewRecruitRate}%`;
              },
            },
            {
              top: "NBC",
              bottom: "小店开张数",
              prop: "unitNewRecruitShopOpenCount",
              formatter: (row) => {
                return formatMoney(row.unitNewRecruitShopOpenCount);
              },
            },
            {
              top: "复职",
              bottom: "人数",
              prop: "unitReinstatementCount",
            },
            {
              top: "复职率",
              bottom: "",
              prop: "unitReinstatementRate",
              formatter: (row) => {
                return `${row.unitReinstatementRate}%`;
              },
            },
            {
              top: "停职",
              bottom: "人数",
              prop: "unitTerminatedCount",
            },
            {
              top: "停职率",
              bottom: "",
              prop: "unitTerminatedRate",
              formatter: (row) => {
                return `${row.unitTerminatedRate}%`;
              },
            },
            {
              top: "老顾问",
              bottom: "人数",
              prop: "unitOldRecruitCount",
            },
            {
              top: "老顾问",
              bottom: "活动率",
              prop: "unitOldRecruitRate",
              formatter: (row) => {
                return `${row.unitOldRecruitRate}%`;
              },
            },
            {
              top: "小店",
              bottom: "开张数",
              prop: "unitShopOpenCount",
              formatter: (row) => {
                return formatMoney(row.unitShopOpenCount);
              },
            },
            {
              top: "小店",
              bottom: "开张率",
              prop: "unitShopOpenRate",
              formatter: (row) => {
                return `${row.unitShopOpenRate || 0}%`;
              },
            },
            {
              top: "BC人均",
              bottom: "RC顾客订单金额",
              prop: "unitAvgBcRcRetailAmt",
              formatter: (row) => {
                return `¥${row.unitAvgBcRcRetailAmt || 0}`;
              },
            },
            {
              top: "BC人均",
              bottom: "RC顾客订单收益",
              prop: "unitAvgBcRcIncomeAmt",
              formatter: (row) => {
                return `¥${row.unitAvgBcRcIncomeAmt || 0}`;
              },
            },
            {
              top: "50级",
              bottom: "人数",
              prop: "diqCount",
            },
            {
              top: "40级",
              bottom: "人数",
              prop: "fdirCount",
            },
            {
              top: "35级",
              bottom: "人数",
              prop: "rjCount",
            },
            {
              top: "30级",
              bottom: "人数",
              prop: "starCount",
            },
            {
              top: "20级",
              bottom: "人数",
              prop: "sbCCount",
            },
            {
              top: "15级",
              bottom: "人数",
              prop: "bc15Count",
            },
            {
              top: "10级",
              bottom: "人数",
              prop: "bc10Count",
            },
          ],
        },
      ],
    },
    border: {
      type: Boolean,
      default: true,
    },
    isFullScreen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadingText: "拼命加载中",
    };
  },
  mounted() {},
  methods: {
    callMobile(mobile) {
      if (mobile) {
        window.location.href = `tel:${mobile}`;
      }
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.el-table {
  color: #333;
  thead {
    color: #333;
  }
}
/deep/.el-table thead.is-group th.el-table__cell {
  background-color: #fafafa;
  font-size: 24px;
}
/deep/.el-table--border th {
  border-right: 1px solid #fff;
  border-bottom: 1px solid #fff;
}
// 多级表头边框样式
/deep/.el-table th.el-table__cell.is-leaf.el-table_1_column_1_column_8,
/deep/.el-table th.el-table__cell.is-leaf.el-table_1_column_9_column_19,
/deep/.el-table th.el-table__cell.is-leaf.el-table_1_column_20_column_25 {
  border-right: 1px solid #fff;
}
/deep/.el-table thead.is-group th.el-table_1_column_1,
/deep/.el-table thead.is-group th.el-table_1_column_20,
/deep/.el-table thead.is-group [class^="el-table_1_column_1"],
/deep/.el-table thead.is-group [class^="el-table_1_column_20"],
/deep/.el-table__row--striped [class^="el-table_1_column_1"],
/deep/.el-table__row--striped [class^="el-table_1_column_20"] {
  background-color: #f1f1f1 !important;
}

.common-table {
  /deep/.cell-class_avatar {
    .cell {
      overflow: unset;
      .avatar-wrap {
        position: relative;
        width: 80px;
        height: 80px;
        margin: 0 auto;
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          vertical-align: middle;
        }
        .icon_crown {
          position: absolute;
          width: 40px;
          height: 39px;
          right: -15px;
          top: -15px;
          transform: rotate(4deg);
        }
      }
    }
  }
  /deep/.user {
    white-space: nowrap;
    &-info {
      // width: 180px;
      margin: 0 auto;
      .user_name {
        // max-width: 100px;
        // padding-right:10px;
        position: relative;
        display: inline-block;
        color: #333;
        white-space: normal;
        // font-weight: bold;
        .climp {
          max-width: 130px;
        }
        .icon {
          position: absolute;
          width: 20px;
          height: 20px;
          right: -24px;
          top: 7px;
        }
      }
    }
    .tags {
      // font-size: 0;
      // transform: scale(0.71);
      display: flex;
      justify-content: center;
      span {
        padding: 0 6px;
        line-height: 26px;
        display: inline-block;
        text-align: center;
        font-size: 20px;
      }
      .level {
        background-color: rgba(241, 110, 159, 0.15);
        color: #f16e9f;
      }
      .status {
        background-color: rgba(110, 116, 241, 0.15);
        color: #8288f5;
        margin-left: 3px;
      }
      .self {
        background-color: rgba(255, 107, 40, 0.15);
        color: #ff783c;
        margin-left: 3px;
      }
    }
    .no-self {
      display: flex;
      justify-content: center;
      // margin-top: 10px;
      span {
        line-height: 20px;
        display: inline-block;
        text-align: center;
        font-size: 20px;
      }
      .level {
        color: #898989;
      }
      .status {
        color: #898989;
      }
      .line {
        width: 1px;
        height: 18px;
        background: #b1b6c0;
        margin: 0 7px 0 10px;
      }
    }
  }
  /deep/.el-table .descending .sort-caret.descending {
    border-top-color: #f16eae;
  }
  /deep/.el-table .ascending .sort-caret.ascending {
    border-bottom-color: #f16eae;
  }
  /deep/.el-table .cell {
    padding: 0;
  }
  /deep/.cell-class_estimateProductionAmt {
    // min-width: 170px;
    .cell {
      // padding-right: 14px;
      // min-width: 170px;
      padding: 12px 0;
    }
  }
  /deep/.el-table th.el-table__cell > .cell {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: pre-wrap;
  }
  /deep/.el-table--border,
  .el-table--group {
    border: none;
  }
  /deep/ .el-table th.is-hidden > *,
  /deep/ .el-table td.is-hidden > * {
    visibility: visible;
  }
}
</style>
