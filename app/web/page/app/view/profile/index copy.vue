<template>
  <div class="coach-home" :class="{ isAndroid: !isIos }">
    <NavBar
      left-text="返回"
      fixed
      title=""
      :border="false"
      :safe-area-inset-top="true"
      @click-left="back"
    >
      <template #left>
        <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
      </template>
    </NavBar>
    <div class="coach-home-content">
      <div class="user-info">
        <img
          class="user-info-avatar"
          :src="
            `https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${userInfo.contactId}/avatar?size=60`
          "
          alt=""
        />
        <div class="user-info-name">{{ userInfo.name }}</div>
        <div class="user-info-info">
          <span>{{ userInfo.activityStatusCode }}</span>
          <span class="line"></span>
          <span>{{ userInfo.careerLevelCode }}</span>
          <span class="line"></span>
          <span>{{ userInfo.isOrder ? "已下单" : "未下单" }}</span>
        </div>
        <div class="user-info-tag">
          <van-tag
            v-for="(tag, index) in userInfo.tags"
            :key="`tag_${index}`"
            color="#fff"
            text-color="#E862AD"
            type="primary"
            >{{ tag.tagName }}</van-tag
          >
        </div>
        <span class="see-more" @click="toSetting">更多</span>
      </div>
      <div class="content">
        <div class="content-bg">
          <!-- 本月目标收入 -->
          <div class="content-item">
            <div class="content-item-title">
              <div class="content-item-title-left">
                <span>本月目标收入：</span>
                <span class="target-income" v-if="userInfo.setTargetIncomeAmt"
                  >¥{{ userInfo.targetIncomeAmt | formatMoney }}</span
                >
                <van-button v-else class="set-target" @click="setTargetIncome"
                  >提醒设置</van-button
                >
              </div>
              <van-icon
                name="arrow"
                @click="toIncomeTargetEvaluate"
                color="#F16EAE"
              />
            </div>
          </div>
          <!-- 当月零售 -->
          <div class="content-item">
            <div class="content-item-title">
              <span class="content-item-title-left">当月零售</span>
              <van-button
                class="history"
                text="查看历史"
                @click="toRetailReport"
              >
                <template #icon>
                  <img src="../../images/index/icon_history.png" alt="" />
                </template>
              </van-button>
            </div>
            <div class="retail">
              <div class="retail-item">
                <div>¥{{ retail.rcProductionAmt | formatMoney }}</div>
                <div class="retail-item-desc">点数+返利</div>
              </div>
              <span class="retail-item-line"></span>
              <div class="retail-item">
                <div>¥{{ retail.retailAmt | formatMoney }}</div>
                <div class="retail-item-desc">金额</div>
              </div>
              <span class="retail-item-line"></span>
              <div class="retail-item">
                <div>{{ retail.productionAmt | formatMoney }}</div>
                <div class="retail-item-desc">绩效</div>
              </div>
            </div>
            <div class="order" @click="toOrderList">
              <div class="order-item">
                <div class="order-item-tag">
                  折扣：{{ retail.rcRetailDiscount }}%
                </div>
                <div class="order-item-label">RC订单总金额</div>
                <div class="order-item-price">
                  ¥{{ retail.rcRetailAmt | formatMoney }}
                </div>
                <div class="order-item-original-price">
                  本人订单:{{ retail.rcOrderRetail | formatMoney }}
                </div>
              </div>
              <div class="order-item">
                <div class="order-item-tag">
                  折扣：{{ retail.bcRetailDiscount }}%
                </div>
                <div class="order-item-label">顾问订单</div>
                <div class="order-item-price">
                  ¥{{ retail.bcRetailAmt | formatMoney }}
                </div>
                <div class="order-item-original-price"></div>
              </div>
              <div class="order-item">
                <div class="order-item-label">零售绩效分</div>
                <div class="order-item-price">
                  {{ retail.availablePoints | formatMoney }}
                </div>
                <div class="order-item-desc">
                  当月过期：{{ retail.currentMonthExpiredPoints | formatMoney }}
                </div>
              </div>
            </div>
          </div>
          <!-- 管理准沙龙 -->
          <div class="content-item content-item-team" v-if="levelCode === 50">
            <div class="content-item-title">
              <span class="content-item-title-left">管理准沙龙</span>
            </div>
            <div class="content-item-subtitle">
              <div class="performance">
                <span class="performance-label">绩效</span>
                <span>{{ diqunit.productionAmt | formatMoney }}</span>
              </div>
            </div>
            <div class="retail">
              <div class="retail-item">
                <div>{{ diqunit.noOrderMemberCount }}</div>
                <div class="retail-item-desc">未下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div class="retail-item">
                <div>{{ diqunit.orderMemberCount }}</div>
                <div class="retail-item-desc">已下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div class="retail-item">
                <div>{{ diqunit.newMemberCount }}</div>
                <div class="retail-item-desc">新成员</div>
              </div>
            </div>
            <div class="detail-btn">
              <van-button @click="toPrepUnitReport" plain>查看详情</van-button>
            </div>
          </div>
          <!-- 管理沙龙 -->
          <div class="content-item" v-if="levelCode >= 60">
            <div class="content-item-title">
              <span class="content-item-title-left">管理沙龙</span>
              <div class="history" @click="toUnitHistory">
                <img src="../../images/index/icon_history.png" alt="" />
                <span>查看历史</span>
              </div>
            </div>
            <div class="content-item-subtitle">
              <div class="performance">
                <span class="performance-label">绩效</span>
                <span>{{ unit.productionAmt | formatMoney }}</span>
              </div>
            </div>
            <div class="retail">
              <div class="retail-item">
                <div>{{ unit.noOrderMemberCount }}</div>
                <div class="retail-item-desc">未下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div class="retail-item">
                <div>{{ unit.orderMemberCount }}</div>
                <div class="retail-item-desc">已下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div class="retail-item">
                <div>{{ unit.newMemberCount }}</div>
                <div class="retail-item-desc">新成员</div>
              </div>
            </div>
            <div class="unit-tag">
              <div
                class="unit-tag-item"
                :style="`width:${getTagWidth(unit.focusCount)}`"
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">关注</span>
                </div>
                <span class="amount">{{ unit.focusCount }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="
                  `background: #ECF5FF;color: #4D6ED1;width:${getTagWidth(
                    unit.newJoinMemberCount
                  )}`
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle2.png"
                    alt=""
                  />
                  <span class="label">新顾问</span>
                </div>
                <span class="amount">{{ unit.newJoinMemberCount }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="
                  `background: #F1F2FF;color: #997BD6;width:${getTagWidth(
                    unit.beautyMemberCount
                  )}`
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">美丽顾问</span>
                </div>
                <span class="amount">{{ unit.beautyMemberCount }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="
                  `background: #FFF6EC;color: #FD9A3B;width:${getTagWidth(
                    unit.sellerMemberCount
                  )}`
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">销售型顾问</span>
                </div>
                <span class="amount">{{ unit.sellerMemberCount }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="
                  `background: #FFECEC;color: #D56B6B;width:${getTagWidth(
                    unit.leaderMemberCount
                  )}`
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">领袖型顾问</span>
                </div>
                <span class="amount">{{ unit.leaderMemberCount }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="
                  `background: #FFEBD8;color: #CD925C;width:${getTagWidth(
                    unit.inactiveMemberCount
                  )}`
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">睡美人</span>
                </div>
                <span class="amount">{{ unit.inactiveMemberCount }}</span>
              </div>
            </div>
            <div class="detail-btn">
              <van-button @click="toUnitReport" plain>更多沙龙详情</van-button>
            </div>
          </div>
          <!-- 美容顾问 -->
          <div class="content-item content-item-team">
            <div class="content-item-title">
              <span class="content-item-title-left">美容顾问</span>
            </div>
            <div class="content-item-subtitle">
              <div class="performance">
                <span class="performance-label">绩效</span>
                <span>{{ team.productionAmt | formatMoney }}</span>
              </div>
            </div>
            <div class="retail">
              <div class="retail-item">
                <div>{{ team.noOrderMemberCount }}</div>
                <div class="retail-item-desc">未下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div class="retail-item">
                <div>{{ team.orderMemberCount }}</div>
                <div class="retail-item-desc">已下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div class="retail-item">
                <div>{{ team.newMemberCount }}</div>
                <div class="retail-item-desc">新成员</div>
              </div>
            </div>
            <div class="detail-btn">
              <van-button plain @click="toTeamReport">查看详情</van-button>
            </div>
          </div>
          <!-- 一类管理区域 -->
          <div class="content-item" v-if="levelCode >= 70 && levelCode < 90">
            <div class="content-item-title">
              <span class="content-item-title-left">一类管理区域</span>
            </div>
            <div class="content-item-subtitle">
              <div class="performance">
                <span class="performance-label">管理区域绩效:</span>
                <span>{{ areaOne.areaOneProductionAmt | formatMoney }}</span>
              </div>
              <div class="performance">
                <span class="performance-label">管理区域人数:</span>
                <span>{{ areaOne.areaOneMemberCount }}</span>
              </div>
            </div>
            <div class="table">
              <van-row class="table-item table-item-header">
                <van-col span="14"></van-col>
                <van-col span="5">收入目标</van-col>
                <van-col span="5">绩效</van-col>
              </van-row>
              <van-row
                class="table-item"
                v-for="(item, index) in areaOne.members"
                :key="`members_${index}`"
              >
                <van-col class="table-item-2 whispace" span="14">
                  <img
                    :src="
                      `https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${item.contactId}/avatar?size=60`
                    "
                    alt=""
                  />
                  <span>{{ item.name }}</span>
                </van-col>
                <van-col span="5" v-if="item.incomeTarget"
                  >¥{{ item.incomeTarget | formatMoney }}</van-col
                >
                <van-col span="5" class="no-set-btn" v-else>
                  <van-button plain @click="inviteSetTarget">未设置</van-button>
                </van-col>
                <van-col span="5">{{
                  item.productionAmt | formatMoney
                }}</van-col>
              </van-row>
            </div>
            <div class="detail-btn">
              <van-button @click="toAreaReport('AREA_ONE')" plain
                >查看详情</van-button
              >
            </div>
          </div>

          <!-- 1-3类管理区域 -->
          <div class="content-item" v-if="levelCode >= 90">
            <div class="content-item-title">
              <span class="content-item-title-left">1-3类管理区域</span>
            </div>
            <div class="retail">
              <div class="retail-item">
                <div>
                  {{ areaOneToThree.areaOneProductionAmt | formatMoney }}
                </div>
                <div class="retail-item-desc">一类管理区域</div>
              </div>
              <span class="retail-item-line"></span>
              <div class="retail-item">
                <div>
                  {{ areaOneToThree.areaTwoProductionAmt | formatMoney }}
                </div>
                <div class="retail-item-desc">二类管理区域</div>
              </div>
              <span class="retail-item-line"></span>
              <div class="retail-item">
                <div>
                  {{ areaOneToThree.areaThreeProductionAmt | formatMoney }}
                </div>
                <div class="retail-item-desc">三类管理区域</div>
              </div>
            </div>
            <div class="unit-tag">
              <div
                class="unit-tag-item"
                :style="
                  `width:${getTagWidth(
                    areaOneToThree.tagSummary
                      ? areaOneToThree.tagSummary.focusCount
                      : 0
                  )}`
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">关注</span>
                </div>
                <span class="amount">{{
                  areaOneToThree.tagSummary
                    ? areaOneToThree.tagSummary.focusCount
                    : 0
                }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="
                  `background: #ECF5FF;color: #4D6ED1;width:${getTagWidth(
                    areaOneToThree.tagSummary
                      ? areaOneToThree.tagSummary.newDirCount
                      : 0
                  )}`
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">新督导</span>
                </div>
                <span class="amount">{{
                  areaOneToThree.tagSummary
                    ? areaOneToThree.tagSummary.newDirCount
                    : 0
                }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="
                  `background: #F1F2FF;color: #997BD6;width:${getTagWidth(
                    areaOneToThree.tagSummary
                      ? areaOneToThree.tagSummary.twoStarDirCount
                      : 0
                  )}`
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">双星督导</span>
                </div>
                <span class="amount">{{
                  areaOneToThree.tagSummary
                    ? areaOneToThree.tagSummary.twoStarDirCount
                    : 0
                }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="
                  `background: #FFF6EC;color: #FD9A3B;width:${getTagWidth(
                    areaOneToThree.tagSummary
                      ? areaOneToThree.tagSummary.pinkCarDirCount
                      : 0
                  )}`
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">粉车督导</span>
                </div>
                <span class="amount">{{
                  areaOneToThree.tagSummary
                    ? areaOneToThree.tagSummary.pinkCarDirCount
                    : 0
                }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="
                  `background: #FFECEC;color: #D56B6B;width:${getTagWidth(
                    areaOneToThree.tagSummary
                      ? areaOneToThree.tagSummary.seminarContestCount
                      : 0
                  )}`
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">研讨会竞赛</span>
                </div>
                <span class="amount">{{
                  areaOneToThree.tagSummary
                    ? areaOneToThree.tagSummary.seminarContestCount
                    : 0
                }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="
                  `background: #FFEBD8;color: #CD925C;width:${getTagWidth(
                    areaOneToThree.tagSummary
                      ? areaOneToThree.tagSummary.threeStarDirCount
                      : 0
                  )}`
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">海外游-三星</span>
                </div>
                <span class="amount">{{
                  areaOneToThree.tagSummary
                    ? areaOneToThree.tagSummary.threeStarDirCount
                    : 0
                }}</span>
              </div>
            </div>
            <div class="detail-btn">
              <van-button @click="toAreaReport('AREA_ONE_TO_THREE')" plain
                >查看详情</van-button
              >
            </div>
          </div>
          <!-- DIQ跟进 -->
          <div class="content-item" v-if="levelCode >= 60">
            <div class="content-item-title">
              <span class="content-item-title-left">DIQ跟进</span>
            </div>
            <div class="retail">
              <div class="retail-item">
                <div>{{ areadiq.diqMemberCount }}</div>
                <div class="retail-item-desc">DIQ总数</div>
              </div>
              <span class="retail-item-line"></span>
              <div class="retail-item">
                <div>{{ areadiq.orderMemberCount }}</div>
                <div class="retail-item-desc">已下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div class="retail-item">
                <div>{{ areadiq.noOrderMemberCount }}</div>
                <div class="retail-item-desc">未下单</div>
              </div>
            </div>
            <div class="detail-btn">
              <van-button plain @click="toDIQReport">查看详情</van-button>
            </div>
          </div>
        </div>
        <div class="bottom-btn">
          <van-button plain>电话</van-button>
          <div class="message-btn">
            <van-button plain>消息</van-button>
            <span class="tip">关心话术</span>
          </div>
        </div>
      </div>
      <div class="action-plan" v-show="false" @click="toActionPlan">
        <span class="process">13/21</span>
        <span class="label">行动计划</span>
      </div>
    </div>
  </div>
</template>
<script>
import { NavBar, Button, Dialog, Field, Tag, Icon, Col, Row } from "vant";
import {
  isIos,
  isIphoneX,
  closeWebview,
  xxxxxx,
  formatMoney,
} from "../../utils/index";
export default {
  data() {
    return {
      levelCode: 97,
      targetContactId: "",
      isIos: isIos(),
      isIphoneX: isIphoneX(),
      active: 0,
      monthKey: "",
      userInfo: {
        contactId: "20018733722",
      },
      income: {
        currentMonthIncomeAmt: null, //当月收入
        isSettingTarget: false, //目标收入
        targetIncomeAmt: null, //是否设置目标收入
      },
      retail: {
        rcProductionAmt: null, //RC产品点数+返利金额
        retailAmt: null, //金额
        productionAmt: null, //零售绩效
        rcOrderRetail: null, //RC订单原价 -- 本人订单
        rcRetailAmt: null, //RC订单金额
        bcRetailAmt: null, //BC订单金额
        bcRetailDiscount: null, //bc 折扣
        rcRetailDiscount: null, //rc 返利比
        availablePoints: null, //零售绩效分
        currentMonthExpiredPoints: null, //当月过期
      },
      diqunit: {
        productionAmt: null, //绩效
        noOrderMemberCount: null, //未下单人数
        orderMemberCount: null, //下单人数
        newMemberCount: null, //新成员
      },
      unit: {
        productionAmt: null, //绩效
        noOrderMemberCount: null, //未下单人数
        orderMemberCount: null, //下单人数
        newMemberCount: null, //新成员
        focusCount: null, //关注
        newJoinMemberCount: null, //新顾问【4个月内】
        sellerMemberCount: null, //销售型顾问
        leaderMemberCount: null, //领袖型顾问
        beautyMemberCount: null, //美丽顾问
        inactiveMemberCount: null, //睡美人
      },
      team: {
        productionAmt: null, //绩效
        noOrderMemberCount: null, //未下单人数
        orderMemberCount: null, //下单人数
        newMemberCount: null, //新成员
      },
      areadiq: {
        diqMemberCount: null, //diq总数
        noOrderMemberCount: null, //未下单人数
        orderMemberCount: null, //下单人数
      },
      areaOne: {
        areaOneProductionAmt: null, //绩效
        areaOneMemberCount: null, //人数
        members: [],
      },
      areaOneToThree: {
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
      isSelf: false, //是否是查看自己的个人详情页
    };
  },
  async created() {
    const { levelCode, targetContactId } = this.$route.query;
    this.targetContactId = targetContactId;
    this.levelCode = Number(levelCode);
    this.getUserInfo();
    this.getIncome();
    this.getRetail();
    this.getTeam();
    console.log(this.levelCode);
    if (this.levelCode === 50) {
      this.getDIQUnit();
    }
    if (this.levelCode >= 60) {
      this.getUnit();
      this.getAREADiq();
    }
    if (this.levelCode >= 70 && this.levelCode < 90) {
      this.getArea("AREA_ONE");
    }
    if (this.levelCode >= 90) {
      this.getArea("AREA_ONE_TO_THREE");
    }
  },
  mounted() {},
  methods: {
    back() {
      closeWebview();
    },
    toActionPlan() {
      let url = `${window.location.origin}/nbcActionPlan`;
      const params = {
        opaque: false,
      };
      this.$go(url, params);
    },
    toSetting() {
      let url = `${window.location.origin}/setting`;
      const params = {
        opaque: false,
        isSelf: this.isSelf,
        targetContactId: this.targetContactId,
      };
      this.$go(url, params);
    },

    inviteSetTarget() {
      Dialog.confirm({
        message: "是否邀请设置收入目标",
      })
        .then(() => {
          // on confirm
          this.share();
        })
        .catch(() => {
          // on cancel
        });
    },
    toIncomeTargetEvaluate() {
      let path = "team";
      if (this.userInfo.careerLevelCode < 60) {
        path = "team";
      } else if (this.userInfo.careerLevelCode >= 60) {
        path = "unit";
      }
      let url = `${window.location.origin}/${path}`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        isSelf: this.isSelf,
        levelCode: this.userInfo.careerLevelCode,
        targetContactId: this.userInfo.contactId,
      };
      this.$go(url, params);
    },
    toRetailReport() {
      let url = `${window.location.origin}/retail_history`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        isSelf: this.isSelf,
        targetContactId: this.targetContactId,
      };
      this.$go(url, params);
    },
    toOrderList() {
      let url = `${window.location.origin}/retail`;
      const params = {
        amount: this.income.currentMonthIncomeAmt,
        opaque: false,
        isSelf: this.isSelf,
        targetContactId: this.targetContactId,
      };
      this.$go(url, params);
    },
    toUnitReport() {
      let url = `${window.location.origin}/unit`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        isSelf: this.isSelf,
        targetContactId: this.targetContactId,
      };
      this.$go(url, params);
    },
    toPrepUnitReport() {
      let url = `${window.location.origin}/prep_unit`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        targetContactId: this.targetContactId,
        isSelf: this.isSelf,
      };
      this.$go(url, params);
    },
    toUnitHistory() {
      let url = `${window.location.origin}/unit_history`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        isSelf: this.isSelf,
        targetContactId: this.targetContactId,
      };
      this.$go(url, params);
    },
    toTeamReport() {
      let url = `${window.location.origin}/team`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        levelCode: this.levelCode,
        targetContactId: this.targetContactId,
        isSelf: this.isSelf,
      };
      this.$go(url, params);
    },
    toDIQReport() {
      let url = `${window.location.origin}/diq`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        levelCode: this.levelCode,
        targetContactId: this.targetContactId,
        isSelf: this.isSelf,
      };
      this.$go(url, params);
    },
    toAreaReport(type) {
      let url = `${window.location.origin}/area`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        isSelf: this.isSelf,
        businessType: type,
        targetContactId: this.targetContactId,
      };
      this.$go(url, params);
    },
    getTagWidth(amount) {
      // amount = 0 width = 50%
      // amount+1 width = 50% + 5%
      // amount >= 10 width = 100%
      if (!amount) return "50%";
      let per = amount >= 10 ? 50 : amount * 5;
      return `${50 + per}%`;
    },
    formatter(value) {
      return formatMoney(value);
    },
    async getUserInfo() {
      const params = {
        contactId: this.targetContactId,
      };
      const { data } = await this.$request.get(`${this.$ctx.baseApi}/profile`, {
        params,
      });
      console.log(data);
      if (data) {
        this.userInfo = data;
        if (this.userInfo.contactId === this.targetContactId) {
          this.isSelf = true;
        } else {
          this.isSelf = false;
        }
      }
    },
    // 收入
    async getIncome() {
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/dashboards/income`
      );
      if (data) {
        this.income = data;
        this.monthKey = data.monthKey;
      }
    },
    setTargetIncome() {
      Dialog.confirm({
        message: "是否邀请设置收入目标",
      })
        .then(() => {
          // on confirm
          this.share();
        })
        .catch(() => {
          // on cancel
        });
    },
    async share() {
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
      let baseApi = this.$ctx.baseApi;
      const inviteLinkData = await this.$request.post(`${baseApi}/invite/link`);
      console.log(inviteLinkData);
      let shareUrl = `${this.$ctx.baseShareUrl}?linkKey=${inviteLinkData.data.linkKey}`;
      const shareArg = {
        kind: "media",
        title: "写下你的收入愿望，我们一起实现她",
        description: "愿望无论大小，说不定就实现了呢？",
        thumbnail:
          "https://dev-community-s3.marykay.com.cn/DEV/MyBizIntouch_Content_Cms/LibraryResource/20210917102605_661.png",
        mediatype: "webpage",
        scene: "WXSceneSession",
        url: shareUrl,
      };
      this.$jsBridge.shareToWechat(shareArg);
    },
    async getRetail() {
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/dashboards/retail`
      );
      if (data) {
        this.retail = data.data.retail;
      }
    },
    async getDIQUnit() {
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/dashboards/diqunit`
      );
      if (data) {
        this.diqunit = data;
      }
    },
    async getUnit() {
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/dashboards/unit`
      );
      if (data) {
        this.unit = data;
      }
    },
    async getTeam() {
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/dashboards/team`
      );
      if (data) {
        this.team = data;
      }
    },
    async getAREADiq() {
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/dashboards/areaDiq`
      );
      if (data) {
        this.areadiq = data;
      }
    },
    async getArea(type) {
      let businessType = type;
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/dashboards/area`,
        {
          params: {
            businessType: businessType,
          },
        }
      );
      if (data.areaOne) {
        this.areaOne = data.areaOne;
      }
      if (data.areaOneToThree) {
        this.areaOneToThree = data.areaOneToThree;
      }
    },
  },
  components: {
    NavBar,
    "van-button": Button,
    "van-dialog": Dialog.Component,
    "van-field": Field,
    "van-tag": Tag,
    "van-icon": Icon,
    "van-row": Row,
    "van-col": Col,
  },
};
</script>
<style lang="less" scoped>
.coach-home {
  background-color: #ee4d9b;
  &-content {
    padding-top: env(safe-area-inset-top);
    margin-top: 80px;
  }
  .user-info {
    text-align: center;
    background-color: #ee4d9b;
    padding-bottom: 30px;
    position: relative;
    &-avatar {
      width: 96px;
      height: 96px;
      border: 5px solid #ffffff;
      border-radius: 50%;
      margin-bottom: 12px;
    }
    &-name {
      font-size: 34px;
      color: #fff;
      line-height: 48px;
      margin-bottom: 7px;
    }
    &-info {
      font-size: 24px;
      line-height: 34px;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 25px;
      .line {
        height: 22px;
        width: 1px;
        background-color: #fff;
        margin: 0 15px;
      }
    }
    &-tag {
      color: #fff;
      .van-tag {
        font-size: 20px;
        line-height: 32px;
      }
    }
    .see-more {
      position: absolute;
      background-color: #fff;
      color: #f16eae;
      font-size: 28px;
      line-height: 48px;
      padding: 0 30px;
      border-radius: 24px 0 0 24px;
      right: 0;
      top: 119px;
    }
  }
  .content {
    background-color: #fff;
    padding: 16px 22px;
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
          display: flex;
          align-items: center;
          &::before {
            content: " ";
            width: 7px;
            height: 28px;
            background-color: #f16eae;
            position: absolute;
            left: -22px;
            top: 0;
          }
          .target-income {
            color: #f16eae;
            font-size: 34px;
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
      .performance {
        font-size: 42px;
        color: #f16eae;
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        &-label {
          font-size: 22px;
          color: #7f7f7f;
          margin-right: 18px;
        }
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
    .message {
      margin-top: 0;
      padding: 30px;
      border: 16px 16px 0 0;
      &-item {
        display: flex;
        align-items: center;
        font-size: 22px;
        color: #484848;
        line-height: 32px;
        img {
          width: 22px;
          height: 28px;
          margin-right: 20px;
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
    .order {
      display: flex;
      justify-content: space-between;
      padding: 40px 40px 30px 40px;
      &-item {
        border: 1px solid #dedede;
        box-sizing: border-box;
        width: 177px;
        height: 186px;
        border-radius: 18px;
        font-size: 18px;
        color: #7f7f7f;

        &-tag {
          width: 114px;
          height: 28px;
          background: #fd9ccb;
          border-radius: 0px 23px 0px 23px;
          color: #fff;
          text-align: center;
          line-height: 28px;
          margin-top: -1px;
          margin-left: 13px;
        }
        &-label {
          color: #181818;
          font-size: 22px;
          margin-top: 16px;
          margin-bottom: 17px;
          text-align: center;
        }
        &-price {
          font-size: 32px;
          color: #f16eae;
          margin-bottom: 16px;
          text-align: center;
        }
        &-original-price {
          text-align: center;
        }
        &-desc {
          text-align: center;
          // font-size: 16px;
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
    .table {
      border-top: 1px solid #f1f1f1;
      padding: 0 36px 0 43px;
      &-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: center;
        border-bottom: 1px dashed #e6e6e6;
        height: 80px;
        box-sizing: content-box;
        font-size: 26px;
        color: #484848;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50px;
          margin-right: 19px;
        }
        &-2 {
          text-align: left;
          display: flex;
          align-items: center;
        }
        .no-set-btn {
          .van-button {
            padding: 0 16px;
            border-radius: 12px;
            border-color: #f16eae;
            height: 36px;
            line-height: 36px;
            color: #f16eae;
            font-size: 22px;
            background: #fff7fb;
          }
        }
      }
      &-item-header {
        font-size: 24px;
        color: #b2b2b2;
        border-bottom: none;
        height: 28px;
        margin: 20px 0 1px 0;
      }
    }
    .bottom-btn {
      display: flex;
      justify-content: space-between;
      margin: 87px 30px 51px;
      .van-button {
        width: 295px;
        height: 62px;
        border-radius: 31px;
        background-color: #f16eae;
        color: #fff;
      }
      .message-btn {
        position: relative;
        .tip {
          position: absolute;
          background-image: url("../../images/tip_bg.png");
          background-size: 100% 100%;
          width: 125px;
          line-height: 50px;
          color: #f16eae;
          top: -57px;
          left: 147px;
          font-size: 24px;
          text-align: center;
        }
      }
    }
  }
  .action-plan {
    position: fixed;
    right: 0;
    top: 500px;
    background: url("../../images/actionplan.png") no-repeat;
    background-size: 100% 100%;
    width: 153px;
    height: 143px;
    text-align: center;
    .process {
      display: inline-block;
      width: 100%;
      font-size: 26px;
      line-height: 37px;
      color: #f16eae;
      margin-top: 55px;
    }
    .label {
      display: inline-block;
      font-size: 20px;
      line-height: 22px;
      color: #fff;
      margin-top: 19px;
    }
  }
  .set-target {
    padding: 0 10px;
    height: 38px;
    background-color: #fff;
    color: #f16eae;
    font-size: 26px;
    border-color: #f16eae;
    border-radius: 7px;
  }
}
.isAndroid {
  .coach-home-content {
    margin-top: 135px;
  }
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
.target_dialog {
  background-color: transparent;
  .target_content {
    position: relative;
    top: 0;
    width: 542px;
    height: 662px;
    background-image: url("../../images/index/target_bg.png");
    background-size: 100% 100%;
    text-align: center;
    &-title {
      width: 100%;
      position: absolute;
      font-size: 45px;
      top: 190px;
      font-weight: bold;
      color: #181818;
    }
    &-input {
      position: absolute;
      top: 278px;
      width: 213px;
      left: 170px;
      border-bottom: 3px solid #f16eae;
      .van-field {
        background-color: transparent;
        font-size: 40px;
        line-height: 56px;
        padding: 0;
        /deep/.van-field__control {
          text-align: center;
          color: #f16eae;
        }
      }
    }
    &-tip {
      width: 100%;
      position: absolute;
      top: 382px;
      text-align: left;
      display: flex;
      align-items: flex-start;
      img {
        width: 30px;
        height: 30px;
        margin-left: 28px;
        margin-right: 8px;
      }
      font-size: 24px;
      line-height: 28px;
      color: #181818;
    }
    &-btn {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .btn {
        background: linear-gradient(180deg, #f9a7d7 0%, #f16eae 100%);
        border-radius: 53px;
        height: 76px;
        width: 417px;
        font-size: 30px;
        color: #fff;
      }
    }
  }
  .cer_close {
    margin: 50/7.5vw auto 0;
    width: 58/7.5vw;
    height: 58/7.5vw;
    img {
      width: 100%;
    }
  }
}
/deep/.van-nav-bar {
  background-color: #ee4d9b;
  .van-nav-bar__content {
    height: 80px;
    .van-nav-bar__left {
      display: flex;
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
