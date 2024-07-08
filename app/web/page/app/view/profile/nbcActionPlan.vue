<!-- 沙龙详情 -->
<template>
  <div class="wrap" :class="{ isAndroid: !isIos }">
    <van-sticky>
      <NavBar
        left-text="返回"
        :border="false"
        :safe-area-inset-top="true"
        @click-left="back"
      >
        <template #title>
          新人行动<span class="ft28"
            >（{{ finishCount }}/{{ totalCount }}）</span
          ><img
              class="icon_q"
              @click="
                showDialog = true;
              "
              src="../../images/icon_q.png"
              alt=""
            /></template
        >
        <template #left>
          <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
        </template>
      </NavBar>
    </van-sticky>
    <div class="content">
      <div class="content-bg">
        <div class="content-item">
          <div class="content-item-title">
            <span class="content-item-title-left">幸福小店主阶段</span>
          </div>
          <div
            class="plan-item"
            v-for="(item, index) in newBcList"
            :key="`newbc_${index}`"
          >
            <div class="plan-item-title">
              <span>{{ index + 1 }}.{{ item.itemName }}</span>
              <div v-if="item.auto === 1">
                <div v-if="item.finish === 1" class="checkbox checked">
                  <img
                    class="icon"
                    src="../../images/selected-dis.png"
                    alt=""
                  />
                  <span>已完成</span>
                </div>
                <div v-else class="checkbox">
                  <img
                    class="icon"
                    src="../../images/unselected-dis.png"
                    alt=""
                  />
                  <span>未完成</span>
                </div>
              </div>
              <div v-else>
                <div
                  v-if="item.finish === 1"
                  class="checkbox checked"
                  @click="updateStatus(item, 2)"
                >
                  <img class="icon" src="../../images/selected.png" alt="" />
                  <span>已完成</span>
                </div>
                <div v-else class="checkbox" @click="updateStatus(item, 1)">
                  <img class="icon" src="../../images/unselected.png" alt="" />
                  <span>未完成</span>
                </div>
              </div>
            </div>
            <div
              class="subitem-name"
              v-for="(subItemName, idx) in item.subItemNames"
              :key="`subItemName_${idx}`"
            >
              <span style="color: #fff">{{ index + 1 }}</span> ·{{
                subItemName.name
              }}
            </div>
            <div
              class="plan-item-content"
              v-if="item.subItems && item.subItems.length"
            >
              <span class="me">我</span>
              <div class="text">
                <div
                  class="text-item"
                  v-for="(subItem, subIndex) in item.subItems"
                  :key="`sub_${subIndex}`"
                >
                  <div>
                    <span v-if="item.subItems && item.subItems.length > 1"
                      >·</span
                    >{{ subItem.itemName }}
                  </div>
                  <div
                    class="text-item sub-text"
                    v-for="(subItemName, idx) in subItem.subItemNames"
                    :key="`subItemName_${idx}`"
                  >
                    <div>·{{ subItemName.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-item">
          <div class="content-item-title">
            <span class="content-item-title-left">销售顾问</span>
          </div>
          <div
            class="plan-item"
            v-for="(item, index) in saleBcList"
            :key="`newbc_${index}`"
          >
            <div class="plan-item-title">
              <span>{{ index + 1 }}.{{ item.itemName }}</span>
              <div v-if="item.auto === 1">
                <div v-if="item.finish === 1" class="checkbox checked">
                  <img
                    class="icon"
                    src="../../images/selected-dis.png"
                    alt=""
                  />
                  <span>已完成</span>
                </div>
                <div v-else class="checkbox">
                  <img
                    class="icon"
                    src="../../images/unselected-dis.png"
                    alt=""
                  />
                  <span>未完成</span>
                </div>
              </div>
              <div v-else>
                <div
                  v-if="item.finish === 1"
                  class="checkbox checked"
                  @click="updateStatus(item, 2)"
                >
                  <img class="icon" src="../../images/selected.png" alt="" />
                  <span>已完成</span>
                </div>
                <div v-else class="checkbox" @click="updateStatus(item, 1)">
                  <img class="icon" src="../../images/unselected.png" alt="" />
                  <span>未完成</span>
                </div>
              </div>
            </div>
            <div
              class="subitem-name"
              v-for="(subItemName, idx) in item.subItemNames"
              :key="`subItemName_${idx}`"
            >
              <span style="color: #fff">{{ index + 1 }}</span
              >·{{ subItemName.name }}
            </div>
            <div
              class="plan-item-content"
              v-if="item.subItems && item.subItems.length"
            >
              <span class="me">我</span>
              <div class="text">
                <div
                  class="text-item"
                  v-for="(subItem, subIndex) in item.subItems"
                  :key="`sub_${subIndex}`"
                >
                  <div>
                    <span v-if="item.subItems && item.subItems.length > 1"
                      >·</span
                    >{{ subItem.itemName }}
                  </div>
                  <div
                    class="text-item sub-text"
                    v-for="(subItemName, idx) in subItem.subItemNames"
                    :key="`subItemName_${idx}`"
                  >
                    <div>·{{ subItemName.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-item">
          <div class="content-item-title">
            <span class="content-item-title-left">教练顾问</span>
          </div>
          <div
            class="plan-item"
            v-for="(item, index) in leadBcList"
            :key="`newbc_${index}`"
          >
            <div class="plan-item-title">
              <span>{{ index + 1 }}.{{ item.itemName }}</span>
              <div v-if="item.auto === 1">
                <div v-if="item.finish === 1" class="checkbox checked">
                  <img
                    class="icon"
                    src="../../images/selected-dis.png"
                    alt=""
                  />
                  <span>已完成</span>
                </div>
                <div v-else class="checkbox">
                  <img
                    class="icon"
                    src="../../images/unselected-dis.png"
                    alt=""
                  />
                  <span>未完成</span>
                </div>
              </div>
              <div v-else>
                <div
                  v-if="item.finish === 1"
                  class="checkbox checked"
                  @click="updateStatus(item, 2)"
                >
                  <img class="icon" src="../../images/selected.png" alt="" />
                  <span>已完成</span>
                </div>
                <div v-else class="checkbox" @click="updateStatus(item, 1)">
                  <img class="icon" src="../../images/unselected.png" alt="" />
                  <span>未完成</span>
                </div>
              </div>
            </div>
            <div
              class="subitem-name"
              v-for="(subItemName, idx) in item.subItemNames"
              :key="`subItemName_${idx}`"
            >
              <span style="color: #fff">{{ index + 1 }}</span>
              ·{{ subItemName.name }}
            </div>
            <div
              class="plan-item-content"
              v-if="item.subItems && item.subItems.length"
            >
              <span class="me">我</span>
              <div class="text">
                <div
                  class="text-item"
                  v-for="(subItem, subIndex) in item.subItems"
                  :key="`sub_${subIndex}`"
                >
                  <div>
                    <span v-if="item.subItems && item.subItems.length > 1"
                      >·</span
                    >{{ subItem.itemName }}
                  </div>
                  <div
                    class="text-item sub-text"
                    v-for="(subItemName, idx) in subItem.subItemNames"
                    :key="`subItemName_${idx}`"
                  >
                    <div>·{{ subItemName.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-popup
      v-model="showDialog"
      position="center"
      round
    >
      <div class="dialog-content">
        <div class="dialog-title">
          提示
        </div>
        <div class="dialog-box">
          <div class="rule-item">·
            <img class="icon-unselect" src="../../images/unselected-dis.png" alt="">
            <span>灰色选项的新人行动任务，由系统自动判定是否完成，无需顾问自行勾选。</span>
          </div>
          <div class="rule-item">·
            <img class="icon-unselect" src="../../images/unselected.png" alt="">
            <span>白色选项的新人行动任务，由顾问自行勾选完成。</span>
          </div>
        </div>
        <div class="dialog-button">
          <van-button @click="showDialog = false">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { NavBar, Button, Icon, Sticky, Popup } from "vant";
import { isIos, closeWebview, xxxxxx, formatMoney } from "../../utils/index";
import commonTable from "../../components/commonTable.vue";
export default {
  components: {
    commonTable,
    NavBar,
    "van-button": Button,
    "van-icon": Icon,
    "van-sticky": Sticky,
    "van-popup": Popup,
  },
  data() {
    return {
      isFullScreen: false,
      isIos: isIos(),
      checked: false,
      totalCount: 18,
      finishCount: 15,
      leadBcList: [],
      newBcList: [],
      saleBcList: [],
      targetContactId: null,
      showDialog: false
    };
  },
  created() {
    const {
      levelCode,
      targetContactId,
      accountType,
      monthKey,
      isEmployee,
      from,
    } = this.$route.query;
    this.targetContactId = targetContactId;
    this.$jsBridge.startBusy();
    this.loadData();
    this.$jsBridge.stopBusy();
  },
  methods: {
    back() {
      closeWebview();
    },
    async loadData() {
      // let baseApi = "https://mock.marykay.com.cn/mock/646/api/v1";
      let baseApi = this.$ctx.baseApi;
      const {
        data: { finishCount, totalCount, leadBcList, newBcList, saleBcList },
      } = await this.$request.get(`${baseApi}/goldenweek/list`);
      this.finishCount = finishCount;
      this.totalCount = totalCount;
      this.newBcList = newBcList;
      this.leadBcList = leadBcList;
      this.saleBcList = saleBcList;
    },
    async updateStatus(item, type) {
      this.$jsBridge.startBusy()
      // let baseApi = "https://mock.marykay.com.cn/mock/646/api/v1";
      let baseApi = this.$ctx.baseApi;
      let body = {
        contactId: this.targetContactId,
        finish: type,
      };
      const result = await this.$request.put(
        `${baseApi}/goldenweek/${item.itemId}/status`,
        body
      );
      this.$jsBridge.stopBusy()
      this.loadData();
    },
  },
};
</script>
<style lang="less" scoped>
.wrap {
  font-size: 30px;
  color: #484848;
  background-color: #fafafa;
  padding-bottom: 30px;
  //   min-height: 100vh;
  .content {
    padding: 0 22px;
    &-item {
      margin-top: 16px;
      background-color: #fff;
      box-shadow: 0px 2px 16px 0px rgba(193, 193, 193, 0.5);
      border-radius: 16px;
      &-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28px;
        color: #484848;
        font-weight: bold;
        padding: 30px 0 0 47px;
        line-height: 1;
        &-left {
          position: relative;
          &::before {
            content: " ";
            width: 7px;
            height: 28px;
            background-color: #f16eae;
            position: absolute;
            left: -22px;
            top: 0;
          }
        }
      }
      .plan-item {
        font-size: 22px;
        color: #7f7f7f;
        border-bottom: 8px solid #f1f1f1;
        padding: 30px 0;
        .icon {
          width: 32px;
          height: 32px;
          margin-right: 15px;
        }
        &-title {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-left: 47px;
          color: #f16eae;
          font-size: 26px;
          //   margin-bottom: 18px;
        }
        .checkbox {
          display: flex;
          align-items: center;
          font-size: 24px;
          min-width: 128px;
          margin-right: 24px;
        }
        .checked {
          color: #7f7f7f;
        }
        &-content {
          font-size: 24px;
          color: #7f7f7f;
          padding-left: 47px;
          line-height: 32px;
          display: flex;
          align-items: flex-start;
          margin-top: 18px;
          max-width: 520px;
          .me {
            color: #808af2;
            font-size: 23px;
            font-weight: bold;
            width: 32px;
            height: 32px;
            display: block;
            text-align: center;
            background-color: #f2f1ff;
            margin-right: 10px;
          }
          .text {
            &-item {
              margin-bottom: 10px;
            }
            &-item:last-child {
              margin-bottom: 0;
            }
          }
          .sub-text {
            margin-top: 16px;
          }
        }
      }
      .subitem-name {
        padding-left: 47px;
        color: #f16eae;
        font-size: 26px;
        line-height: 28px;
        margin-top: 10px;
      }
      .plan-item:last-child {
        border: none;
      }
    }
    .line {
      height: 8px;
      background: #f1f1f1;
    }
  }
}
.dialog-content {
  // height: calc(80vh - 152px);
  width: 590px;
  height: 430px;
  border-radius: 48px;
  padding: 30px;
  position: relative;
  background: url('../../images/nbc_bg.png') no-repeat;
  background-size: 100% 100%;
  .dialog-title {
    margin-top: 27px;
    position: relative;
    font-size: 36px;
    color: #541B5A;
    text-align: center;
    line-height: 1;
    margin-bottom: 36px;
    .hg {
      position: absolute;
      left: 200px;
      top: -22px;
      width: 32px;
      height: 30px;
    }
  }
  .dialog-box {
    .rule-item {
      font-size: 26px;
      color: #333;
      line-height: 44px;
      .icon-unselect {
        width: 32px;
        height: 32px;
        display: inline-block;
        vertical-align: sub;
      }
    }
  }
  .dialog-button {
    text-align: center;
    margin-top: 22px;
    .van-button {
      border-radius: 48px;
      background-color: #ED8DC3;
      color: #fff;
      font-size: 32px;
      width: 325px;
      height: 59px;
    }
  }
}
.isAndroid {
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
.ft28 {
  font-size: 28px;
}
/deep/.van-nav-bar__placeholder {
  background-color: #ee4d9b;
  z-index: 4;
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
    }
  }
  .van-nav-bar__title {
    color: #fff;
    font-size: 30px;
    display: flex;
    align-items: center;
    .icon_q {
      width: 30px;
      height: 30px;
      margin-left: 10px;
    }
  }
}
/deep/.van-popup {
  background: linear-gradient(360deg, #FFFFFF 0%, #FFDEEF 100%);
}
</style>
