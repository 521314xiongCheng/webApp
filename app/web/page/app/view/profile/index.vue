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
              class="icon-weekNote"
              @click="toAWeekNote"
              src="../../images/weekNote.png"
              alt=""
            />
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
            :src="`https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${userInfo.contactId}/avatar?size=60`"
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
                <span class="line"></span>
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
                v-if="isEmployee"
                @click="toIncomeTargetEvaluate"
                color="#F16EAE"
              />
            </div>
          </div>
          <!-- 新人行动 -->
          <div class="content-item" v-if="isNBC">
            <div class="content-item-title big-size" @click="toActionPlan">
              <div class="content-item-title-left">
                <span class="line"></span>
                <span>新人行动：</span>
                <div class="progress-stroke">
                  <span
                    :style="`width: ${(finishCount / totalCount) * 100}%`"
                    class="track"
                  ></span>
                </div>
                <span class="progress-text"
                  >{{ finishCount }}/{{ totalCount }}</span
                >
              </div>
              <van-icon name="arrow" v-if="env !== 'prod'" color="#F16EAE" />
            </div>
          </div>
          <!-- 2041 -->
          <div class="content-item item-2041" v-if="levelCode >= 60 && isEmployee">
            <div class="status-wrap">
              <img
                class="unit-status"
                v-if="detail_2041.unitMembersStatus"
                src="../../images/selected.png"
                alt=""
              />
              <img
                class="unit-status"
                v-else
                src="../../images/selected-dis.png"
                alt=""
              />
              <img
                class="ladder-status"
                v-if="detail_2041.successLadderStatus"
                src="../../images/selected.png"
                alt=""
              />
              <img
                class="ladder-status"
                v-else
                src="../../images/selected-dis.png"
                alt=""
              />
              <img
                class="redcoat-status"
                v-if="detail_2041.redSuitMembersStatus"
                src="../../images/selected.png"
                alt=""
              />
              <img
                class="redcoat-status"
                v-else
                src="../../images/selected-dis.png"
                alt=""
              />
            </div>
            <div class="count-wrap">
              <div
                class="unit-count"
                :class="{ 'default-color': detail_2041.unitMembersStatus }"
                @click="
                  toUnitReport('activityStatusCodes', 'A1,A2,A3,N1,N2,N3,P1,P2,P3')
                "
              >
                {{ detail_2041.unitMembersCount }}
              </div>
              <div
                class="ladder-count"
                :class="{ 'default-color': detail_2041.successLadderStatus }"
                @click="toSuccessLadder()"
              >
                {{ detail_2041.membersSuccessLadderCount }}+{{
                  detail_2041.myselfSuccessLadderStatus ? 1 : 0
                }}
              </div>
              <div
                class="redcoat-count"
                :class="{ 'default-color': detail_2041.redSuitMembersStatus }"
                @click="toUnitReportFrom2041()"
              >
                {{ detail_2041.redSuitMembersCount }}
              </div>
            </div>
            <div class="count-norm-wrap">
              <div
                class="unit-count-norm"
                :class="{ 'default-color': detail_2041.unitMembersStatus }"
                @click="
                  toUnitReport('activityStatusCodes', 'A1,A2,A3,N1,N2,N3,P1,P2,P3')
                "
              >
                20名
              </div>
              <div
                class="ladder-count-norm"
                :class="{ 'default-color': detail_2041.successLadderStatus }"
                @click="toSuccessLadder()"
              >
                4名+本人
              </div>
              <div
                class="redcoat-count-norm"
                :class="{ 'default-color': detail_2041.redSuitMembersStatus }"
                @click="toUnitReportFrom2041()"
              >
                1名
              </div>
            </div>
            <div class="text-wrap">
              <div
                class="unit-text"
                :class="{ 'default-color': detail_2041.unitMembersStatus }"
                @click="
                  toUnitReport('activityStatusCodes', 'A1,A2,A3,N1,N2,N3,P1,P2,P3')
                "
              >
                沙龙成员
              </div>
              <div
                class="ladder-text"
                :class="{ 'default-color': detail_2041.successLadderStatus }"
                @click="toSuccessLadder()"
              >
                阶梯达成
              </div>
              <div
                class="redcoat-text"
                :class="{ 'default-color': detail_2041.redSuitMembersStatus }"
                @click="toUnitReportFrom2041()"
              >
                红外套
              </div>
            </div>
          </div>
          <!-- 当月零售 -->
          <div class="content-item" @click="toOrderList">
            <div class="content-item-title">
              <div class="content-item-title-left">
                <span class="line"></span>
                <span>当月零售</span>
              </div>
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
                <!-- <div class="order-item-tag placeholder"></div> -->
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
            @click="toPrepUnitReport()"
          >
            <div class="content-item-title">
              <div class="content-item-title-left">
                <span class="line"></span>
                <span>管理准沙龙</span>
              </div>
            </div>
            <div class="content-item-subtitle">
              <div class="performance">
                <span class="performance-label">绩效</span>
                <span>{{ diqunit.productionAmt | formatMoney }}</span>
              </div>
            </div>
            <div class="retail">
              <div
                class="retail-item"
                @click.stop="toPrepUnitReport('isOrder', false)"
              >
                <div>{{ diqunit.noOrderMemberCount }}</div>
                <div class="retail-item-desc">未下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="toPrepUnitReport('isOrder', true)"
              >
                <div>{{ diqunit.orderMemberCount }}</div>
                <div class="retail-item-desc">已下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="toPrepUnitReport('isNewBc', true)"
              >
                <div>{{ diqunit.newMemberCount }}</div>
                <div class="retail-item-desc">新成员</div>
              </div>
            </div>
            <div class="detail-btn">
              <van-button v-if="showDiqReportBtn" plain>查看详情</van-button>
            </div>
          </div>
          <!-- 管理沙龙 -->
          <div
            class="content-item"
            v-if="levelCode >= 60"
            @click="toUnitReport()"
          >
            <div class="content-item-title">
              <div class="content-item-title-left">
                <span class="line"></span>
                <span>
                  管理沙龙
                  <van-icon
                    @click.stop="unitTagsPopup"
                    class="icon-info"
                    name="info"
                  />
                </span>
              </div>
              <div
                class="history"
                @click.stop="toUnitHistory"
                v-if="isEmployee"
              >
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
              <div
                class="retail-item"
                @click.stop="toUnitReport('isOrder', false)"
              >
                <div>{{ unit.noOrderMemberCount }}</div>
                <div class="retail-item-desc">未下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="toUnitReport('isOrder', true)"
              >
                <div>{{ unit.orderMemberCount }}</div>
                <div class="retail-item-desc">已下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="toUnitReport('isNewBc', true)"
              >
                <div>{{ unit.newMemberCount }}</div>
                <div class="retail-item-desc">新成员</div>
              </div>
            </div>
            <div class="unit-tag">
              <div
                class="unit-tag-item"
                :style="`width:${getTagWidth(unit.focusCount)}`"
                @click.stop="toUnitReport('isFocus', true)"
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
                :style="`background: #ECF5FF;color: #4D6ED1;width:${getTagWidth(
                  unit.newJoinMemberCount
                )}`"
                @click.stop="toUnitReport('tagId', '2')"
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
                :style="`background: #F1F2FF;color: #997BD6;width:${getTagWidth(
                  unit.beautyMemberCount
                )}`"
                @click.stop="toUnitReport('tagId', '5')"
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
                :style="`background: #FFF6EC;color: #FD9A3B;width:${getTagWidth(
                  unit.sellerMemberCount
                )}`"
                @click.stop="toUnitReport('tagId', '3')"
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
                :style="`background: #FFECEC;color: #D56B6B;width:${getTagWidth(
                  unit.leaderMemberCount
                )}`"
                @click.stop="toUnitReport('tagId', '4')"
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
                :style="`background: #FFEBD8;color: #CD925C;width:${getTagWidth(
                  unit.inactiveMemberCount
                )}`"
                @click.stop="toUnitReport('tagId', '6')"
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
              <van-button v-if="isEmployee" plain>更多沙龙详情</van-button>
            </div>
          </div>
          <!-- 美容顾问 -->
          <div class="content-item content-item-team" @click="toTeamReport()">
            <div class="content-item-title">
              <div class="content-item-title-left">
                <span class="line"></span>
                <span>美容顾问</span>
              </div>
              <div
                v-if="isEmployee"
                class="history"
                @click.stop="toTeamHistory"
              >
                <img src="../../images/index/icon_history.png" alt="" />
                <span>查看历史</span>
              </div>
            </div>
            <div class="content-item-subtitle">
              <div class="performance">
                <span class="performance-label">绩效</span>
                <span>{{ team.productionAmt | formatMoney }}</span>
              </div>
            </div>
            <div class="retail">
              <div
                class="retail-item"
                @click.stop="toTeamReport('isOrder', false)"
              >
                <div>{{ team.noOrderMemberCount }}</div>
                <div class="retail-item-desc">未下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="toTeamReport('isOrder', true)"
              >
                <div>{{ team.orderMemberCount }}</div>
                <div class="retail-item-desc">已下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="toTeamReport('isNewBc', true)"
              >
                <div>{{ team.newMemberCount }}</div>
                <div class="retail-item-desc">新成员</div>
              </div>
            </div>
            <div class="detail-btn">
              <van-button v-if="showTeamReportBtn" plain>查看详情</van-button>
            </div>
          </div>
          <!-- 一类管理区域 -->
          <div
            class="content-item"
            v-if="levelCode >= 70 && levelCode < 85"
            @click="toAreaReport('AREA_ONE')"
          >
            <div class="content-item-title">
              <div class="content-item-title-left">
                <span class="line"></span>
                <span>
                  一类管理区域
                  <van-icon
                    @click.stop="areaTagsPopup"
                    class="icon-info"
                    name="info"
                  />
                </span>
              </div>
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
                    :src="`https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${item.contactId}/avatar?size=60`"
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
              <van-button v-if="isEmployee" plain>查看详情</van-button>
            </div>
          </div>
          <!-- 1-2类管理区域 -->
          <div
            class="content-item"
            v-if="levelCode >= 85 && levelCode <= 87"
            @click="toAreaReport('AREA_ONE_TO_TWO')"
          >
            <div class="content-item-title">
              <div class="content-item-title-left">
                <span class="line"></span>
                <span>
                  1-2类管理区域
                  <van-icon
                    @click.stop="areaTagsPopup"
                    class="icon-info"
                    name="info"
                  />
                </span>
              </div>
              <label class="tip">(绩效包含非直接管理区域)</label>
            </div>
            <div class="retail">
              <div
                class="retail-item"
                @click.stop="toAreaReport('AREA_ONE_TO_TWO', 'lineNumbers', 1)"
              >
                <div>
                  {{ areaOneToTwo.areaOneProductionAmt | formatMoney }}
                </div>
                <div class="retail-item-desc">一类管理区域</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="toAreaReport('AREA_ONE_TO_TWO', 'lineNumbers', 2)"
              >
                <div>
                  {{ areaOneToTwo.areaTwoProductionAmt | formatMoney }}
                </div>
                <div class="retail-item-desc">二类管理区域</div>
              </div>
            </div>
            <div class="unit-tag">
              <div
                class="unit-tag-item"
                :style="`width:${getTagWidth(
                  areaOneToTwo.tagSummary
                    ? areaOneToTwo.tagSummary.focusCount
                    : 0
                )}`"
                @click.stop="toAreaReport('AREA_ONE_TO_TWO', 'isFocus', true)"
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
                :style="`background: #ECF5FF;color: #4D6ED1;width:${getTagWidth(
                  areaOneToTwo.tagSummary
                    ? areaOneToTwo.tagSummary.newDirCount
                    : 0
                )}`"
                @click.stop="toAreaReport('AREA_ONE_TO_TWO', 'tagId', '7')"
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
                :style="`background: #F1F2FF;color: #997BD6;width:${getTagWidth(
                  areaOneToTwo.tagSummary
                    ? areaOneToTwo.tagSummary.twoStarDirCount
                    : 0
                )}`"
                @click.stop="toAreaReport('AREA_ONE_TO_TWO', 'tagId', '8')"
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
                :style="`background: #FFF6EC;color: #FD9A3B;width:${getTagWidth(
                  areaOneToTwo.tagSummary
                    ? areaOneToTwo.tagSummary.pinkCarDirCount
                    : 0
                )}`"
                @click.stop="toAreaReport('AREA_ONE_TO_TWO', 'tagId', '9')"
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
                :style="`background: #FFECEC;color: #D56B6B;width:${getTagWidth(
                  areaOneToTwo.tagSummary
                    ? areaOneToTwo.tagSummary.seminarContestCount
                    : 0
                )}`"
                @click.stop="toAreaReport('AREA_ONE_TO_TWO', 'tagId', '10')"
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
                :style="`background: #FFEBD8;color: #CD925C;width:${getTagWidth(
                  areaOneToTwo.tagSummary
                    ? areaOneToTwo.tagSummary.threeStarDirCount
                    : 0
                )}`"
                @click.stop="toAreaReport('AREA_ONE_TO_TWO', 'tagId', '11')"
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
              <van-button v-if="isEmployee" plain>查看详情</van-button>
            </div>
          </div>
          <!-- 1-3类管理区域 -->
          <div
            class="content-item"
            v-if="levelCode >= 90"
            @click="toAreaReport('AREA_ONE_TO_THREE')"
          >
            <div class="content-item-title">
              <div class="content-item-title-left">
                <span class="line"></span>
                <span>
                  1-3类管理区域
                  <van-icon
                    @click.stop="areaTagsPopup"
                    class="icon-info"
                    name="info"
                  />
                </span>
              </div>
              <label class="tip">(绩效包含非直接管理区域)</label>
            </div>
            <div class="retail">
              <div
                class="retail-item"
                @click.stop="
                  toAreaReport('AREA_ONE_TO_THREE', 'lineNumbers', 1)
                "
              >
                <div>
                  {{ areaOneToThree.areaOneProductionAmt | formatMoney }}
                </div>
                <div class="retail-item-desc">一类管理区域</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="
                  toAreaReport('AREA_ONE_TO_THREE', 'lineNumbers', 1)
                "
              >
                <div>
                  {{ areaOneToThree.areaTwoProductionAmt | formatMoney }}
                </div>
                <div class="retail-item-desc">二类管理区域</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="
                  toAreaReport('AREA_ONE_TO_THREE', 'lineNumbers', 1)
                "
              >
                <div>
                  {{ areaOneToThree.areaThreeProductionAmt | formatMoney }}
                </div>
                <div class="retail-item-desc">三类管理区域</div>
              </div>
            </div>
            <div class="unit-tag">
              <div
                class="unit-tag-item"
                :style="`width:${getTagWidth(
                  areaOneToThree.tagSummary
                    ? areaOneToThree.tagSummary.focusCount
                    : 0
                )}`"
                @click.stop="toAreaReport('AREA_ONE_TO_THREE', 'isFocus', true)"
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
                :style="`background: #ECF5FF;color: #4D6ED1;width:${getTagWidth(
                  areaOneToThree.tagSummary
                    ? areaOneToThree.tagSummary.newDirCount
                    : 0
                )}`"
                @click.stop="toAreaReport('AREA_ONE_TO_THREE', 'tagId', '7')"
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
                :style="`background: #F1F2FF;color: #997BD6;width:${getTagWidth(
                  areaOneToThree.tagSummary
                    ? areaOneToThree.tagSummary.twoStarDirCount
                    : 0
                )}`"
                @click.stop="toAreaReport('AREA_ONE_TO_THREE', 'tagId', '8')"
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
                :style="`background: #FFF6EC;color: #FD9A3B;width:${getTagWidth(
                  areaOneToThree.tagSummary
                    ? areaOneToThree.tagSummary.pinkCarDirCount
                    : 0
                )}`"
                @click.stop="toAreaReport('AREA_ONE_TO_THREE', 'tagId', '9')"
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
                :style="`background: #FFECEC;color: #D56B6B;width:${getTagWidth(
                  areaOneToThree.tagSummary
                    ? areaOneToThree.tagSummary.seminarContestCount
                    : 0
                )}`"
                @click.stop="toAreaReport('AREA_ONE_TO_THREE', 'tagId', '10')"
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
                :style="`background: #FFEBD8;color: #CD925C;width:${getTagWidth(
                  areaOneToThree.tagSummary
                    ? areaOneToThree.tagSummary.threeStarDirCount
                    : 0
                )}`"
                @click.stop="toAreaReport('AREA_ONE_TO_THREE', 'tagId', '11')"
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
              <van-button v-if="isEmployee" plain>查看详情</van-button>
            </div>
          </div>
          <!-- DIQ跟进 -->
          <div
            class="content-item content-item-team"
            v-if="levelCode >= 60"
            @click="toDIQReport()"
          >
            <div class="content-item-title">
              <div class="content-item-title-left">
                <span class="line"></span>
                <span>DIQ跟进</span>
              </div>
            </div>
            <div class="retail">
              <div
                class="retail-item"
                @click.stop="toDIQReport('isOrder', false)"
              >
                <div>{{ areadiq.diqMemberCount }}</div>
                <div class="retail-item-desc">DIQ总数</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="toDIQReport('isOrder', true)"
              >
                <div>{{ areadiq.orderMemberCount }}</div>
                <div class="retail-item-desc">已下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="toDIQReport('isNewBc', true)"
              >
                <div>{{ areadiq.noOrderMemberCount }}</div>
                <div class="retail-item-desc">未下单</div>
              </div>
            </div>
            <div class="detail-btn">
              <van-button v-if="isEmployee" plain>查看详情</van-button>
            </div>
          </div>
        </div>
        <div
          class="bottom-btn"
          v-if="!(levelCode < 50 && accountType === 'operation')"
        >
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
    </div>

    <!-- 关心话术popup -->
    <van-popup
      v-model="aboutPopupShow"
      position="bottom"
      style="height: 80%"
      round
      closeable
      @closed="closeAbout"
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
              @click="profileContact(`topic1${index}`, item, '宣告身份')"
            ></div>
            <img
              src="../../images/profileMail.png"
              alt=""
              v-show="profileChecked == `topic1${index}`"
              @click="returnMail(item, '宣告身份')"
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
              @click="
                profileContact(`topic2${index}`, item, '约面谈/美丽课/公开课')
              "
            ></div>
            <img
              src="../../images/profileMail.png"
              alt=""
              v-show="profileChecked == `topic2${index}`"
              @click="returnMail(item, '约面谈/美丽课/公开课')"
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
              @click="profileContact(`topic3${index}`, item, '生日，MK生日')"
            ></div>
            <img
              src="../../images/profileMail.png"
              alt=""
              v-show="profileChecked == `topic3${index}`"
              @click="returnMail(item, '生日，MK生日')"
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
              @click="profileContact(`topic4${index}`, item, '关怀/问候/致谢')"
            ></div>
            <img
              src="../../images/profileMail.png"
              alt=""
              v-show="profileChecked == `topic4${index}`"
              @click="returnMail(item, '关怀/问候/致谢')"
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
              @click="
                profileContact(
                  `topic5${index}`,
                  item,
                  '业务/挑战/目标计划 提醒'
                )
              "
            ></div>
            <img
              src="../../images/profileMail.png"
              alt=""
              v-show="profileChecked == `topic5${index}`"
              @click="returnMail(item, '业务/挑战/目标计划 提醒')"
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
              @click="profileContact(`topic6${index}`, item, '邀约/售后/延伸')"
            ></div>
            <img
              src="../../images/profileMail.png"
              alt=""
              v-show="profileChecked == `topic6${index}`"
              @click="returnMail(item, '邀约/售后/延伸')"
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
              @click="profileContact(`topic7${index}`, item, '促销/活动提醒')"
            ></div>
            <img
              src="../../images/profileMail.png"
              alt=""
              v-show="profileChecked == `topic7${index}`"
              @click="returnMail(item, '促销/活动提醒')"
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
            <van-field
              v-model="editText"
              @click="handleClickEdit"
              autosize
              rows="1"
              type="textarea"
            />
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

    <!-- 沙龙标签定义说明 -->
    <van-popup v-model="unitTagsPopupShow" class="tagsPopup" closeable>
      <div class="tagsBox">
        <div class="tagsMsg">
          <h3>
            <span>
              <img src="../../images/mk_title_icon.png" alt="" />分组规则
            </span>
          </h3>
          <p>
            <span class="tagsTitle">关注：<br /></span>标注为重点的美容顾问
          </p>
          <p>
            <span class="tagsTitle">新顾问：<br /></span>加入<span class="pink"
              >3</span
            >个月
          </p>
          <p>
            <span class="tagsTitle">销售顾问：<br /></span>最近<span
              class="pink"
              >9</span
            >个月内有过RC订单
          </p>
          <p>
            <span class="tagsTitle">教练顾问：<br /></span>当前职级<span
              class="pink"
              >20-50</span
            >
          </p>
          <p>
            <span class="tagsTitle">幸福小店主：<br /></span>最近<span
              class="pink"
              >9</span
            >个月没有RC订单,但有个人订单
          </p>
          <p>
            <span class="tagsTitle">睡美人：<br /></span>最近<span class="pink"
              >9</span
            >个月没有任何订单
          </p>
        </div>
        <div class="bottom">
          <img src="../../images/mk_bottom_icon.png" alt="" />
        </div>
      </div>
    </van-popup>
    <!-- 区域标签定义说明 -->
    <van-popup v-model="areaTagsPopupShow" class="tagsPopup" closeable>
      <div class="tagsBox">
        <div class="tagsMsg">
          <h3>
            <span>
              <img src="../../images/mk_title_icon.png" alt="" />分组规则
            </span>
          </h3>
          <p>
            <span class="tagsTitle">新督导：<br /></span>晋升<span class="pink"
              >6</span
            >个月内
          </p>
          <p>
            <span class="tagsTitle">双星目标：<br /></span>累计<span
              class="pink"
              >12</span
            >个月平均<span class="pink">&lt;=1.5万</span>
          </p>
          <p>
            <span class="tagsTitle">粉车目标：<br /></span>累计<span
              class="pink"
              >12</span
            >个月平均大于<span class="pink">1.5万-2.8万</span>
          </p>
          <p>
            <span class="tagsTitle">研讨会目标：<br /></span>累计<span
              class="pink"
              >12</span
            >个月平均在<span class="pink">2.8万-6万</span>
          </p>
          <p>
            <span class="tagsTitle">海外游-三星目标：<br /></span>累计<span
              class="pink"
              >12</span
            >个月平均在<span class="pink">6万</span>以上
          </p>
        </div>
        <div class="bottom">
          <img src="../../images/mk_bottom_icon.png" alt="" />
        </div>
      </div>
    </van-popup>
    <div
      class="addNote"
      :class="{ addNoteIsphonex: isIphoneX }"
      @click="goAddNote()"
    >
      <img src="../../images/profile_note.png" alt="" />
    </div>
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
  buildQuery,
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
      unitTagsPopupShow: false,
      areaTagsPopupShow: false,
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
      from: "",
      pageName: "PersonalProfilePage",
      caringword_title: "",
      showNote: false,
      env: "",
      isNBC: false,
      jsBridgeEnv: "local",
      totalCount: 0,
      finishCount: 0,
      detail_2041: {
        unitMembersCount: 0,
        unitMembersStatus: false,
        membersSuccessLadderCount: 0,
        successLadderStatus: false,
        redSuitMembersCount: 0,
        redSuitMembersStatus: false,
      },
    };
  },
  computed: {
    showTeamReportBtn() {
      return this.isEmployee || this.from === "unit";
    },
    showDiqReportBtn() {
      return !this.isEmployee;
    },
  },
  async created() {
    let native = window.__INITIAL_STATE__.env;
    this.env = native;
    console.log("当前环境", native);
    this.$jsBridge.getSettings().then((res) => {
      if (res && res.env_real){
        this.jsBridgeEnv = res.env_real.toLowerCase();
      }
      console.log("jsBridgeEnv", this.jsBridgeEnv);
    });
    // if (native == "qa") {
    //   this.showNote = true;
    // } else {
    //   this.showNote = false;
    // }
    const {
      levelCode,
      targetContactId,
      accountType,
      monthKey,
      isEmployee,
      from,
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
    if (this.accountType === "operation") {
      this.pageName = "StaffPersonalProfilePage";
    } else {
      this.pageName = "PersonalProfilePage";
    }
    this.isEmployee = isEmployee ? JSON.parse(isEmployee) : false;
    this.from = from;
    this.initData();
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
    async goAddNote() {
      let params = {
        followContactId: this.$route.query.targetContactId,
        contactId: this.$route.query.followed,
      };
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/notes/check?followContactId=${this.$route.query.targetContactId}&contactId=${this.$route.query.followed}`
      );

      if (data.hasNote) {
        let url = `${window.location.origin}/note`;
        let params = {
          opaque: false,
          targetContactId: this.$route.query.targetContactId,
          name: this.userInfo.name,
          levelCode: this.$route.query.levelCode,
          followed: this.$route.query.followed,
        };
        console.log("params", params);
        this.$go(url, params);
      } else {
        let url = `${window.location.origin}/addNote`;
        let params = {
          targetContactId: this.$route.query.targetContactId,
          name: this.userInfo.name,
          opaque: false,
          levelCode: this.$route.query.levelCode,
          from: "addNote_none",
          followed: this.$route.query.followed,
        };
        this.$go(url, params);
      }
      console.log("data", data);
    },
    goCalc() {
      this.$track({
        context: this.pageName,
        behavior: "PersonalPerformanceCalculatorClick",
        item_type: this.pageName,
        item_id: "PersonalPerformanceCalculatorClick",
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      let url = `${window.location.origin}/calculate`;
      const params = {
        opaque: false,
        isSelf: this.isSelf,
        targetContactId: this.targetContactId,
        levelCode: this.levelCode,
        from: "profile",
      };
      this.$go(url, params);
    },
    toAWeekNote() {
      let url = `${window.location.origin}/a_week_note`;
      const params = {
        opaque: false,
        isSelf: this.isSelf,
        targetContactId: this.targetContactId,
      };
      this.$go(url, params);
    },
    initData() {
      this.getUserInfo();
      this.getIncome();
      this.getNBCAction();
      this.getRetail();
      this.getTeam();
      console.log(this.levelCode);
      if (this.levelCode === 50) {
        this.getDIQUnit();
      }
      if (this.levelCode >= 60) {
        this.get2041Detail();
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
      const { followed, targetContactId } = this.$route.query;
      let url = `${window.location.origin}/nbcActionPlan`;
      const params = {
        opaque: false,
        isSelf: this.isSelf,
        targetContactId: this.targetContactId,
      };
      if (this.accountType === "operation") {
        if (followed) {
          params.ImpersonatedContactID = followed;
        } else {
          params.ImpersonatedContactID = targetContactId;
        }
      }
      this.$go(url, params);
    },
    toPointHistory() {
      // 12-20 cf需求
      return;
    },
    toSetting() {
      let eventType = "PersonalMoreClick";
      if (this.accountType === "operation") {
        eventType = "ProfileMoreClick";
      }
      this.$track({
        context: this.pageName,
        behavior: eventType,
        item_type: this.pageName,
        item_id: eventType,
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      let url = `${window.location.origin}/setting`;
      const params = {
        opaque: false,
        isSelf: this.isSelf,
        targetContactId: this.targetContactId,
      };
      this.$go(url, params);
    },

    inviteSetTarget() {
      this.$track({
        context: this.pageName,
        behavior: "PersonalUnsetClick",
        item_type: this.pageName,
        item_id: "PersonalUnsetClick",
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      if (this.accountType === "operation") {
        this.$toast("抱歉，暂时不支持对她进行操作～");
        return;
      }
      Dialog.confirm({
        message: "是否邀请设置收入目标",
      })
        .then(() => {
          // on confirm
          this.$track({
            context: this.pageName,
            behavior: "PersonalConfirmInviteClick",
            item_type: this.pageName,
            item_id: "PersonalConfirmInviteClick",
            attributes: {
              isEmployee: this.accountType === "operation",
            },
          });
          this.share();
        })
        .catch(() => {
          this.$track({
            context: this.pageName,
            behavior: "PersonalCancelInviteClick",
            item_type: this.pageName,
            item_id: "PersonalCancelInviteClick",
            attributes: {
              isEmployee: this.accountType === "operation",
            },
          });
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
      let eventType =
        this.accountType === "operation"
          ? "ProfileRetailHistoryClick"
          : "PersonalRetailHistoryClick";

      this.$track({
        context: this.pageName,
        behavior: eventType,
        item_type: this.pageName,
        item_id: eventType,
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      let url = `${window.location.origin}/retail_history`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        isSelf: this.isSelf,
        targetContactId: this.targetContactId,
        from: "profile",
      };
      this.$go(url, params);
    },
    toOrderList() {
      this.$track({
        context: this.pageName,
        behavior: "PersonalRetailDetailClick",
        item_type: this.pageName,
        item_id: "PersonalRetailDetailClick",
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      let url = `${window.location.origin}/retail`;
      const params = {
        amount: this.income.currentMonthIncomeAmt,
        opaque: false,
        isSelf: this.isSelf,
        levelCode: this.levelCode,
        targetContactId: this.targetContactId,
        from: "profile",
      };
      this.$go(url, params);
    },
    toUnitReport(searchStr, searchType) {
      if (!this.isEmployee) return;
      let url = `${window.location.origin}/unit`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        isSelf: this.isSelf,
        targetContactId: this.targetContactId,
        levelCode: this.levelCode,
      };
      if (searchStr) {
        params[searchStr] = searchType;
      }
      this.$go(url, params);
    },
    toPrepUnitReport(searchStr, searchType) {
      if (!this.showDiqReportBtn) return;
      let url = `${window.location.origin}/prep_unit`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        targetContactId: this.targetContactId,
        isSelf: this.isSelf,
      };
      if (searchStr) {
        params[searchStr] = searchType;
      }
      this.$go(url, params);
    },
    toUnitHistory() {
      let url = `${window.location.origin}/unit_history`;
      const params = {
        monthKey: this.monthKey,
        accountType: this.accountType,
        opaque: false,
        isSelf: this.isSelf,
        targetContactId: this.targetContactId,
      };
      this.$go(url, params);
    },
    toTeamHistory() {
      let url = `${window.location.origin}/team_history`;
      const params = {
        opaque: false,
        accountType: this.accountType,
        targetContactId: this.targetContactId,
      };
      this.$go(url, params);
    },
    toTeamReport(searchStr, searchType) {
      if (!this.showTeamReportBtn) return;
      let url = `${window.location.origin}/team`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        levelCode: this.levelCode,
        targetContactId: this.targetContactId,
        isSelf: this.isSelf,
      };
      if (searchStr) {
        params[searchStr] = searchType;
      }
      this.$go(url, params);
    },
    toDIQReport(searchStr, searchType) {
      if (!this.isEmployee) return;
      let url = `${window.location.origin}/diq`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        levelCode: this.levelCode,
        targetContactId: this.targetContactId,
        isSelf: this.isSelf,
      };
      if (searchStr) {
        params[searchStr] = searchType;
      }
      this.$go(url, params);
    },
    toAreaReport(type, searchStr, searchType) {
      if (!this.isEmployee) return;
      let url = `${window.location.origin}/area`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        isSelf: this.isSelf,
        businessType: type,
        targetContactId: this.targetContactId,
      };
      if (searchStr) {
        params[searchStr] = searchType;
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
      let eventType = "PersonalSetIncomeTargetClick";
      let confirmEventType = "PersonalSetIncomeTargetConfirmClick";
      let cancelEventType = "PersonalSetIncomeTargetCancelClick";
      this.$track({
        context: this.pageName,
        behavior: eventType,
        item_type: this.pageName,
        item_id: eventType,
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      if (this.accountType === "operation" && this.levelCode < 60) {
        this.$toast("抱歉，暂时不支持对她进行操作～");
        return;
      }
      Dialog.confirm({
        message: "是否邀请设置收入目标",
      })
        .then(() => {
          // on confirm
          this.$track({
            context: this.pageName,
            behavior: confirmEventType,
            item_type: this.pageName,
            item_id: confirmEventType,
            attributes: {
              isEmployee: this.accountType === "operation",
            },
          });
          this.share();
        })
        .catch(() => {
          this.$track({
            context: this.pageName,
            behavior: cancelEventType,
            item_type: this.pageName,
            item_id: cancelEventType,
            attributes: {
              isEmployee: this.accountType === "operation",
            },
          });
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
    // 新人行动
    async getNBCAction() {
      let baseApi = this.$ctx.baseApi;
      // let baseApi = `https://mock.marykay.com.cn/mock/646/api/v1`;
      const {
        data: { isNew, totalCount, finishCount },
      } = await this.$request.get(`${baseApi}/goldenweek/newconsultant`);
      if (isNew && this.from !== "operation") {
        this.isNBC = isNew;
      } else {
        this.isNBC = false;
      }
      this.finishCount = finishCount;
      this.totalCount = totalCount;
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
      this.$track({
        context: this.pageName,
        behavior: "PersonalPhoneClick",
        item_type: this.pageName,
        item_id: "PersonalPhoneClick",
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      if (!this.userInfo.mobile) return;
      window.location.href = `tel:${this.userInfo.mobile}`;
    },
    aboutPopup() {
      this.$track({
        context: this.pageName,
        behavior: "PersonalCaringWordsClick",
        item_type: this.pageName,
        item_id: "PersonalCaringWordsClick",
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
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
    closeAbout() {
      this.profileChecked = "";
    },
    profileContact(value, text, caringword_title) {
      this.caringword_title = caringword_title;
      this.$track({
        context: this.pageName,
        behavior: "PersonalCaringWordSelectClick",
        item_type: this.pageName,
        item_id: "PersonalCaringWordSelectClick",
        attributes: {
          caringword_title: caringword_title,
          isEmployee: this.accountType === "operation",
        },
      });
      this.profileChecked = this.profileChecked == value ? null : value;
      this.editText = text;
      this.editPopup = true;
    },
    async wechatShare() {
      this.$track({
        context: this.pageName,
        behavior: "PersonalShareToWechat",
        item_type: this.pageName,
        item_id: "PersonalShareToWechat",
        attributes: {
          caringword_title: this.caringword_title,
          isEmployee: this.accountType === "operation",
        },
      });
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
      this.$track({
        context: this.pageName,
        behavior: "PersonalShareToMessage",
        item_type: this.pageName,
        item_id: "PersonalShareToMessage",
        attributes: {
          caringword_title: this.caringword_title,
          isEmployee: this.accountType === "operation",
        },
      });
      // console.log(this.isIos,this.userInfo.mobile);
      if (this.isIos) {
        window.location.href = `sms:${this.userInfo.mobile}&body=${this.editText}`;
      } else {
        window.location.href = `sms:${this.userInfo.mobile}?body=${this.editText}`;
      }
    },
    handleClickEdit() {
      this.$track({
        context: this.pageName,
        behavior: "PersonalAdjustCaringWordContentClick",
        item_type: this.pageName,
        item_id: "PersonalAdjustCaringWordContentClick",
        attributes: {
          caringword_title: this.caringword_title,
          isEmployee: this.accountType === "operation",
        },
      });
    },
    async returnMail(value, caringword_title) {
      this.$track({
        context: this.pageName,
        behavior: "PersonalShareCaringWordClick",
        item_type: this.pageName,
        item_id: "PersonalShareCaringWordClick",
        attributes: {
          caringword_title: caringword_title,
          isEmployee: this.accountType === "operation",
        },
      });
      if (xxxxxx) {
        const data = await this.$jsBridge.share({
          text: value,
        });
        console.log("share", data);
      }
    },
    toMessage() {
      this.$track({
        context: this.pageName,
        behavior: "PersonalSendMessageClick",
        item_type: this.pageName,
        item_id: "PersonalSendMessageClick",
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      window.location.href = `sms:${this.userInfo.mobile}`;
    },
    unitTagsPopup() {
      this.$track({
        context: this.pageName,
        behavior: "PersonalUnitRuleIconClick",
        item_type: this.pageName,
        item_id: "PersonalUnitRuleIconClick",
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      this.unitTagsPopupShow = true;
    },
    areaTagsPopup() {
      this.$track({
        context: this.pageName,
        behavior: "PersonalArea1RuleIconClick",
        item_type: this.pageName,
        item_id: "PersonalArea1RuleIconClick",
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      this.areaTagsPopupShow = true;
    },
    async get2041Detail() {
      // let baseApi = "https://mock.marykay.com.cn/mock/489/api/v1";
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(
        `${baseApi}/dashboards/2041/summary`
      );
      console.log(data);
      this.detail_2041 = data;
      this.detail_2041.successLadderStatus =
        data.membersSuccessLadderStatus && data.myselfSuccessLadderStatus;
    },
    toUnitReportFrom2041() {
      if (!this.isEmployee) return;
      this.$track({
        context: this.pageName,
        behavior: "UnitDetailClick",
        item_type: this.pageName,
        item_id: "UnitDetailClick",
      });
      let url = `${window.location.origin}/unit`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        levelCode: this.levelCode,
        targetContactId: this.targetContactId,
        isSelf: true,
        careerLevelCodes: "30,35,40,50",
        activityStatusCodes: "A1,A2,A3,N1,N2,N3,P1,P2,P3",
      };
      this.$go(url, params);
    },
    toSuccessLadder() {
      if (!this.isEmployee) return;
      let url = `https://{{env_minus}}lucky.marykay.com.cn/reports/successLadder?`;
      // let url = `https://qa-lucky.marykay.com.cn/reports/successLadder?`;
      const params = {
        currentLevel: this.levelCode,
        ConsultantName: this.displayName,
        impersonatedContactId: this.targetContactId,
        opaque: true,
        fullscreen: true,
        progress_hidden: true,
        busy_hidden: false,
      };
      console.log(params);
      let fullurl = `${url}?${buildQuery(params)}`;
      if (xxxxxx) {
        this.$jsBridge.openSchema(fullurl);
      } else {
        window.location.href = fullurl;
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
        padding-left: 20px;
        padding-right: 10px;
        line-height: 1;
        &-left {
          position: relative;
          display: flex;
          align-items: center;
          // &::before {
          //   content: " ";
          //   width: 7px;
          //   height: 28px;
          //   background-color: #f16eae;
          //   position: absolute;
          //   left: -22px;
          //   top: 2px;
          // }
          .line {
            width: 7px;
            height: 28px;
            background-color: #f16eae;
            margin-right: 13px;
          }
          .icon-info {
            color: #f99e79;
            margin-left: 10px;
          }
          .target-income {
            color: #f16eae;
            font-size: 34px;
          }
          .progress-stroke {
            width: 336px;
            height: 8px;
            border-radius: 6px;
            background-color: #ffe9f4;
            .track {
              height: 8px;
              display: block;
              background-color: #f16eae;
              border-radius: 6px;
            }
          }
          .progress-text {
            height: 32px;
            padding: 0 10px;
            border-radius: 16px;
            background-color: #ffe9f4;
            font-size: 24px;
            font-weight: bold;
            color: #f16eae;
            margin-left: 20px;
            line-height: 32px;
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
      .big-size {
        padding-top: 40px;
        padding-bottom: 40px;
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
        padding-top: 27px;
        position: relative;
        &-tag {
          width: 114px;
          height: 28px;
          background: #fd9ccb;
          border-radius: 0px 23px 0px 23px;
          color: #fff;
          text-align: center;
          line-height: 28px;
          // margin-top: -1px;
          margin-left: 13px;
          position: absolute;
          top: -1px;
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
  .item-2041 {
    width: 690px;
    height: 178px;
    background: url("../../images/index/bg_2041-profile.png") no-repeat;
    background-size: 100% 100%;
    font-size: 22px;
    line-height: 1;
    color: #7f7f7f;
    /* margin: 20px 0; */
    padding: 20px 0;
    /* box-shadow: 0px 2px 12px 0px rgba(193, 193, 193, 0.5); */
    .status-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    .count-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      color: #d8d8d8;
    }
    .count-norm-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
    }
    .text-wrap {
      display: flex;
      align-items: center;
    }
    .unit-status {
      width: 28px;
      height: 28px;
      margin-left: 330px;
    }
    .unit-count {
      font-size: 42px;
      width: 129px;
      text-align: center;
      margin-left: 262px;
    }
    .unit-count-norm {
      width: 129px;
      text-align: center;
      margin-left: 247px;
    }
    .unit-text {
      width: 129px;
      text-align: center;
      margin-left: 235px;
    }

    .ladder-status {
      width: 28px;
      height: 28px;
      margin-left: 104px;
    }
    .ladder-count {
      font-size: 42px;
      width: 129px;
      text-align: center;
    }
    .ladder-count-norm {
      width: 129px;
      text-align: center;
    }
    .ladder-text {
      width: 129px;
      text-align: center;
    }
    .redcoat-status {
      width: 28px;
      height: 28px;
      margin-left: 104px;
    }
    .redcoat-count {
      font-size: 42px;
      width: 129px;
      text-align: center;
    }
    .redcoat-count-norm {
      width: 129px;
      text-align: center;
    }
    .redcoat-text {
      width: 129px;
      text-align: center;
    }
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
.tagsPopup {
  background: none;
  /deep/ .van-popup__close-icon--top-right {
    right: 70px;
  }
}
.tagsBox {
  padding: 0 50px;
  .tagsMsg {
    width: 591px;
    // height: 667px;
    background: url(../../images/mk_tags_bg.png) no-repeat;
    background-size: 100%;
    padding: 50px;
    border-radius: 30px;
    h3 {
      font-size: 36px;
      color: #541b5a;
      text-align: center;
      span {
        position: relative;
      }
      img {
        width: 36px;
        height: 31px;
        position: absolute;
        left: 0;
        top: 0;
        transform: translate(-60%, -60%);
      }
    }
    p {
      font-size: 26px;
      color: #595959;
      margin-bottom: 12px;
      .tagsTitle {
        font-size: 28px;
        color: #000;
      }
      .pink {
        color: #f16eae;
      }
    }
  }
  .bottom {
    position: relative;
    height: 99px;
    img {
      width: 128px;
      height: 99px;
      position: absolute;
      right: 0;
      bottom: 50%;
      transform: translateX(50px);
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
      .icon-weekNote {
        width: 32px;
        height: 42px;
        margin-right: 30px;
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
.addNote {
  position: fixed;
  z-index: 1000;
  bottom: 300px;
  right: 30px;
}
.addNote img {
  width: 132px;
}

</style>
