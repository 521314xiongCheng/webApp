<template>
  <div class="common-wrap" :class="{ isAndroid: !isIos }">
    <van-sticky>
      <NavBar
        left-text="返回"
        title="DIQ查询"
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
          DIQ查询
          <img
            class="icon_q"
            @click="popupRule = !popupRule"
            src="../../../images/icon_q.png"
            alt=""
          />
        </template>
      </NavBar>
    </van-sticky>
    <div class="content">
      <!-- 累计零售绩效 -->
      <div class="content-item">
        <div class="title">累计零售绩效（{{ monthInterval }}）</div>
        <div class="retail">
          {{ pageData.totalProductionSummary.totalProduction | formatMoney }}
        </div>
        <div
          class="retail-item"
          v-for="(item, index) in pageData.totalProductionSummary
            .monthProduction"
          :key="`month_${index}`"
        >
          ·{{ item.month }}月零售绩效({{ item.production | formatMoney }}）
        </div>
        <div class="state-title">当前挑战状态</div>
        <div
          class="state-des"
          v-if="pageData.totalProductionSummary.productionStatus"
        >
          <img src="../../../images/selected.png" alt="" />
          <div>已达成</div>
        </div>
        <div class="state-des" v-else>
          <img src="../../../images/selected-dis.png" alt="" />
          <div>
            距累计零售绩效(4,800)还需{{
              pageData.totalProductionSummary.gapProduction | formatMoney
            }}
          </div>
        </div>
        <pie-chart v-model="totalProductionRate" :class="pageData.totalProductionSummary.totalProduction > 0 ? 'circle2' : 'circle'" />
      </div>
      <!-- 培养A顾问 -->
      <div class="content-item">
        <div class="title">培养A顾问（{{ monthKey }}月）</div>
        <div class="retail">{{ pageData.teamAStatusMember.aCount }}</div>
        <div class="retail-item"></div>
        <div class="retail-item"></div>
        <div class="state-title">当前挑战状态</div>
        <div class="state-des" v-if="pageData.teamAStatusMember.aStatus">
          <img src="../../../images/selected.png" alt="" />
          <div>已达成</div>
        </div>
        <div class="state-des" v-else>
          <img src="../../../images/selected-dis.png" alt="" />
          <div>
            距直接培养的A顾问(10)还需{{
              pageData.teamAStatusMember.gapACount
            }}位
          </div>
        </div>
        <pie-chart v-model="aCountRate" class="circle" />
      </div>
      <!-- 网上申请与自测 -->
      <div class="content-item">
        <div class="title">网上申请与自测</div>
        <div class="state-des" v-if="pageData.onlineSelfExamStatus === 1">
          <img src="../../../images/selected.png" alt="" />
          <div>已通过</div>
        </div>
        <div class="state-des" v-else-if="pageData.onlineSelfExamStatus === 0">
          <img src="../../../images/selected-dis.png" alt="" />
          <div>未自测</div>
        </div>
        <div class="state-des" v-else-if="pageData.onlineSelfExamStatus === 2">
          <img src="../../../images/selected-dis.png" alt="" />
          <div>未通过</div>
        </div>
        <div class="state-des" v-else-if="pageData.onlineSelfExamStatus === 3">
          <img src="../../../images/selected-dis.png" alt="" />
          <div>不可进行自测</div>
        </div>
      </div>
      <!-- 违规记录 -->
      <div class="content-item">
        <div class="title">违规记录</div>
        <div class="state-des" v-if="pageData.citationDate">
          <img src="../../../images/selected-dis.png" alt="" />
          <div>{{ pageData.citationDate }}</div>
        </div>
        <div class="state-des" v-else>
          <img src="../../../images/selected.png" alt="" />
          <div>无</div>
        </div>
      </div>
      <div class="tips">
        *具体是否可以晋升DIQ以实际情况为准
      </div>
    </div>
    <!-- 规则 -->
    <van-popup
      v-model="popupRule"
      class="timePopup"
      position="center"
      round
      closeable
    >
      <div class="dialog-wrap">
        <div class="dialog-content">
          <span class="dialog-title">
            <img
              src="../../../images/reports/incomeDeclaration/hg.png"
              alt=""
            />
            申请进入DIQ规则
          </span>
          <div class="dialog-box">
            <div class="content-scroll no-button">
              <div class="dialog-content-item">
                <div class="sub-title">申请前连续1-3个月符合以下条件：</div>
                <p>
                  1. 累计零售绩效达到<span class="default-color">4,800。</span>
                </p>
                <p>
                  2. 进入考核时本人培养<span class="default-color"
                    >10名A顾问</span
                  >
                  。(不包含申请本人)
                </p>
                <p>3. 申请当月通过“DIQ网上申请和自测”。</p>
                <p>
                  4.
                  提出申请前2个月内无书面提醒，前4个月无书面警告及以上警告处分。
                </p>
                <p>
                  ·DIQ在进入考核的第一个月，会邀请DIQ及其督导一起到所在体验中心进行面谈，了解业务开展情况；面谈须在DIQ考核第一个月的25日前完成，若无法完成公司将终止DIQ考核。
                </p>
                <p>
                  ·参加DIQ面试的少数民族顾问，如果不能及时独立完成笔试及汉语面谈，将无法通过DIQ考核、晋升督导的申请，并且三个月无法成为DIQ。
                </p>
                <p>
                  ·如果美容顾问存在无法联系的情况，则其辅导老师将会被取消晋升资格、竞赛奖励的获得资格。
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
      </div>
    </van-popup>
  </div>
</template>
<script>
import PieChart from "./components/PieChart";
import { NavBar, Icon, Sticky, Popup } from "vant";
import {
  isIos,
  closeWebview,
  formatMoney,
  subtract,
} from "../../../utils/index";
export default {
  data() {
    return {
      isIos: isIos(),
      popupRule: false,
      totalProductionRate: null,
      aCountRate: null,
      pageData: {
        totalProductionSummary: {},
        teamAStatusMember: {},
      },
      monthInterval: "",
      monthKey: "",
    };
  },
  components: {
    NavBar,
    PieChart,
    "van-sticky": Sticky,
    "van-icon": Icon,
    "van-popup": Popup,
  },
  created() {
    this.initData();
  },
  mounted() {},
  methods: {
    back() {
      closeWebview();
    },
    async initData() {
      let baseApi = this.$ctx.baseApi;
      // let baseApi = "https://mock.marykay.com.cn/mock/663/api/v1";
      const { data } = await this.$request.get(`${baseApi}/diq/fdir`);
      console.log(data);
      this.pageData = data;
      this.pageData.totalProductionSummary.gapProduction = subtract(
        4800,
        parseInt(this.pageData.totalProductionSummary.totalProduction),
        0
      );

      const { monthProduction, totalProduction } = data.totalProductionSummary;
      const { aCount } = data.teamAStatusMember;
      if (monthProduction && monthProduction.length > 0) {
        let monthMap = monthProduction.map((m) => {
          return `${m.month}月`;
        });
        if (monthMap.length > 1) {
          this.monthInterval = [
            monthMap[0],
            monthMap[monthMap.length - 1],
          ].join(" - ");
        } else {
          this.monthInterval = monthMap.join(" - ");
        }
      }
      this.totalProductionRate =
        totalProduction >= 4800
          ? 100
          : parseInt((totalProduction / 4800) * 100);
      this.aCountRate = aCount >= 10 ? 100 : parseInt((aCount / 10) * 100);
      this.monthKey = Number(data.monthKey.toString().substr(4, 6));
    },
  },
};
</script>
<style lang="less" scoped>
.common-wrap {
  .content {
    padding: 30px;
    &-item {
      border-radius: 20px;
      box-shadow: 0px 2px 9px 0px rgba(216, 216, 216, 0.5);
      padding: 25px;
      margin-bottom: 20px;
      position: relative;
      .title {
        font-size: 28px;
        line-height: 36px;
        color: #303133;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .retail {
        font-size: 36px;
        line-height: 1;
        color: #f16eae;
        margin-bottom: 20px;
      }
      .retail-item {
        font-size: 24px;
        line-height: 36px;
        color: #7f7f7f;
        margin-bottom: 10px;
      }
      .state-title {
        font-size: 28px;
        line-height: 36px;
        color: #303133;
        font-weight: bold;
        margin-top: 30px;
        margin-bottom: 20px;
      }
      .state-des {
        font-size: 24px;
        line-height: 36px;
        color: #303133;
        display: flex;
        align-items: flex-start;
        img {
          width: 30px;
          height: 30px;
          margin-right: 14px;
        }
      }
    }
    .circle {
      position: absolute;
      top: 25px;
      right: 60px;
    }
    .circle2 {
      position: absolute;
      top: 80px;
      right: 60px;
    }
  }
  .dialog-wrap {
    width: 670px;
    max-height: 80vh;
    padding: 0 40px 50px 40px;
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
      text-align: center;
      .dialog-title {
        position: relative;
        font-size: 36px;
        color: #541b5a;
        text-align: center;
        line-height: 1;
        img {
          position: absolute;
          left: -16px;
          top: -22px;
          width: 32px;
          height: 30px;
        }
      }
      .dialog-box {
        overflow: hidden;
      }
      .content-scroll {
        max-height: calc(80vh -336px);
        overflow-y: scroll;
        .dialog-content-item {
          margin-top: 36px;
          text-align: left;
          box-shadow: none;
          .sub-title {
            font-size: 26px;
            color: #595959;
            margin-bottom: 10px;
            line-height: 32px;
            font-weight: bold;
          }
          .sub-sub-title {
            font-size: 26px;
            color: #595959;
            margin: 20px 0 10px 0;
            font-weight: bold;
          }
          p {
            margin-bottom: 5px;
          }
        }
      }
      .no-button {
        max-height: calc(80vh -195px);
      }
      .icon-xin {
        position: absolute;
        bottom: -40px;
        right: -40px;
        width: 129px;
        height: 99px;
      }
    }
  }
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
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
.isAndroid {
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
/deep/.van-nav-bar {
  background-color: #ee4d9b;
  z-index: 4;
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
    display: flex;
    align-items: center;
    .icon_q {
      width: 30px;
      height: 30px;
      margin-left: 10px;
    }
  }
}

.tips {
        font-size: 28px;
        line-height: 36px;
        color: #ee4d9b;
        margin-bottom: 10px;
      }
</style>
