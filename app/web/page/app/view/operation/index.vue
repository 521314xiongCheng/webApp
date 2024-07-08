<template>
  <div class="opaque-wrap" :class="{ isAndroid: !isIos }">
    <van-sticky>
      <NavBar
        left-text="返回"
        title="我的教练"
        :border="false"
        :safe-area-inset-top="true"
        @click-left="back"
        @click-right="toReportSearch"
      >
        <template #left>
          <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
        </template>
        <template #right>
          <img class="customer_btn" src="../../images/icon_report.png" alt="" />
        </template>
      </NavBar>
    </van-sticky>
    <div class="page-wrap">
      <div class="content">
        <div class="content-bg">
          <!-- 管理区域 -->
          <div
            class="content-item"
            @click="toAreaReport('AREA_ONE_TO_THREE', null, 'HomeDetailsClick')"
          >
            <div class="content-item-title">
              <span class="content-item-title-left">管理区域</span>
            </div>
            <div class="retail">
              <div
                class="retail-item"
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    null,
                    'HomeTotalNumberClick'
                  )
                "
              >
                <div>{{ area.memberCount | formatMoney }}</div>
                <div class="retail-item-desc">区域总数</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    null,
                    'HomeTargetUnsetClick'
                  )
                "
              >
                <div>{{ area.noTargetMemberCount | formatMoney }}</div>
                <div class="retail-item-desc">未设目标</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="
                  toAreaReport('AREA_ONE_TO_THREE', null, 'HomeTargetSetClick')
                "
              >
                <div>{{ area.hasTargetMemberCount | formatMoney }}</div>
                <div class="retail-item-desc">已设目标</div>
              </div>
            </div>
            <div class="unit-tag">
              <div
                class="unit-tag-item"
                :style="`width:${getTagWidth(
                  area.tagSummary ? area.tagSummary.focusCount : 0
                )}`"
                @click.stop="
                  toAreaReport('AREA_ONE_TO_THREE', '1', 'HomeTagFollowClick')
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle7.png"
                    alt=""
                  />
                  <span class="label">关注</span>
                </div>
                <span class="amount">{{
                  area.tagSummary ? area.tagSummary.focusCount : 0
                }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="`background: #ECF5FF;color: #4D6ED1;width:${getTagWidth(
                  area.tagSummary ? area.tagSummary.newDirCount : 0
                )}`"
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    '7',
                    'HomeTagOffspingNewSDClick'
                  )
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle8.png"
                    alt=""
                  />
                  <span class="label">新督导</span>
                </div>
                <span class="amount">{{
                  area.tagSummary ? area.tagSummary.newDirCount : 0
                }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="`background: #F1F2FF;color: #997BD6;width:${getTagWidth(
                  area.tagSummary ? area.tagSummary.twoStarDirCount : 0
                )}`"
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    '8',
                    'HomeTagDoubleStarClick'
                  )
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle9.png"
                    alt=""
                  />
                  <span class="label">双星目标</span>
                </div>
                <span class="amount">{{
                  area.tagSummary ? area.tagSummary.twoStarDirCount : 0
                }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="`background: #FFF6EC;color: #FD9A3B;width:${getTagWidth(
                  area.tagSummary ? area.tagSummary.pinkCarDirCount : 0
                )}`"
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    '9',
                    'HomeTagOffspingPinkCarClick'
                  )
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle10.png"
                    alt=""
                  />
                  <span class="label">粉车目标</span>
                </div>
                <span class="amount">{{
                  area.tagSummary ? area.tagSummary.pinkCarDirCount : 0
                }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="`background: #FFECEC;color: #D56B6B;width:${getTagWidth(
                  area.tagSummary ? area.tagSummary.seminarContestCount : 0
                )}`"
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    '10',
                    'HomeTagSeminarTargetClick'
                  )
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle11.png"
                    alt=""
                  />
                  <span class="label">研讨会目标</span>
                </div>
                <span class="amount">{{
                  area.tagSummary ? area.tagSummary.seminarContestCount : 0
                }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="`background: #FFEBD8;color: #CD925C;width:${getTagWidth(
                  area.tagSummary ? area.tagSummary.threeStarDirCount : 0
                )}`"
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    '11',
                    'HomeOffspingTripleStarClick'
                  )
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle12.png"
                    alt=""
                  />
                  <span class="label">海外游-三星目标</span>
                </div>
                <span class="amount">{{
                  area.tagSummary ? area.tagSummary.threeStarDirCount : 0
                }}</span>
              </div>
            </div>
            <div class="detail-btn">
              <van-button plain>查看详情</van-button>
            </div>
          </div>
          <!-- DIQ跟进 -->
          <div class="content-item" @click="toDIQReport(null, null)">
            <div class="content-item-title">
              <span class="content-item-title-left">DIQ跟进</span>
            </div>
            <!-- <div class="area-diq">
              <div class="area-diq-item">
                <div class="area-diq-item-desc">DIQ总数</div>
                <div>{{ areadiq.memberCount ? areadiq.memberCount : 0 }}</div>
              </div>
            </div> -->
            <div class="retail">
              <div class="retail-item" @click.stop="toDIQReport(null, null)">
                <div>{{ areadiq.diqTotal }}</div>
                <div class="retail-item-desc">DIQ总数</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="toDIQReport('tabType', 'assess')"
              >
                <div>{{ areadiq.diqExamNum }}</div>
                <div class="retail-item-desc">考核期</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="toDIQReport('tabType', 'apply')"
              >
                <div>{{ areadiq.diqFdirNum }}</div>
                <div class="retail-item-desc">申请期</div>
              </div>
            </div>
            <div class="detail-btn">
              <van-button plain>查看详情</van-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { NavBar, Button, Sticky } from "vant";
import { isIos, closeWebview, xxxxxx, formatMoney } from "../../utils/index";
import horizontalScreen from "../../mixin/horizontalScreen";
export default {
  mixins: [horizontalScreen],
  data() {
    return {
      pageTitle: "我的教练",
      isIos: isIos(),
      targetContactId: "",
      areadiq: {
        diqTotal: null, //diq总数
        diqFdirNum: null, //diq申请期人数
        diqExamNum: null, //diq考核期人数
      },
      area: {
        areaOneProductionAmt: null, //一类管理区域绩效
        areaTwoProductionAmt: null, //二类管理区域绩效
        areaThreeProductionAmt: null, //三类管理区域绩效
        tagSummary: {
          focusCount: null, //关注
          newDirCount: null, //新督导
          twoStarDirCount: null, //双星督导
          pinkCarDirCount: null, //粉车督导
          seminarContestCount: null, //研讨会竞赛
          threeStarDirCount: null, //海外游-三星督导
        },
      },
    };
  },
  async created() {
    const { monthKey, targetContactId, consultantName, levelCode } =
      this.$route.query;
    this.monthKey = monthKey;
    if (targetContactId && consultantName && levelCode) {
      this.targetContactId = targetContactId;
      this.pageTitle = consultantName;
      this.levelCode = levelCode;
    } else {
      if (xxxxxx) {
        let userProfile = await this.$jsBridge.getUserProfile();
        userProfile =
          typeof userProfile === "string"
            ? JSON.parse(userProfile)
            : userProfile;
        console.log(userProfile);
        this.targetContactId = userProfile.contact_id;
        this.levelCode = Number(userProfile.career_level_code);
        this.pageTitle = userProfile.display_name;
      }
    }
    this.initPage();
  },
  mounted() {
    // 返回时需要刷新数据
    const onFronted = (data) => {
      this.initPage();
      this.resetToPortraitScreen();
    };
    this.$jsBridge.onFronted(onFronted);
  },
  methods: {
    initPage() {
      this.getArea();
      this.getAREADiq();
    },
    async getArea() {
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/dashboards/employee/area`
      );
      this.area = data;
    },
    async getAREADiq() {
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/dashboards/employee/diqfollowup`
      );
      if (data) {
        this.areadiq = data;
      }
    },
    back() {
      closeWebview();
    },
    toReportSearch() {
      this.$track({
        context: "StaffHomePage",
        behavior: "HomeContestReportSearchClick",
        item_type: "StaffHomePage",
        item_id: "HomeContestReportSearchClick",
      });
      let url = `${window.location.origin}/reports_search`;
      const params = {
        opaque: false,
        targetContactId: this.targetContactId,
      };
      this.$go(url, params);
    },
    getTagWidth(amount) {
      // amount = 0 width = 50%
      // amount+1 width = 50% + 5%
      // amount >= 10 width = 100%
      if (!amount) return "60%";
      let per = amount >= 8 ? 40 : amount * 5;
      return `${60 + per}%`;
    },
    toAreaReport(type, tagId, eventType) {
      this.$track({
        context: "StaffHomePage",
        behavior: eventType,
        item_type: "StaffHomePage",
        item_id: eventType,
      });
      let url = `${window.location.origin}/operation_area`;
      const params = {
        opaque: false,
        levelCode: this.levelCode,
        monthKey: this.monthKey,
        targetContactId: this.targetContactId,
        isSelf: true,
      };
      if (tagId) {
        params.tagId = tagId;
      }
      this.$go(url, params);
    },
    toDIQReport(searchStr, searchType) {
      this.$track({
        context: "StaffHomePage",
        behavior: "HomeDIQFollowDetailsClick",
        item_type: "StaffHomePage",
        item_id: "HomeDIQFollowDetailsClick",
      });
      let url = `${window.location.origin}/operation_areadiq`;
      const params = {
        opaque: false,
        levelCode: this.levelCode,
        monthKey: this.monthKey,
        targetContactId: this.targetContactId,
        isSelf: true,
      };
      if (searchStr) {
        params[searchStr] = searchType;
      }
      this.$go(url, params);
    },
  },
  components: {
    NavBar,
    "van-button": Button,
    "van-sticky": Sticky,
  },
};
</script>
<style lang="less" scoped>
.opaque-wrap {
  background-color: #fff;
  .page-wrap {
    // padding-top: env(safe-area-inset-top);
    // margin-top: 80px;
  }
  .content {
    background-color: #fff;
    padding: 16px 30px;
    &-bg {
      background-color: #f5f5f5;
      box-shadow: 0px 2px 12px 0px rgba(193, 193, 193, 0.5);
      border-radius: 16px;
    }
    &-item {
      margin-top: 10px;
      background-color: #fff;
      &-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28px;
        color: #484848;
        font-weight: bold;
        padding: 33px 40px;
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
        .history {
          border: none;
          background-color: #fef5ff;
          height: 36px;
          line-height: 36px;
          font-size: 22px;
          color: #f16eae;
          border-radius: 21px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          img {
            width: 22px;
            height: 22px;
            margin-right: 3px;
          }
        }
      }
      &-subtitle {
        display: flex;
        justify-content: space-between;
        padding: 0 20px 0 40px;
      }
      .detail-btn {
        text-align: center;
        .van-button {
          padding: 0 35px;
          border-radius: 21px;
          border-color: #f16eae;
          height: 40px;
          line-height: 40px;
          color: #f16eae;
          margin: 20px auto 30px;
          font-size: 22px;
        }
      }
    }
    &-item-team {
      .detail-btn {
        .van-button {
          margin-top: 40px;
        }
      }
    }
    .retail {
      display: flex;
      justify-content: center;
      align-items: center;
      &-item-line {
        height: 59px;
        width: 1px;
        background-color: #efefef;
      }
      &-item {
        text-align: center;
        flex-grow: 1;
        font-size: 42px;
        color: #484848;
        font-weight: bold;
        &-desc {
          font-size: 22px;
          color: #7f7f7f;
          font-weight: normal;
          margin-top: 30px;
        }
      }
    }
    .unit-tag {
      padding: 0 44px;
      margin-top: 40px;
      &-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 56px;
        border-radius: 40px;
        background: #fff1f7;
        color: #ee4d9b;
        margin: 20px 0;
        &-left {
          display: flex;
          align-items: center;
        }
        .icon {
          width: 56px;
          height: 56px;
          margin-right: 20px;
        }
        .label {
          font-size: 24px;
        }
        .amount {
          margin-right: 26px;
          font-size: 26px;
        }
      }
    }
    .area-diq {
      &-item {
        display: flex;
        justify-content: space-between;
        padding: 0 120px;
        font-size: 32px;
        color: #484848;
      }
    }
  }
}
.isAndroid {
  .page-wrap {
    // margin-top: 135px;
  }
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
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
      .customer_btn {
        width: 40px;
        height: 40px;
      }
    }
  }
  .van-nav-bar__title {
    color: #fff;
    font-size: 30px;
  }
}
</style>
