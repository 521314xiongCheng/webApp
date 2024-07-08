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
      <!-- DIQ状态 -->
      <div class="content-item">
        <div class="title" style="margin-bottom: 0">
          DIQ状态：当前为考核期第<span class="default-color">{{
            pageData.assessMonthNo
          }}</span
          >月
        </div>
      </div>
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
        <pie-chart v-model="totalProductionRate" :class="pageData.totalProductionSummary.totalProduction > 0 ? 'circle2' : 'circle'"/>
      </div>
      <!-- 累计DIQ沙龙绩效 -->
      <div class="content-item">
        <div class="title">累计DIQ沙龙绩效（{{ diqMonthInterval }}）</div>
        <div class="retail">
          {{ pageData.totalDiqProductionSummary.totalProduction | formatMoney }}
        </div>
        <div
          class="retail-item"
          v-for="(item, index) in pageData.totalDiqProductionSummary
            .monthProduction"
          :key="`month_${index}`"
        >
          ·{{ item.month }}月DIQ沙龙绩效({{ item.production | formatMoney }}）
        </div>
        <div class="state-title">当前挑战状态</div>
        <div v-if="!pageData.totalDiqProductionSummary.productionStatus">
          <div
            class="state-des"
            v-if="pageData.totalDiqProductionSummary.currentProductionStatus"
          >
            <img src="../../../images/selected.png" alt="" />
            <div>
              本月DIQ沙龙为{{
                pageData.totalDiqProductionSummary.currentProduction
                  | formatMoney
              }}
            </div>
          </div>
          <div class="state-des" v-else>
            <img src="../../../images/selected-dis.png" alt="" />
            <div>
              本月DIQ沙龙为{{
                pageData.totalDiqProductionSummary.currentProduction
                  | formatMoney
              }}，还需{{
                pageData.totalDiqProductionSummary.currentGapProduction | formatMoney
              }}即可计入DIQ沙龙考核绩效
            </div>
          </div>
        </div>

        <div
          class="state-des"
          v-if="pageData.totalDiqProductionSummary.productionStatus"
        >
          <img src="../../../images/selected.png" alt="" />
          <div>已达成</div>
        </div>
        <div class="state-des" v-else>
          <img src="../../../images/selected-dis.png" alt="" />
          <div>
            距累计DIQ沙龙绩效（45,000）还需{{
              pageData.totalDiqProductionSummary.gapProduction | formatMoney
            }}
          </div>
        </div>
        <pie-chart v-model="totalDiqProductionRate" :class="pageData.totalDiqProductionSummary.totalProduction > 0 ? 'circle2' : 'circle'" />
        <van-button class="button" @click="toDiqUnit">DIQ沙龙报表</van-button>
      </div>
      <!-- DIQ沙龙成员 -->
      <div class="content-item">
        <div class="title">DIQ沙龙A成员（{{ month }}月）</div>
        <div class="retail">{{ pageData.diqAStatusMember.aCount }}</div>
        <div class="retail-item"></div>
        <div class="retail-item"></div>
        <div class="state-title">当前挑战状态</div>
        <div class="state-des" v-if="pageData.diqAStatusMember.aStatus">
          <img src="../../../images/selected.png" alt="" />
          <div>已达成</div>
        </div>
        <div class="state-des" v-else>
          <img src="../../../images/selected-dis.png" alt="" />
          <div>
            距DIQ沙龙A成员（20）还需{{ pageData.diqAStatusMember.gapACount }}位
          </div>
        </div>
        <pie-chart v-model="aCountRate" class="circle" />
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
      <!-- 个人每月A状态 -->
      <div class="content-item">
        <div class="title">个人每月A状态</div>
        <div class="state-des" v-if="pageData.selfAStatus">
          <img src="../../../images/selected.png" alt="" />
          <div>已达成</div>
        </div>
        <div class="state-des" v-else>
          <img src="../../../images/selected-dis.png" alt="" />
          <div>未达成</div>
        </div>
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
            DIQ考核期规则
          </span>
          <div class="dialog-box">
            <div class="content-scroll no-button">
              <div class="dialog-content-item">
                <div class="sub-title">
                  在进入考核期的连续3个月内，符合以下条件：
                </div>
                <p>
                  1. 考核期本人每月<span class="default-color">保持 A 状态</span
                  >。
                </p>
                <p>
                  2. 累计零售绩效达到<span class="default-color">4,800</span>。
                </p>
                <p>
                  3. 累计DIQ沙龙管理绩效达到<span class="default-color"
                    >45,000</span
                  >，且每月不低于<span class="default-color"
                    >10,000，DIQ累计零售绩效最多只计入10,000</span
                  >。
                </p>
                <p>
                  4. 考核期届满，DIQ沙龙中有<span class="default-color"
                    >20名A顾问</span
                  >。
                </p>
                <p>
                  考核期届满，如果没有达到20名A顾问要求，其他考核条件在3个月内均已完成的情况，最多可以延1个月，即第4个月完成
                  20名A顾问的要求，个人当月A状态。
                </p>
                <p>
                  5. 考核期内如有行为规范记录,
                  或当月DIQ沙龙管理绩效未达10,000、个人未达A状态，次月将降级。
                </p>
                <p>
                  (1.DIQ在达成绩效考核后，公司会开展行为规范审核，若DIQ行为规范审核没有通过，公司将不予晋升其成为督导。）
                </p>
                <p>
                  (2.如果美容顾问存在无法联系的情况，则其辅导老师将会被取消晋升资格、竞赛奖励的获得资格。)
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
import { NavBar, Icon, Sticky, Popup, Button } from "vant";
import { isIos, closeWebview, subtract } from "../../../utils/index";
export default {
  data() {
    return {
      isIos: isIos(),
      popupRule: false,
      totalProductionRate: null,
      totalDiqProductionRate: null,
      aCountRate: null,
      pageData: {
        totalProductionSummary: {},
        totalDiqProductionSummary: {},
        diqAStatusMember: {},
      },
      monthInterval: "",
      diqMonthInterval: "",
      monthKey: "",
      month: "",
    };
  },
  components: {
    NavBar,
    PieChart,
    "van-sticky": Sticky,
    "van-icon": Icon,
    "van-popup": Popup,
    "van-button": Button,
  },
  async created() {
    let api = this.$ctx.baseApi;
    const { data } = await this.$request.get(`${api}/monthkey`);
    this.monthKey = data;
    this.initData();
  },
  mounted() {
    this.rate = 20;
  },
  methods: {
    back() {
      closeWebview();
    },
    async initData() {
      let baseApi = this.$ctx.baseApi;
      // let baseApi = "https://mock.marykay.com.cn/mock/663/api/v1";
      const { data } = await this.$request.get(`${baseApi}/diq/exam`);
      this.pageData = data;
      this.pageData.totalProductionSummary.gapProduction = subtract(
        4800,
        parseInt(this.pageData.totalProductionSummary.totalProduction),
        0
      );
      this.pageData.totalDiqProductionSummary.currentGapProduction = subtract(
        10000,
        parseInt(this.pageData.totalDiqProductionSummary.currentProduction),
        0
      );
      this.pageData.totalDiqProductionSummary.gapProduction = subtract(
        45000,
        parseInt(this.pageData.totalDiqProductionSummary.totalProduction),
        0
      );
      console.log(this.pageData.diqAStatusMember.aStatus);
      const { monthProduction, totalProduction } = data.totalProductionSummary;
      const {
        monthProduction: diqMonthProduction,
        totalProduction: totalDiqProduction,
      } = data.totalDiqProductionSummary;
      const { aCount } = data.diqAStatusMember;
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
      if (diqMonthProduction && diqMonthProduction.length > 0) {
        let monthMap = diqMonthProduction.map((m) => {
          return `${m.month}月`;
        });
        if (monthMap.length > 1) {
          this.diqMonthInterval = [
            monthMap[0],
            monthMap[monthMap.length - 1],
          ].join(" - ");
        } else {
          this.diqMonthInterval = monthMap.join(" - ");
        }
      }
      this.totalProductionRate =
        totalProduction >= 4800
          ? 100
          : parseInt((totalProduction / 4800) * 100);
      console.log("totalDiqProduction", totalDiqProduction);
      this.totalDiqProductionRate =
        totalDiqProduction >= 45000
          ? 100
          : parseInt((totalDiqProduction / 45000) * 100);
      this.aCountRate = aCount >= 20 ? 100 : parseInt((aCount / 20) * 100);
      this.month = Number(data.monthKey.toString().substr(4, 6));
      this.monthKey = data.monthKey;
    },
    toDiqUnit() {
      const { levelCode, targetContactId } = this.$route.query;
      let url = `${window.location.origin}/prep_unit`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        levelCode: levelCode,
        targetContactId: targetContactId,
        isSelf: true,
      };
      this.$go(url, params);
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
          margin-top: 3px;
        }
      }
      .button {
        margin: 40px 0 22px 191px;
        width: 250px;
        height: 73px;
        background-color: #f16eae;
        font-size: 30px;
        line-height: 73px;
        color: #fff;
      }
    }
    .circle {
      position: absolute;
      top: 20px;
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
</style>
