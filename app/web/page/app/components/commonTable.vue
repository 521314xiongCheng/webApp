<template>
  <div class="common-table">
    <el-table
      ref="commonTable"
      :data="tableData.data"
      :stripe="true"
      :element-loading-text="loadingText"
      :show-header="tableData.showHeader"
      :height="tableData.height"
      @sort-change="sortChange"
      @header-click="headerClick"
      @row-click="rowClickchange"
      header-cell-class-name="common-table-header"
      :cell-class-name="setClassName"
      :border="border"
      @cell-click="cellClick"
    >
      <slot name="between"></slot>
      <el-table-column
        v-for="item in tableData.header"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :fixed="item.fixed"
        :min-width="item.minWidth"
        :max-width="item.maxWidth"
        :sortable="item.sortable"
        :sort-orders="['descending', 'ascending', null]"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{
            item.formatter
              ? item.formatter(scope.row, scope.$index)
              : scope.row[item.prop]
          }}</span>
        </template>
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
export default {
  name: "table-list",
  props: {
    tableData: Object,
    border: {
      type: Boolean,
      default: true,
    },
    isFullScreen: {
      type: Boolean,
      default: false,
    },
    setClassName: Function,
  },
  data() {
    return {
      loadingText: "拼命加载中",
    };
  },
  mounted() {},
  methods: {
    sortChange(data) {
      this.$emit("sortChange", data);
    },
    headerClick(column, event) {
      this.$emit("headerClick", column, event);
    },
    rowClickchange(column) {
      this.$emit("rowClickchange", column);
    },
    cellClick(row, column, event, cell) {
      this.$emit("cellClick", { row, column, event, cell });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.el-table {
  color: #333;
  thead {
    color: #333;
    tr {
      th {
        background-color: #fafafa;
      }
    }
  }
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
      // width: 80px;
      .user_name {
        // padding-right:10px;
        position: relative;
        display: inline-block;
        color: #333;
        white-space: normal;
        font-weight: bold;
        .icon {
          position: absolute;
          width: 20px;
          height: 20px;
          right: -24px;
          top: 10px;
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
        background-color: #fff;
      }
      .status {
        color: #898989;
        background-color: #fff;
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
}
</style>
