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
        :fixed="item1.labelOne == '订单'"
        :width="item1.labelOne == '订单' ? 80 : ''"
      >
        <el-table-column
          v-for="item2 in item1.labelTwo"
          :key="item2.prop"
          :prop="item2.prop"
          :fixed="item2.prop == 'weekDay'"
          align="center"
        >
          <template slot="header"
            >{{ item2.top }}<br />{{ item2.bottom }}</template
          >
          <template slot-scope="{ row }">
            <span>
              {{
                item2.formatter ? item2.formatter(row) : row[item2.prop] || 0
              }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
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
          labelOne: "订单",
          labelTwo: [
            {
              top: "星期",
              bottom: "",
              prop: "weekDay",
            },
            {
              top: "RC顾客订单",
              bottom: "",
              prop: "orderRcCustomerAmt",
              formatter: (row) => {
                return "¥" + (row.orderRcCustomerAmt || 0);
              },
            },
            {
              top: "顾问BC订单",
              bottom: "",
              prop: "orderBcAmt",
              formatter: (row) => {
                return "¥" + (row.orderBcAmt || 0);
              },
            },
            {
              top: "顾问RC订单",
              bottom: "",
              prop: "orderBcRcAmt",
              formatter: (row) => {
                return "¥" + (row.orderBcRcAmt || 0);
              },
            },
          ],
        },
        {
          labelOne: "事业",
          labelTwo: [
            { top: "女主人", bottom: "", prop: "addHostessCount" },
            { top: "新增顾客", bottom: "", prop: "addCustomerCount" },
            { top: "分享", bottom: "", prop: "shareCount" },
            {
              top: "肌肤分析仪",
              bottom: "邀约",
              prop: "inviteSkinTestCount",
            },
            {
              top: "三养健康",
              bottom: "邀约",
              prop: "inviteCareHelthCount",
            },
          ],
        },
        {
          labelOne: "玫粉E站",
          labelTwo: [
            {
              top: "下载素材",
              bottom: "",
              prop: "downloadMaterialCount",
            },
            {
              top: "转发素材",
              bottom: "",
              prop: "fowardMaterialCount",
            },
            {
              top: "观看直播",
              bottom: "(分钟)",
              prop: "watchLiveShowDuration",
            },
            {
              top: "观看课程",
              bottom: "(分钟)",
              prop: "watchCourseDuration",
            },
            { top: "发帖(次)", bottom: "", prop: "postArticlesCount" },
            { top: "点赞(次)", bottom: "", prop: "likeCount" },
          ],
        },
        {
          labelOne: "Intouch商城",
          labelTwo: [
            {
              top: "幸福小店",
              bottom: "素材下载",
              prop: "downloadHappyShopTimes",
            },
            {
              top: "幸福小店",
              bottom: "素材转发",
              prop: "fowardHappyShopTimes",
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
  border-right: 1px solid #fff;
  border-bottom: 1px solid #fff;
  font-size: 24px;
}
/deep/.el-table--border th {
  border-right: 1px solid #fff;
  border-bottom: 1px solid #fff;
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
