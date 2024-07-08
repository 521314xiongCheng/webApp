<template>
  <div class="coach-home" :class="{ isAndroid: !isIos }">
    <div class="coach-home-content">
      <van-sticky>
        <NavBar
          left-text="返回"
          title=""
          :border="false"
          :safe-area-inset-top="true"
          @click-left="back"
        >
          <template #left>
            <img
              class="back_btn"
              src="../../images/index/icon_back.png"
              alt=""
            />
          </template>
          <template #right>
            <img
              class="icon-calc"
              @click="goCalc"
              src="../../images/calc.png"
              alt=""
            />
          </template>
        </NavBar>
      </van-sticky>
      <!-- <div class="back_btn" @click="back">
        <img
          class="back_btn_icon"
          src="../../images/index/icon_back.png"
          alt=""
        />
      </div>
      <div class="goCalc" @click="goCalc()">
        <img src="../../images/calc.png" alt="" />
      </div> -->
      <div class="user-info">
        <div class="avatar-wrap">
          <img
            class="user-info-avatar"
            @click="back"
            :src="
              `https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${userInfo.contactId}/avatar?size=60`
            "
            alt=""
          />
          <img
            class="focus"
            v-if="userInfo.isFocus"
            src="../../images/focus.png"
            alt=""
          />
        </div>
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
                v-if="purview"
                @click="toIncomeTargetEvaluate"
                color="#F16EAE"
              />
            </div>
          </div>
          <!-- 当月零售 -->
          <div class="content-item" @click="toOrderList">
            <div class="content-item-title">
              <span class="content-item-title-left">当月零售</span>
              <van-button
                class="history"
                text="查看历史"
                @click.stop="toRetailReport"
              >
                <template #icon>
                  <img src="../../images/index/icon_history.png" alt="" />
                </template>
              </van-button>
            </div>
            <div class="retail">
              <div class="retail-item">
                <div class="bold">
                  ¥{{ retail.rcProductionAmt | formatMoney }}
                </div>
                <div class="retail-item-desc">点数+返利</div>
              </div>
              <span class="retail-item-line"></span>
              <div class="retail-item">
                <div class="bold">¥{{ retail.retailAmt | formatMoney }}</div>
                <div class="retail-item-desc">金额</div>
              </div>
              <span class="retail-item-line"></span>
              <div class="retail-item">
                <div class="bold">{{ retail.productionAmt | formatMoney }}</div>
                <div class="retail-item-desc">绩效</div>
              </div>
            </div>
            <div class="order">
              <div class="order-item">
                <div class="order-item-tag">
                  折扣：{{ retail.rcRetailDiscount * 100 }}%
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
                  折扣：{{ retail.bcRetailDiscount * 100 }}%
                </div>
                <div class="order-item-label">顾问订单</div>
                <div class="order-item-price">
                  ¥{{ retail.bcRetailAmt | formatMoney }}
                </div>
                <div class="order-item-original-price"></div>
              </div>
              <div class="order-item" @click.stop="toPointHistory">
                <div class="order-item-tag placeholder"></div>
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
          <div
            class="content-item content-item-team"
            v-if="levelCode === 50"
            @click="toPrepUnitReport"
          >
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
              <van-button v-if="purview" plain>查看详情</van-button>
            </div>
          </div>
          <!-- 管理沙龙 -->
          <div
            class="content-item"
            v-if="levelCode >= 60"
            @click="toUnitReport()"
          >
            <div class="content-item-title">
              <span class="content-item-title-left">
                管理沙龙
                <van-icon
                  @click.stop="tagsPopup"
                  class="icon-info"
                  name="info"
                />
              </span>
              <div class="history" @click.stop="toUnitHistory" v-if="purview">
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
                @click.stop="toUnitReport('1')"
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
                @click.stop="toUnitReport('2')"
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
                @click.stop="toUnitReport('5')"
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">幸福小店主</span>
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
                @click.stop="toUnitReport('3')"
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">销售顾问</span>
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
                @click.stop="toUnitReport('4')"
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">教练顾问</span>
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
                @click.stop="toUnitReport('6')"
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
              <van-button v-if="purview" plain>更多沙龙详情</van-button>
            </div>
          </div>
          <!-- 美容顾问 -->
          <div class="content-item content-item-team" @click="toTeamReport">
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
              <van-button v-if="purview" plain>查看详情</van-button>
            </div>
          </div>
          <!-- 一类管理区域 -->
          <div
            class="content-item"
            v-if="levelCode >= 70 && levelCode < 85"
            @click="toAreaReport('AREA_ONE')"
          >
            <div class="content-item-title">
              <span class="content-item-title-left">
                一类管理区域
                <van-icon
                  @click.stop="tagsPopup"
                  class="icon-info"
                  name="info"
                />
              </span>
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
                <van-col span="5">沙龙绩效</van-col>
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
                  <van-button plain @click.stop="inviteSetTarget"
                    >未设置</van-button
                  >
                </van-col>
                <van-col span="5">{{
                  item.productionAmt | formatMoney
                }}</van-col>
              </van-row>
            </div>
            <div class="detail-btn">
              <van-button v-if="purview" plain>查看详情</van-button>
            </div>
          </div>
          <!-- 1-2类管理区域 -->
          <div
            class="content-item"
            v-if="levelCode >= 85 && levelCode <= 87"
            @click="toAreaReport('AREA_ONE_TO_TWO')"
          >
            <div class="content-item-title">
              <span class="content-item-title-left">
                1-2类管理区域
                <van-icon
                  @click.stop="tagsPopup"
                  class="icon-info"
                  name="info"
                />
              </span>
              <label class="tip">（绩效包含非直接管理区域）</label>
            </div>
            <div class="retail">
              <div class="retail-item">
                <div>
                  {{ areaOneToTwo.areaOneProductionAmt | formatMoney }}
                </div>
                <div class="retail-item-desc">一类管理区域</div>
              </div>
              <span class="retail-item-line"></span>
              <div class="retail-item">
                <div>
                  {{ areaOneToTwo.areaTwoProductionAmt | formatMoney }}
                </div>
                <div class="retail-item-desc">二类管理区域</div>
              </div>
            </div>
            <div class="unit-tag">
              <div
                class="unit-tag-item"
                :style="
                  `width:${getTagWidth(
                    areaOneToTwo.tagSummary
                      ? areaOneToTwo.tagSummary.focusCount
                      : 0
                  )}`
                "
                @click.stop="toAreaReport('AREA_ONE_TO_TWO', '1')"
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
                  areaOneToTwo.tagSummary
                    ? areaOneToTwo.tagSummary.focusCount
                    : 0
                }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="
                  `background: #ECF5FF;color: #4D6ED1;width:${getTagWidth(
                    areaOneToTwo.tagSummary
                      ? areaOneToTwo.tagSummary.newDirCount
                      : 0
                  )}`
                "
                @click.stop="toAreaReport('AREA_ONE_TO_TWO', '7')"
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
                  areaOneToTwo.tagSummary
                    ? areaOneToTwo.tagSummary.newDirCount
                    : 0
                }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="
                  `background: #F1F2FF;color: #997BD6;width:${getTagWidth(
                    areaOneToTwo.tagSummary
                      ? areaOneToTwo.tagSummary.twoStarDirCount
                      : 0
                  )}`
                "
                @click.stop="toAreaReport('AREA_ONE_TO_TWO', '8')"
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
                  areaOneToTwo.tagSummary
                    ? areaOneToTwo.tagSummary.twoStarDirCount
                    : 0
                }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="
                  `background: #FFF6EC;color: #FD9A3B;width:${getTagWidth(
                    areaOneToTwo.tagSummary
                      ? areaOneToTwo.tagSummary.pinkCarDirCount
                      : 0
                  )}`
                "
                @click.stop="toAreaReport('AREA_ONE_TO_TWO', '9')"
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
                  areaOneToTwo.tagSummary
                    ? areaOneToTwo.tagSummary.pinkCarDirCount
                    : 0
                }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="
                  `background: #FFECEC;color: #D56B6B;width:${getTagWidth(
                    areaOneToTwo.tagSummary
                      ? areaOneToTwo.tagSummary.seminarContestCount
                      : 0
                  )}`
                "
                @click.stop="toAreaReport('AREA_ONE_TO_TWO', '10')"
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
                  areaOneToTwo.tagSummary
                    ? areaOneToTwo.tagSummary.seminarContestCount
                    : 0
                }}</span>
              </div>
              <div
                class="unit-tag-item"
                :style="
                  `background: #FFEBD8;color: #CD925C;width:${getTagWidth(
                    areaOneToTwo.tagSummary
                      ? areaOneToTwo.tagSummary.threeStarDirCount
                      : 0
                  )}`
                "
                @click.stop="toAreaReport('AREA_ONE_TO_TWO', '11')"
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
                  areaOneToTwo.tagSummary
                    ? areaOneToTwo.tagSummary.threeStarDirCount
                    : 0
                }}</span>
              </div>
            </div>
            <div class="detail-btn">
              <van-button plain>查看详情</van-button>
            </div>
          </div>
          <!-- 1-3类管理区域 -->
          <div
            class="content-item"
            v-if="levelCode >= 90"
            @click="toAreaReport('AREA_ONE_TO_THREE')"
          >
            <div class="content-item-title">
              <span class="content-item-title-left">
                1-3类管理区域
                <van-icon
                  @click.stop="tagsPopup"
                  class="icon-info"
                  name="info"
                />
              </span>
              <label class="tip">（绩效包含非直接管理区域）</label>
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
                @click.stop="toAreaReport('AREA_ONE_TO_THREE', '1')"
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
                @click.stop="toAreaReport('AREA_ONE_TO_THREE', '7')"
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
                @click.stop="toAreaReport('AREA_ONE_TO_THREE', '8')"
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">双星目标</span>
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
                @click.stop="toAreaReport('AREA_ONE_TO_THREE', '9')"
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">粉车目标</span>
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
                @click.stop="toAreaReport('AREA_ONE_TO_THREE', '10')"
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">研讨会目标</span>
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
                @click.stop="toAreaReport('AREA_ONE_TO_THREE', '11')"
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle1.png"
                    alt=""
                  />
                  <span class="label">海外游-三星目标</span>
                </div>
                <span class="amount">{{
                  areaOneToThree.tagSummary
                    ? areaOneToThree.tagSummary.threeStarDirCount
                    : 0
                }}</span>
              </div>
            </div>
            <div class="detail-btn">
              <van-button v-if="purview" plain>查看详情</van-button>
            </div>
          </div>
          <!-- DIQ跟进 -->
          <div class="content-item" v-if="levelCode >= 60" @click="toDIQReport">
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
              <van-button v-if="purview" plain>查看详情</van-button>
            </div>
          </div>
        </div>
        <div class="bottom-btn">
          <van-button @click="call" plain>电话</van-button>
          <div class="message-btn">
            <van-button plain @click="toMessage">消息</van-button>
            <span
              v-show="!isEmployee && userInfo.tags.length"
              class="tip"
              @click="aboutPopup"
              >关心话术</span
            >
          </div>
        </div>
      </div>
      <div class="action-plan" v-show="false" @click="toActionPlan">
        <span class="process">13/21</span>
        <span class="label">行动计划</span>
      </div>
    </div>

    <!-- 关心话术popup -->
    <van-popup
      v-model="aboutPopupShow"
      position="bottom"
      style="height: 80%"
      round
      closeable
    >
      <div class="aboutBox">
        <h4>
          用关心话术联系<span>({{ userInfo.name }})</span>
        </h4>
        <div class="item" v-show="aboutPopupData.topic1.length">
          <p>宣告身份</p>
          <div v-for="(item, index) in aboutPopupData.topic1" :key="index">
            <div
              v-html="nameColor(item, `topic1${index}`)"
              class="msg"
              :class="{ msgChecked: profileChecked == `topic1${index}` }"
              @click="profileContact(`topic1${index}`, item)"
            ></div>
            <img
              src="../../images/profileMail.png"
              alt=""
              v-show="profileChecked == `topic1${index}`"
              @click="returnMail(item)"
            />
          </div>
        </div>
        <div class="item" v-show="aboutPopupData.topic2.length">
          <p>约面谈/美丽课/公开课</p>
          <div v-for="(item, index) in aboutPopupData.topic2" :key="index">
            <div
              v-html="nameColor(item, `topic2${index}`)"
              class="msg"
              :class="{ msgChecked: profileChecked == `topic2${index}` }"
              @click="profileContact(`topic2${index}`, item)"
            ></div>
            <img
              src="../../images/profileMail.png"
              alt=""
              v-show="profileChecked == `topic2${index}`"
              @click="returnMail(item)"
            />
          </div>
        </div>
        <div class="item" v-show="aboutPopupData.topic3.length">
          <p>生日，MK生日</p>
          <div v-for="(item, index) in aboutPopupData.topic3" :key="index">
            <div
              v-html="nameColor(item, `topic3${index}`)"
              class="msg"
              :class="{ msgChecked: profileChecked == `topic3${index}` }"
              @click="profileContact(`topic3${index}`, item)"
            ></div>
            <img
              src="../../images/profileMail.png"
              alt=""
              v-show="profileChecked == `topic3${index}`"
              @click="returnMail(item)"
            />
          </div>
        </div>
        <div class="item" v-show="aboutPopupData.topic4.length">
          <p>关怀/问候/致谢</p>
          <div v-for="(item, index) in aboutPopupData.topic4" :key="index">
            <div
              v-html="nameColor(item, `topic4${index}`)"
              class="msg"
              :class="{ msgChecked: profileChecked == `topic4${index}` }"
              @click="profileContact(`topic4${index}`, item)"
            ></div>
            <img
              src="../../images/profileMail.png"
              alt=""
              v-show="profileChecked == `topic4${index}`"
              @click="returnMail(item)"
            />
          </div>
        </div>
        <div class="item" v-show="aboutPopupData.topic5.length">
          <p>业务/挑战/目标计划 提醒</p>
          <div v-for="(item, index) in aboutPopupData.topic5" :key="index">
            <div
              v-html="nameColor(item, `topic5${index}`)"
              class="msg"
              :class="{ msgChecked: profileChecked == `topic5${index}` }"
              @click="profileContact(`topic5${index}`, item)"
            ></div>
            <img
              src="../../images/profileMail.png"
              alt=""
              v-show="profileChecked == `topic5${index}`"
              @click="returnMail(item)"
            />
          </div>
        </div>
        <div class="item" v-show="aboutPopupData.topic6.length">
          <p>邀约/售后/延伸</p>
          <div v-for="(item, index) in aboutPopupData.topic6" :key="index">
            <div
              v-html="nameColor(item, `topic6${index}`)"
              class="msg"
              :class="{ msgChecked: profileChecked == `topic6${index}` }"
              @click="profileContact(`topic6${index}`, item)"
            ></div>
            <img
              src="../../images/profileMail.png"
              alt=""
              v-show="profileChecked == `topic6${index}`"
              @click="returnMail(item)"
            />
          </div>
        </div>
        <div class="item" v-show="aboutPopupData.topic7.length">
          <p>促销/活动提醒</p>
          <div v-for="(item, index) in aboutPopupData.topic7" :key="index">
            <div
              v-html="nameColor(item, `topic7${index}`)"
              class="msg"
              :class="{ msgChecked: profileChecked == `topic7${index}` }"
              @click="profileContact(`topic7${index}`, item)"
            ></div>
            <img
              src="../../images/profileMail.png"
              alt=""
              v-show="profileChecked == `topic7${index}`"
              @click="returnMail(item)"
            />
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 编辑话术 -->
    <van-popup v-model="editPopup" style="background: none">
      <div class="editBox">
        <div class="title">分享话术</div>
        <div class="msg">
          <div class="lineBox">
            <van-field v-model="editText" autosize rows="1" type="textarea" />
          </div>
        </div>
        <div class="share">
          <p>分享至:</p>
          <div class="shareBtn">
            <div class="item" @click="wechatShare">
              <img src="../../images/wechat@2x.png" alt="" />
              <p>微信好友</p>
            </div>
            <div class="item" @click="smsShare">
              <img src="../../images/sms@2x.png" alt="" />
              <p>短信好友</p>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 标签定义说明 -->
    <van-popup v-model="tagsPopupShow" style="background: none">
      <div class="tagsBox">
        <div class="tagsMsg">
          <p><span class="tagsTitle">关注：</span>标注为重点的美容顾问</p>
          <p>
            <span class="tagsTitle">新顾问：</span>加入<span class="pink"
              >3</span
            >个月
          </p>
          <p>
            <span class="tagsTitle">销售顾问：</span
            ><span class="pink">3</span>个月内至少<span class="pink">1</span
            >个RC订单，并且有个人订单
          </p>
          <p>
            <span class="tagsTitle">教练顾问：</span>当前职级<span class="pink"
              >20-50</span
            >
          </p>
          <p>
            <span class="tagsTitle">幸福小店主：</span>最近<span class="pink"
              >6</span
            >个月只有个人订单,没有销售和开发
          </p>
          <p>
            <span class="tagsTitle">睡美人：</span>最近<span class="pink"
              >6</span
            >个月没有个人和RC订单
          </p>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import {
  NavBar,
  Button,
  Dialog,
  Field,
  Tag,
  Icon,
  Col,
  Row,
  Popup,
  Toast,
  Sticky,
} from "vant";
import {
  isIos,
  isIphoneX,
  closeWebview,
  xxxxxx,
  formatMoney,
  createQuery,
} from "../../utils/index";
import storage from "good-storage";
import horizontalScreen from "../../mixin/horizontalScreen";

export default {
  mixins: [horizontalScreen],
  data() {
    return {
      levelCode: 97,
      targetContactId: "",
      isIos: isIos(),
      isIphoneX: isIphoneX(),
      active: 0,
      monthKey: "",
      aboutShow: false,
      tagsPopupShow: false,
      userInfo: {
        contactId: "20018733722",
        tags: [],
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
        sellerMemberCount: null, //销售顾问
        leaderMemberCount: null, //教练顾问
        beautyMemberCount: null, //幸福小店主
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
      areaOneToTwo: {
        areaOneProductionAmt: null, //一类管理区域绩效
        areaTwoProductionAmt: null, //二类管理区域绩效
        tagSummary: {
          focusCount: null, //关注
          newDirCount: null, //新督导
          twoStarDirCount: null, //双星督导
          pinkCarDirCount: null, //粉车督导
          seminarContestCount: null, //研讨会竞赛
          threeStarDirCount: null, //海外游-三星督导
        },
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
      aboutPopupShow: false,
      aboutPopupData: {
        name: "",
        type: "",
        topic1: [],
        topic2: [],
        topic3: [],
        topic4: [],
        topic5: [],
        topic6: [],
        topic7: [],
      },
      profileChecked: "",
      accountType: "",
      ImpersonatedInfo: {},
      isEmployee: false, //是否是员工账号查看
      editPopup: false,
      editText: "",
    };
  },
  computed: {
    purview() {
      return (
        (this.ImpersonatedInfo && this.ImpersonatedInfo.levelCode >= 60) ||
        this.accountType == "operation"
      );
    },
  },
  async created() {
    const {
      levelCode,
      targetContactId,
      accountType,
      monthKey,
    } = this.$route.query;
    this.monthKey = monthKey;
    this.ImpersonatedInfo = storage.get("ImpersonatedInfo");
    if (this.ImpersonatedInfo) {
      let ImpersonatedContactID = this.ImpersonatedInfo.targetContactId;
      if (Number(ImpersonatedContactID) === Number(targetContactId)) {
        this.isSelf = true;
      } else {
        this.isSelf = false;
      }
    } else {
      this.isSelf = false;
    }
    this.targetContactId = targetContactId;
    this.levelCode = Number(levelCode);
    this.accountType = accountType;
    this.initData();
    this.isEmployee = this.$route.query.isEmployee;
  },
  mounted() {
    // 从搜索页返回时需要刷新头部数据
    const onFronted = (data) => {
      this.initData();
      this.resetToPortraitScreen();
    };
    this.$jsBridge.onFronted(onFronted);
  },
  methods: {
    goCalc() {
      let url = `${window.location.origin}/calculate`;
      const params = {
        opaque: false,
        isSelf: this.isSelf,
        targetContactId: this.targetContactId,
        levelCode: this.levelCode,
      };
      this.$go(url, params);
    },
    initData() {
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
      if (this.levelCode >= 70 && this.levelCode < 85) {
        this.getArea("AREA_ONE");
      }
      if (this.levelCode >= 85 && this.levelCode <= 87) {
        this.getArea("AREA_ONE_TO_TWO");
      }
      if (this.levelCode >= 90) {
        this.getArea("AREA_ONE_TO_THREE");
      }
    },
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
    toPointHistory() {
      // 其他项目团队链接 不支持员工账号
      return;
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
    toUnitReport(tagId) {
      if (!this.purview) return;
      let url = `${window.location.origin}/unit`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        isSelf: this.isSelf,
        targetContactId: this.targetContactId,
        levelCode: this.levelCode,
      };
      if (tagId) {
        params.tagId = tagId;
      }
      this.$go(url, params);
    },
    toPrepUnitReport() {
      if (!this.purview) return;
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
      if (!this.purview) return;
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
      if (!this.purview) return;
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
    toAreaReport(type, tagId) {
      if (!this.purview) return;
      let url = `${window.location.origin}/area`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        isSelf: this.isSelf,
        businessType: type,
        targetContactId: this.targetContactId,
      };
      if (tagId) {
        params.tagId = tagId;
      }
      this.$go(url, params);
    },
    getTagWidth(amount) {
      // amount = 0 width = 60%
      // amount+1 width = 60% + 5%
      // amount >= 8 width = 100%
      if (!amount) return "60%";
      let per = amount >= 8 ? 40 : amount * 5;
      return `${60 + per}%`;
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
      if (this.accountType === "operation" && this.levelCode < 60) {
        this.$toast("抱歉，暂时不支持对她进行操作～");
        return;
      }
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
      if (data.areaOneToTwo) {
        this.areaOneToTwo = data.areaOneToTwo;
      }
    },
    call() {
      if (!this.userInfo.mobile) return;
      window.location.href = `tel:${this.userInfo.mobile}`;
    },
    aboutPopup() {
      this.getAbout();
      this.aboutPopupShow = true;
    },
    // 关心话术
    async getAbout() {
      let type = this.userInfo.careerLevelCode < 60 ? 1 : 2;
      let tagIds = this.userInfo.tags.map((item) => {
        return item.tagId;
      });
      let query = {
        contactId: this.targetContactId || this.userInfo.contactId,
        type: type,
        tagIds: tagIds,
      };
      console.log(query);
      let params = createQuery(query);
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/speechcraft?${params}`
      );
      if (data) {
        this.aboutPopupData = data;
      }
    },
    nameColor(value, color) {
      // 处理名字变色
      color = color == this.profileChecked ? "#fff" : "#F16EAE";
      let name = this.aboutPopupData.name;
      let newName = `<span style="color: ${color};">${name}</span>`;
      value = value.replace(name, newName);
      return value;
    },
    profileContact(value, text) {
      this.profileChecked = this.profileChecked == value ? null : value;
      this.editText = text;
      this.editPopup = true;
    },
    async wechatShare() {
      let args = {
        kind: "text",
        scene: "session",
        text: this.editText,
      };
      console.log("args", args);
      const shareData = await this.$jsBridge.shareToWechat(args);
      console.log("shareData", shareData);
    },
    async smsShare() {
      if (xxxxxx) {
        const data = await this.$jsBridge.share({
          text: this.editText,
        });
      }
    },
    async returnMail(value) {
      // console.log(this.isIos,this.userInfo.mobile,value);
      // if (this.isIos) {
      //   window.location.href = `sms:${this.userInfo.mobile}&body=${value}`
      // } else {
      //   window.location.href = `sms:${this.userInfo.mobile}?body=${value}`
      // }
      // if (navigator.canShare) {
      //   navigator.share({
      //     text: value,
      //   })
      //   .then(() => Toast.success('分享成功'))
      //   .catch((error) => Toast.fail('分享失败'));
      // } else {
      //   Toast.fail('当前浏览器不支持')
      // }
      if (xxxxxx) {
        const data = await this.$jsBridge.share({
          text: value,
        });
        console.log("share", data);
      }
    },
    toMessage() {
      window.location.href = `sms:${this.userInfo.mobile}`;
    },
    tagsPopup() {
      this.tagsPopupShow = true;
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
    "van-popup": Popup,
    "van-sticky": Sticky,
  },
};
</script>
<style lang="less" scoped>
.coach-home {
  background-color: #ee4d9b;
  &-content {
    // padding-top: env(safe-area-inset-top);
    // margin-top: 80px;
    position: relative;
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
    .avatar-wrap {
      position: relative;
      width: 96px;
      margin: 0 auto;
      .focus {
        position: absolute;
        width: 34px;
        height: 32px;
        top: 0;
        right: -5px;
      }
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
        padding: 0 20px;
        border-radius: 8px;
        height: 32px;
        line-height: 32px;
        font-size: 20px;
        margin: 0 11px;
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
      top: 80px;
    }
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
        padding: 20px 40px;
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
          .icon-info {
            color: #f99e79;
            margin-left: 10px;
          }
          .target-income {
            color: #f16eae;
            font-size: 34px;
          }
        }
        .tip {
          font-size: 22px;
          color: #7f7f7f;
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
        margin-bottom: 25px;
        &-label {
          font-size: 22px;
          color: #7f7f7f;
          margin-right: 18px;
        }
      }
      .detail-btn {
        text-align: center;
        min-height: 40px;
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
        flex: 1;
        font-size: 42px;
        color: #484848;
        // font-weight: bold;
        &-desc {
          font-size: 22px;
          color: #7f7f7f;
          font-weight: normal;
          margin-top: 20px;
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
        .placeholder {
          background-color: #fff;
          height: 27px;
          margin-top: 0;
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
    border-radius: 8px;
    border-color: #f16eae;
    height: 40px;
    line-height: 40px;
    color: #f16eae;
    font-size: 22px;
  }
}
.isAndroid {
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
.aboutBox {
  padding: 30px;
  h4 {
    font-weight: 400;
    span {
      color: #f16eae;
      font-weight: 700;
    }
  }
  .item {
    margin-top: 30px;
    & > div {
      position: relative;
    }
    p {
      color: #f16eae;
      margin-bottom: 20px;
      font-size: 32px;
    }
    .msg {
      border: 1px solid #f16eae;
      border-radius: 10px;
      padding: 20px;
      font-size: 26px;
      line-height: 37px;
      margin-top: 20px;
    }
    .msgChecked {
      background-color: #f16eae;
      color: #fff;
    }
    img {
      position: absolute;
      width: 48px;
      height: 48px;
      background-color: #ffdcf0;
      box-shadow: 0px 2px 1px 0px #ffcbe4, 0px 1px 3px 0px #ffffff;
      border-radius: 6px;
      padding: 10px;
      right: 0;
      bottom: 0;
      transform: translate(12px, 12px);
    }
  }
}
.editBox {
  width: 502px;
  .title {
    height: 222px;
    background: url(../../images/edit_bg@2x.png) no-repeat;
    background-size: 100% 100%;
    padding-top: 93px;
    font-size: 36px;
    font-weight: 700;
    color: #000;
    text-align: center;
  }
  .msg {
    background-color: #fff;
    padding: 20px;
    .lineBox {
      border: 2px dashed #ffcedb;
      border-radius: 6px;
    }
  }
  .share {
    background-color: #fff;
    margin-top: -1px;
    padding: 20px;
    border-radius: 0 0 22px 22px;
    p {
      font-size: 18px;
      color: #333333;
      margin: 0;
    }
    .shareBtn {
      display: flex;
      padding: 0 40px;
      .item {
        flex: 1;
        text-align: center;
        img {
          width: 72px;
          height: 72px;
        }
      }
    }
  }
}
.tagsBox {
  width: 545px;
  background: url(../../images/tag_bg@2x.png) no-repeat;
  background-size: 100% 100%;
  padding: 80px 20px 68px;
  .tagsMsg {
    width: 505px;
    border: 2px solid #eb80a9;
    padding: 15px;
    border-radius: 25px;
    p {
      font-size: 22px;
      color: #595959;
      margin-bottom: 5px;
      .tagsTitle {
        font-size: 26px;
        color: #000;
      }
      .pink {
        color: #f16eae;
      }
    }
  }
}
/deep/.van-cell {
  font-size: 26px;
  padding: 15px;
  line-height: 37px;
}
/deep/.van-nav-bar__placeholder {
  background-color: #ee4d9b;
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
      .icon-calc {
        width: 32px;
        height: 42px;
      }
    }
  }
  .van-nav-bar__title {
    color: #fff;
    // font-size: 30px;
  }
}
.bold {
  font-weight: 700;
}
</style>
