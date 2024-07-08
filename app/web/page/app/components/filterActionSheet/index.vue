<!-- 筛选控制面板 支持单选多选 -->
<template>
  <van-action-sheet 
    v-model="filterSheet" 
    :closeable="false" 
    @click-overlay="clickOverlay"
    :close-on-click-overlay="false"
    :round="false">
    <div class="filter-content">
      <div class="filter-type">
        <div v-for="filter in filterConfig" :key="filter.prop">
          <div class="filter-type-cell">
            <div class="filter-type-title" v-show="filter.options && filter.options.length">{{filter.label}}</div>
            <span
              v-for="item in filter.options"
              :key="item.value"
              @click="selectItem(item,filter)"
              :class="{'is_active':item.selected}">
              {{item.name}}
            </span>
          </div>
        </div>
      </div>
      <div class="filter-button">
        <span class="filter-button-reset" @click="filterReset">重置</span>
        <span class="filter-button-confirm" @click="filterConfirm">确认</span>
      </div>
    </div>
  </van-action-sheet>
</template>
<script>
import { ActionSheet } from 'vant';
import {
  deepCopy
} from "../../utils/index";
export default {
  name: "filterActionSheet",
  data() {
    return {
      filterResult: {},//筛选结果
      filterCopy: {},// 筛选项结果 用于重置但未确认时，点击遮罩层隐藏筛选面板时，还原原筛选条件
    };
  },
  props: {
    filterSheet: {
      type: Boolean,
      default: false
    },
    filterConfig: {
      type: Array,
      default(){
        return []
      }
    }
  },
  methods: {
    // 需在父级页面合适的时机主动调用来初始化数据
    initFilterConfig() {
      this.filterReset()
      this.filterCopy = deepCopy(this.filterResult)
    },
    selectItem(item,filter) {
      const { prop, multiple = true } = filter
      if (multiple) {
        if (this.filterResult[prop].includes(item.value)) {
          this.filterResult[prop].splice(this.filterResult[prop].findIndex(f => f === item.value), 1)
          this.$set(item,'selected',false)
        } else {
          this.filterResult[prop].push(item.value)
          this.$set(item,'selected',true)
        }
      } else {
        if (this.filterResult[prop] === item.value) {
          this.filterResult[prop] = null
          this.$set(item,'selected',false)
        } else {
          this.filterResult[prop] = item.value
          this.filterConfig.forEach(fc=>{
            if (fc.prop === prop) {
              fc.options.forEach(op=>{
                this.$set(op,'selected',false)
              })
            }
          })
          this.$set(item,'selected',true)
        }
      }
    },
    clickOverlay() {
      // 点击遮罩层隐藏筛选面板 还原上次的筛选项
      this.filterConfig.forEach(fc=>{
        const { prop, multiple = true, options } = fc
        options.forEach(op=>{
          this.$set(op,'selected',false)
          if (multiple) {
            if (this.filterCopy[prop].findIndex(item=>item === op.value) > -1) {
              this.$set(op,'selected',true)
            }
          } else {
            if (this.filterCopy[prop] === op.value) {
              this.$set(op,'selected',true)
            }
          }
        })
      })
      this.filterResult = deepCopy(this.filterCopy)
      this.$emit('clickOverlay')
    },
    filterReset() {
      // 重置筛选项 不触发筛选 不隐藏筛选面板
      this.filterConfig.forEach(fc=>{
        const { prop, multiple = true, options } = fc
        if( multiple ) {
          this.filterResult[prop] = []
        } else {
          this.filterResult[prop] = null
        }
        options.forEach(op=>{
          this.$set(op,'selected',false)
        })
      })
    },
    filterConfirm() {
      // 存储筛选项
      this.filterCopy = deepCopy(this.filterResult)
      this.$emit('filterConfirm',this.filterResult)
    }
  },
  components: {
    'van-action-sheet':ActionSheet
  }
};
</script>
<style lang="less" scoped>
.filter-content{
  color: #8E8E8E;
  font-size: 28px;
  .filter-type {
    padding-top: 36px;
    padding-left: 36px;
  }
  .filter-type-title{
    color: #303133;
    width: 120px;
  }
  .filter-type-cell {
    margin-bottom: 40px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    span{
      font-size: 22px;
      padding: 0 16px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      background-color: #F9F9F9;
      // margin: 0 20px 30px 0;
      margin-right: 20px;
      border: 1px solid #E8E8E8;
      border-radius: 12px;
    }
    span:first-child{
      margin-left: 0;
    }
    .is_active {
      background-color: #FFF7FB;
      color: #ED8DC3;
      border-color: #ED8DC3;
    }
  }
  .filter-button{
    display: flex;
    justify-content: center;
    height: 94px;
    line-height: 94px;
    text-align: center;
    color: #606266;
    &-reset{
      flex: 0.5;
      border-top: 2px solid #F9F9F9;
      border-right: 2px solid #F9F9F9;
    }
    &-confirm{
      flex: 0.5;
      color: #ED8DC3;
      border-top: 2px solid #F9F9F9;
    }
  }
}
</style>