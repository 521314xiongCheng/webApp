<!-- 筛选控制面板 支持单选多选 -->
<!--
  bug:嵌套在navbar中 点击页面闪烁
  NavBar 的按钮有一个「点击透明」的反馈效果，组件DropdownMenu 放在 Right 按钮内部的时候，也受到了这个样式影响：
  .van-nav-bar__right:active {
    opacity: .7;
  }
-->
<template>
  <van-dropdown-menu>
    <van-dropdown-item
      @opened="opened"
      @close="close"
      ref="dropdownMenu"
      v-Clickoutside="clickOverlay"
    >
      <template #title>
        <div class="title">
          <span>
            {{ filterText }}
          </span>
          <span class="num">({{ total }})</span>
        </div>
      </template>
      <div class="filter-content">
        <div class="filter-type">
          <div v-for="filter in filterConfig" :key="filter.prop">
            <div
              class="filter-type-cell"
              v-show="filter.options && filter.options.length"
            >
              <div class="filter-type-title">{{ filter.label }}</div>
              <div>
                <div class="filter-type-subtitle" v-if="filter.showSubTitle">
                  {{ filter.subTitle }}：
                </div>
                <div class="filter-type-content">
                  <span
                    v-for="item in filter.options"
                    :key="item.value"
                    @click="selectItem(item, filter)"
                    :class="{ is_active: item.selected }"
                  >
                    {{ item.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="filter-button">
          <span class="filter-button-reset" @click="filterReset">重置</span>
          <span class="filter-button-confirm" @click="filterConfirm">确认</span>
        </div>
      </div>
    </van-dropdown-item>
  </van-dropdown-menu>
</template>
<script>
import Clickoutside from "element-ui/src/utils/clickoutside";
import { DropdownMenu, DropdownItem } from "vant";
import { deepCopy, oneOf } from "../../../../utils/index";
export default {
  name: "filterActionSheet",
  data() {
    return {
      filterResult: {}, //筛选结果
      filterCopy: {}, // 筛选项结果 用于重置但未确认时，点击遮罩层隐藏筛选面板时，还原原筛选条件
      isOpen: false,
      filterText: "筛选",
      copyCities: [],
    };
  },
  props: {
    filterConfig: {
      type: Array,
      default() {
        return [];
      },
    },
    filter: {
      type: Object,
      default() {
        return {
          accountType: "",
        };
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    pageName: {
      type: String,
      default: "UnitDetailsPage",
    },
    filterClickEventName: {
      type: String,
      default: "UnitDetailsFilterClick",
    },
    tagEventName: {
      type: String,
      default: "UnitDetailsFilterTagClick",
    },
    resetEventName: {
      type: String,
      default: "UnitDetailsFilterResetClick",
    },
    confirmEventName: {
      type: String,
      default: "UnitDetailsFilterConfirmClick",
    },
  },
  mounted() {
    const { accountType } = this.$route.query;
    this.accountType = accountType;
  },
  methods: {
    setFilterText(text = "筛选") {
      this.filterText = text;
    },
    opened() {
      this.$track({
        context: this.pageName,
        behavior: this.filterClickEventName,
        item_type: this.pageName,
        item_id: this.filterClickEventName,
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      this.$emit("filterActionIsOpen", true);
      this.isOpen = true;
      let Overlay = document.querySelector(".van-overlay");
      Overlay.addEventListener("click", () => {
        this.clickOverlay();
      });
    },
    close() {
      this.$emit("filterActionIsOpen", false);
    },
    // 需在父级页面合适的时机主动调用来初始化数据
    initFilterConfig() {
      this.filterConfig.forEach((fc) => {
        const { prop, multiple = true, options } = fc;
        if (multiple) {
          this.filterResult[prop] = this.filter[prop] ? this.filter[prop] : [];
        } else {
          this.filterResult[prop] = this.filter[prop]
            ? this.filter[prop]
            : null;
        }
        options.forEach((op) => {
          if (multiple) {
            if (this.filter[prop] && oneOf(op.value, this.filter[prop])) {
              this.$set(op, "selected", true);
            } else {
              this.$set(op, "selected", false);
            }
          } else {
            if (op.value === this.filter[prop]) {
              this.$set(op, "selected", true);
            } else {
              this.$set(op, "selected", false);
            }
          }
        });
      });
      // this.filterCopy = deepCopy(this.filterResult);
    },
    initFilterResult(cities) {
      cities.forEach((c) => {
        this.filterResult["cities"].forEach((item, index) => {
          if (item === c) {
            this.filterResult["cities"].splice(index, 1);
          }
        });
      });
      // this.filterCopy = deepCopy(this.filterResult);
    },
    selectItem(item, filter) {
      const { prop, multiple = true } = filter;
      this.$track({
        context: this.pageName,
        behavior: this.tagEventName,
        item_type: this.pageName,
        item_id: this.tagEventName,
        attributes: {
          [prop]: item.value,
          isEmployee: this.accountType === "operation",
        },
      });
      if (multiple) {
        if (prop === "provinces") {
          this.$emit("setProvinceCitys", item, "del");
        }
        if (this.filterResult[prop].includes(item.value)) {
          this.filterResult[prop].splice(
            this.filterResult[prop].findIndex((f) => f === item.value),
            1
          );
          this.$set(item, "selected", false);
        } else {
          if (prop === "provinces") {
            this.$emit("setProvinceCitys", item, "add");
          }
          this.filterResult[prop].push(item.value);
          this.$set(item, "selected", true);
        }
      } else {
        if (this.filterResult[prop] === item.value) {
          if (prop === "provinces") {
            this.$emit("setProvinceCitys", item, "del");
          }
          this.filterResult[prop] = null;
          this.$set(item, "selected", false);
        } else {
          if (prop === "provinces") {
            this.$emit("setProvinceCitys", item, "add");
          }
          this.filterResult[prop] = item.value;
          this.filterConfig.forEach((fc) => {
            if (fc.prop === prop) {
              fc.options.forEach((op) => {
                this.$set(op, "selected", false);
              });
            }
          });
          this.$set(item, "selected", true);
        }
      }
    },
    clickOverlay() {
      if (!this.isOpen) return;
      // this.$emit('')
      // 点击遮罩层隐藏筛选面板 还原上次的筛选项
      this.filterConfig.forEach((fc) => {
        const { prop, multiple = true, options } = fc;
        if (prop === "cities") {
          // 隐藏筛选面板时 还原上次的 市 数据
          fc.options = deepCopy(this.copyCities);
          // 设置数据源数据为之前保存数据
          this.$emit("setCitys", this.copyCities);
        }
        options.forEach((op) => {
          this.$set(op, "selected", false);
          if (multiple) {
            if (
              this.filterCopy[prop].findIndex((item) => item === op.value) > -1
            ) {
              this.$set(op, "selected", true);
            }
          } else {
            if (this.filterCopy[prop] === op.value) {
              this.$set(op, "selected", true);
            }
          }
        });
      });
      this.filterResult = deepCopy(this.filterCopy);
    },
    filterReset() {
      // 重置筛选项 不触发筛选 不隐藏筛选面板
      this.$track({
        context: this.pageName,
        behavior: this.resetEventName,
        item_type: this.pageName,
        item_id: this.resetEventName,
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      //selectItem 时，数据源 citys 数据是省下面的市进行concat，所以重置时将数据源 citys 设置为空组数
      // 避免重置之后再选择时，添加原来的数据
      this.$emit("setCitys", []);

      this.filterConfig.forEach((fc) => {
        const { prop, multiple = true, options } = fc;
        // 重置时清空 市 数据
        if (prop === "cities") {
          fc.options = [];
        }
        if (multiple) {
          this.filterResult[prop] = [];
        } else {
          this.filterResult[prop] = null;
        }
        options.forEach((op) => {
          this.$set(op, "selected", false);
        });
      });
    },
    filterConfirm() {
      // 存储筛选项
      this.$track({
        context: this.pageName,
        behavior: this.confirmEventName,
        item_type: this.pageName,
        item_id: this.confirmEventName,
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      // 确认时报存 市 数据，用于重置后但未确认时，还原 市 数据
      this.filterConfig.forEach((fc) => {
        const { prop, options } = fc;
        if (prop === "cities") {
          this.copyCities = deepCopy(options);
        }
      });
      let flag = false;
      Object.keys(this.filterResult).forEach((fr) => {
        if (Array.isArray(this.filterResult[fr])) {
          if (this.filterResult[fr].length) {
            flag = true;
          }
        } else if (this.filterResult[fr] !== null) {
          flag = true;
        }
      });
      if (flag) {
        this.filterText = "已筛选";
      } else {
        this.filterText = "筛选";
      }
      this.filterCopy = deepCopy(this.filterResult);
      this.$refs.dropdownMenu.toggle();
      this.$emit("filterConfirm", this.filterResult, flag);
    },
  },
  components: {
    "van-dropdown-menu": DropdownMenu,
    "van-dropdown-item": DropdownItem,
  },
  directives: { Clickoutside },
};
</script>
<style lang="less" scoped>
.filter-content {
  color: #8e8e8e;
  font-size: 28px;
  position: relative;
  height: 80vh;
  // padding-bottom: 94px;
  .filter-type {
    padding-top: 36px;
    padding-left: 36px;
    padding-bottom: 94px;
    overflow-y: scroll;
    max-height: 80vh;
    // height: 80vh;
  }
  .filter-type-title {
    color: #303133;
    width: 120px;
    margin-bottom: 30px;
    padding-top: 10px;
  }
  .filter-type-subtitle {
    color: #8e8e8e;
    font-size: 24px;
    // margin-bottom: 20px;
    line-height: 50px;
  }
  .filter-type-cell {
    margin-bottom: 10px;
    display: flex;
    .filter-type-content {
      max-width: 550px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      span {
        font-size: 22px;
        padding: 0 16px;
        height: 48px;
        line-height: 46px;
        text-align: center;
        background-color: #f9f9f9;
        // margin: 0 20px 30px 0;
        margin-bottom: 30px;
        margin-right: 20px;
        border: 1px solid #e8e8e8;
        border-radius: 12px;
        font-weight: normal;
      }
      span:first-child {
        margin-left: 0;
      }
      .is_active {
        background-color: #fff7fb;
        color: #ed8dc3;
        border-color: #ed8dc3;
      }
    }
  }
  .filter-button {
    display: flex;
    justify-content: center;
    height: 94px;
    line-height: 94px;
    text-align: center;
    color: #606266;
    position: absolute;
    width: 100%;
    bottom: 0;
    background-color: #fff;
    &-reset {
      flex: 0.5;
      border-top: 2px solid #f9f9f9;
      border-right: 2px solid #f9f9f9;
    }
    &-confirm {
      flex: 0.5;
      color: #ed8dc3;
      border-top: 2px solid #f9f9f9;
    }
  }
}
/deep/.van-dropdown-menu__bar {
  height: auto;
  box-shadow: none;
  .van-dropdown-menu__title {
    padding: 0;
    font-size: 28px;
    font-weight: bold;
    color: #f16eae;
    &::after {
      content: none;
    }
    .title {
      display: flex;
      align-items: center;
    }
    .num {
      font-size: 22px;
      color: #000;
      font-weight: normal;
      margin-left: 6px;
    }
  }
}
/deep/.van-nav-bar__right {
  &:active {
    opacity: 1 !important;
  }
}
/deep/.van-dropdown-item__content {
  max-height: 80vh;
}
</style>
