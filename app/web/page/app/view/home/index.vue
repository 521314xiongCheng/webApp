<template>
  <div class="coach-home" :class="{ isAndroid: !isIos }">
    <van-sticky>
      <NavBar
        left-text="返回"
        title="我的教练"
        :border="false"
        :safe-area-inset-top="true"
        @click-left="back"
      >
        <template #left>
          <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
        </template>
        <template #right>
          <img
            class="icon-weekNote"
            @click="toAWeekNote"
            src="../../images/weekNote.png"
            alt=""
          />
          <img
            class="customer_btn"
            @click="customer"
            src="../../images/index/icon_customer.png"
            alt=""
          />
        </template>
      </NavBar>
    </van-sticky>
    <div class="coach-home-content">
      <div class="wrap-content">
        <div class="income">
          <div class="income-item income-real" @click="toIncome">
            <div class="income-item-num">
              <span>¥{{ income.currentMonthIncomeAmt | formatMoney }}</span>
              <img
                class="income-real-icon"
                src="../../images/index/icon_link.png"
                alt=""
              />
            </div>
            <div class="income-item-desc">本月实时收入</div>
          </div>
          <div class="line"></div>
          <div class="income-item income-target">
            <div
              class="income-item-num"
              v-if="income.isSettingTarget"
              @click="setTargetIncome"
            >
              <span>¥{{ income.targetIncomeAmt | formatMoney }}</span>
              <img
                class="income-target-icon"
                src="../../images/index/icon_edit.png"
                alt=""
              />
            </div>
            <van-button v-else class="set-target" @click="setTargetIncome"
              >设置目标</van-button
            >
            <div class="income-item-desc">本月收入目标</div>
          </div>
        </div>
      </div>
      <!-- 2041 -->
      <div class="content-item item-2041" v-if="levelCode >= 60">
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
      <div class="content">
        <div class="content-bg">
          <!-- 消息 -->
          <div class="content-item message" v-if="messages && messages.length">
            <van-notice-bar wrapable background="#fff" :scrollable="false">
              <template #left-icon>
                <img
                  class="message-item-icon"
                  src="../../images/index/icon_hot.png"
                  alt=""
                />
              </template>
              <van-swipe
                class="notice-swipe"
                indicator-color="white"
                :show-indicators="false"
                :autoplay="3000"
                vertical
              >
                <van-swipe-item
                  class="message-item"
                  @click="toMessage"
                  v-for="(message, index) in messages"
                  :key="`message_${index}`"
                >
                  <div v-html="message.message" class="climp"></div>
                </van-swipe-item>
              </van-swipe>
            </van-notice-bar>
          </div>
          <!-- 当月零售 -->
          <div class="content-item" @click="toOrderList">
            <div class="content-item-title">
              <span class="content-item-title-left">当月零售</span>
              <!-- <van-button class="history" text="查看历史" @click="toRetailReport">
                <template #icon>
                  <img src="../../images/index/icon_history.png" alt="">
                </template>
              </van-button> -->
              <div class="history" @click.stop="toRetailReport">
                <img src="../../images/index/icon_history.png" alt="" />
                <span>查看历史</span>
              </div>
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
              <span class="content-item-title-left">管理准沙龙</span>
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
              <van-button plain>查看详情</van-button>
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
                  @click.stop="unitTagsPopup"
                  class="icon-info"
                  name="info"
                />
              </span>
              <!-- <van-button @click="toUnitHistory" class="history" text="查看历史">
                <template #icon>
                  <img src="../../images/index/icon_history.png" alt="">
                </template>
              </van-button> -->
              <div class="history" @click.stop="toUnitHistory">
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
                @click.stop="
                  toUnitReport('isOrder', false, 'UnitNoOrdersClick')
                "
              >
                <div>{{ unit.noOrderMemberCount }}</div>
                <div class="retail-item-desc">未下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="toUnitReport('isOrder', true, 'UnitOrderedClick')"
              >
                <div>{{ unit.orderMemberCount }}</div>
                <div class="retail-item-desc">已下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="
                  toUnitReport('isNewBc', true, 'UnitNewMemberClick')
                "
              >
                <div>{{ unit.newMemberCount }}</div>
                <div class="retail-item-desc">新成员</div>
              </div>
            </div>
            <div class="unit-tag">
              <div
                class="unit-tag-item"
                :style="`width:${getTagWidth(unit.focusCount)}`"
                @click.stop="toUnitReport('isFocus', true, 'UnitFollowClick')"
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
                @click.stop="
                  toUnitReport('tagId', '2', 'UnitNewConsultantClick')
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
                :style="`background: #F1F2FF;color: #997BD6;width:${getTagWidth(
                  unit.beautyMemberCount
                )}`"
                @click.stop="toUnitReport('tagId', '5', 'UnitShopkeeperClick')"
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle3.png"
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
                @click.stop="
                  toUnitReport('tagId', '3', 'UnitSalesConsultantClick')
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle4.png"
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
                @click.stop="
                  toUnitReport('tagId', '4', 'UnitCoachConsultantClick')
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle5.png"
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
                @click.stop="
                  toUnitReport('tagId', '6', 'UnitSleepingBeautyClick')
                "
              >
                <div class="unit-tag-item-left">
                  <img
                    class="icon"
                    src="../../images/index/icon_circle6.png"
                    alt=""
                  />
                  <span class="label">睡美人</span>
                </div>
                <span class="amount">{{ unit.inactiveMemberCount }}</span>
              </div>
            </div>
            <div class="detail-btn">
              <van-button plain>更多沙龙详情</van-button>
            </div>
          </div>
          <!-- 美容顾问 -->
          <div class="content-item content-item-team" @click="toTeamReport()">
            <div class="content-item-title">
              <span class="content-item-title-left">美容顾问</span>
              <div class="history" @click.stop="toTeamHistory">
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
                @click.stop="toTeamReport('isOrder', false, 'TeamNoOrderClick')"
              >
                <div>{{ team.noOrderMemberCount }}</div>
                <div class="retail-item-desc">未下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="toTeamReport('isOrder', true, 'TeamOrderedClick')"
              >
                <div>{{ team.orderMemberCount }}</div>
                <div class="retail-item-desc">已下单</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="
                  toTeamReport('isNewBc', true, 'TeamNewMemberClick')
                "
              >
                <div>{{ team.newMemberCount }}</div>
                <div class="retail-item-desc">新成员</div>
              </div>
            </div>
            <div class="detail-btn">
              <van-button plain>查看详情</van-button>
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
                  @click.stop="areaTagsPopup"
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
              <van-button plain>查看详情</van-button>
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
                  @click.stop="areaTagsPopup"
                  class="icon-info"
                  name="info"
                />
              </span>
              <label class="tip">(绩效包含非直接管理区域)</label>
            </div>
            <div class="retail">
              <div
                class="retail-item"
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_TWO',
                    'lineNumbers',
                    1,
                    'Area1Click'
                  )
                "
              >
                <div>
                  {{ areaOneToTwo.areaOneProductionAmt | formatMoney }}
                </div>
                <div class="retail-item-desc">一类管理区域</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_TWO',
                    'lineNumbers',
                    2,
                    'Area2Click'
                  )
                "
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
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_TWO',
                    'isFocus',
                    true,
                    'TagFollowClick'
                  )
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
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_TWO',
                    'tagId',
                    '7',
                    'TagNewDIQDetailsClick'
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
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_TWO',
                    'tagId',
                    '8',
                    'TagDoubleStarClick'
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
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_TWO',
                    'tagId',
                    '9',
                    'TagPinkCarClick'
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
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_TWO',
                    'tagId',
                    '10',
                    'TagSeminarClick'
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
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_TWO',
                    'tagId',
                    '11',
                    'TagThreeStarClick'
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
                  @click.stop="areaTagsPopup"
                  class="icon-info"
                  name="info"
                />
              </span>
              <label class="tip">(绩效包含非直接管理区域)</label>
            </div>
            <div class="retail">
              <div
                class="retail-item"
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    'lineNumbers',
                    1,
                    'Area1Click'
                  )
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
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    'lineNumbers',
                    2,
                    'Area2Click'
                  )
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
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    'lineNumbers',
                    3,
                    'Area3Click'
                  )
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
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    'isFocus',
                    'true',
                    'TagFollowClick'
                  )
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
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    'tagId',
                    '7',
                    'TagNewDIQDetailsClick'
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
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    'tagId',
                    '8',
                    'TagDoubleStarClick'
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
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    'tagId',
                    '9',
                    'TagPinkCarClick'
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
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    'tagId',
                    '10',
                    'TagSeminarClick'
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
                @click.stop="
                  toAreaReport(
                    'AREA_ONE_TO_THREE',
                    'tagId',
                    '11',
                    'TagThreeStarClick'
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
                  areaOneToThree.tagSummary
                    ? areaOneToThree.tagSummary.threeStarDirCount
                    : 0
                }}</span>
              </div>
            </div>
            <div class="detail-btn">
              <van-button plain>查看详情</van-button>
            </div>
          </div>
          <!-- DIQ跟进 -->
          <div
            class="content-item content-item-team"
            v-if="levelCode >= 60"
            @click="toDIQReport()"
          >
            <div class="content-item-title">
              <span class="content-item-title-left">DIQ跟进</span>
            </div>
            <div class="retail">
              <div
                class="retail-item"
                @click.stop="toDIQReport(null, null, 'DIQDetailsTotalClick')"
              >
                <div>{{ areadiq.diqTotal }}</div>
                <div class="retail-item-desc">DIQ总数</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="
                  toDIQReport('tabType', 'assess', 'DIQDetailsOrderedClick')
                "
              >
                <div>{{ areadiq.diqExamNum }}</div>
                <div class="retail-item-desc">考核期</div>
              </div>
              <span class="retail-item-line"></span>
              <div
                class="retail-item"
                @click.stop="
                  toDIQReport('tabType', 'apply', 'DIQDetailsNoOrderClick')
                "
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
      <footBar
        :targetContactId="targetContactId"
        :levelCode="levelCode"
      ></footBar>
    </div>
    <van-dialog
      v-model="setTargetDialog"
      title=""
      :close-on-click-overlay="true"
      :show-confirm-button="false"
      class="target_dialog"
    >
      <div class="target_content">
        <div class="target_content-title">{{ setTargetTitle }}</div>
        <div class="target_content-input">
          <van-field
            v-model="targetIncomeAmt"
            :maxlength="9"
            :formatter="formatter"
            type="number"
            @click="targetBoxClick"
          />
        </div>
        <div class="target_content-btn">
          <van-button class="btn" @click="setTargetIncomeConfirm"
            >保存</van-button
          >
        </div>
        <div class="target_content-tip">
          <img src="../../images/index/icon_tip.png" alt="" />
          <div>
            <span>{{ setTargetTip }}</span>
          </div>
        </div>
        <div class="target_content-jump" @click="toEstimate">
          {{ setTargetSuccessBtnText }}
        </div>
      </div>
      <div class="cer_close" @click="setTargetIncomeCancel">
        <img src="../../images/index/icon_close.png" alt="" />
      </div>
    </van-dialog>
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

    <van-popup
      v-model="showTips"
      position="center"
      round
      style="background-color: rgba(0, 0, 0, 0)"
    >
      <div class="tip-content">
        <div class="tip-box">
          <img :src="tipsImageSrc" />
        </div>
        <div class="tip-close" @click="showTips = false">
          <img src="../../images/2041salon/close_pink.png" />
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import {
  NavBar,
  Button,
  Tabbar,
  TabbarItem,
  Dialog,
  Field,
  Col,
  Row,
  Swipe,
  SwipeItem,
  NoticeBar,
  Sticky,
  Icon,
  Popup,
} from "vant";
import {
  isIos,
  isIphoneX,
  closeWebview,
  xxxxxx,
  formatMoney,
  buildQuery,
} from "../../utils/index";
import { getICSH5Url } from "../../utils/customer";
import footBar from "../../components/tabbar.vue";
import storage from "good-storage";
import horizontalScreen from "../../mixin/horizontalScreen";
import moment from "moment";
export default {
  mixins: [horizontalScreen],
  data() {
    return {
      levelCode: 97,
      targetContactId: "",
      isIos: isIos(),
      isIphoneX: isIphoneX(),
      tabName: "home",
      monthKey: "",
      messages: [],
      income: {
        currentMonthIncomeAmt: null, //当月收入
        isSettingTarget: false, //是否设置目标收入
        targetIncomeAmt: null, //目标收入
      },
      setTargetDialog: false,
      setTargetTitle: "请输入收入目标",
      setTargetTip: "",
      setTargetSuccessBtnText: "",
      targetIncomeAmt: null, //设置目标收入
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
        diqTotal: null, //diq总数
        diqFdirNum: null, //diq申请期人数
        diqExamNum: null, //diq考核期人数
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
      detail_2041: {
        unitMembersCount: 0,
        unitMembersStatus: false,
        membersSuccessLadderCount: 0,
        successLadderStatus: false,
        redSuitMembersCount: 0,
        redSuitMembersStatus: false,
      },
      unitTagsPopupShow: false,
      areaTagsPopupShow: false,
      pageName: "HomePage",
      jsBridgeEnv: "local",
      showTips: false,
      tipsImageSrc: "",
      loginContactId: "", //登录用户ID，用于2041
    };
  },
  async created() {
    this.$jsBridge.getSettings().then((res) => {
      this.jsBridgeEnv = res && res.env_real.toLowerCase();
    });
    this.$track({
      context: this.pageName,
      behavior: "EntryMyCoachClick",
      item_type: this.pageName,
      item_id: "EntryMyCoachClick",
    });
    if (xxxxxx) {
      let userProfile = await this.$jsBridge.getUserProfile();
      userProfile =
        typeof userProfile === "string" ? JSON.parse(userProfile) : userProfile;
      this.loginContactId = userProfile.contact_id;
    }
    this.initData();
  },
  mounted() {
    // 返回时需要刷新数据
    const onFronted = (data) => {
      this.initData();
      this.resetToPortraitScreen();
    };
    this.$jsBridge.onFronted(onFronted);
  },
  methods: {
    async initData() {
      const { loginName } = this.$route.query;
      if (loginName) {
        this.displayName = loginName;
      }
      if (
        this.$route.query.ImpersonatedContactID ||
        this.$route.query.targetContactId
      ) {
        this.targetContactId =
          this.$route.query.ImpersonatedContactID ||
          this.$route.query.targetContactId;
        this.levelCode = Number(this.$route.query.levelCode);
      } else {
        if (xxxxxx) {
          let userProfile = await this.$jsBridge.getUserProfile();
          userProfile =
            typeof userProfile === "string"
              ? JSON.parse(userProfile)
              : userProfile;
          console.log(userProfile);
          this.levelCode = Number(userProfile.career_level_code);
          this.targetContactId = userProfile.contact_id;
          this.displayName = userProfile.display_name;
        }
      }
      // 用于profile页 区分员工账号登录和本人登录
      storage.set("ImpersonatedInfo", {
        targetContactId: this.targetContactId,
        levelCode: this.levelCode,
      });
      this.getMessage();
      this.getIncome();
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
    async customer() {
      let url = await getICSH5Url();
      let customerUrl = `${url}&title=我的客服`;
      this.$jsBridge.openSchema(customerUrl);
    },
    toMessage() {
      this.$track({
        context: this.pageName,
        behavior: "CareerOpportunitiesClick",
        item_type: this.pageName,
        item_id: "CareerOpportunitiesClick",
      });
      let url = `${window.location.origin}/message`;
      const params = {
        opaque: false,
        levelCode: this.levelCode,
        targetContactId: this.targetContactId,
      };
      this.$go(url, params);
    },
    async toIncome() {
      this.$track({
        context: this.pageName,
        behavior: "RealtimeIncomeClick",
        item_type: this.pageName,
        item_id: "RealtimeIncomeClick",
      });
      let url = `${window.location.origin}/income`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        amount: this.income.currentMonthIncomeAmt,
        targetContactId: this.targetContactId,
      };

      // 每个月1号 或者收入明细各项都为0进维护页
      let day = new Date().getDate();
      let baseApi = this.$ctx.baseApiList.income;
      let requestUrl = `${baseApi}/prodIncome/myIncomes?monthKey=${this.monthKey}`;

      let hasDetail = false;
      try {
        const res = await this.$request.get(requestUrl, {
          headers: {
            impersonatedContactId: this.targetContactId,
          },
        });
        res.data.myIncome.incomeList.forEach((income) => {
          if (income.total && income.total !== 0) {
            hasDetail = true;
            income.dataList.forEach((data) => {
              if (data.value && data.value !== 0) {
                hasDetail = true;
              }
            });
          }
        });
      } catch (err) {}
      console.log(hasDetail);
      if (day === 1 || !hasDetail) {
        params.day = day;
        url = `${window.location.origin}/processing`;
      }

      this.$go(url, params);
    },
    toPointHistory() {
      // 12-20 cf需求
      return;
    },
    toRetailReport() {
      this.$track({
        context: this.pageName,
        behavior: "RetailHistoryClick",
        item_type: this.pageName,
        item_id: "RetailHistoryClick",
      });
      let url = `${window.location.origin}/retail_history`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        levelCode: this.levelCode,
        targetContactId: this.targetContactId,
        isSelf: true,
      };
      this.$go(url, params);
    },
    toOrderList() {
      this.$track({
        context: this.pageName,
        behavior: "RetailDetailClick",
        item_type: this.pageName,
        item_id: "RetailDetailClick",
      });
      let url = `${window.location.origin}/retail`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        isSelf: true,
        levelCode: this.levelCode,
        targetContactId: this.targetContactId,
      };
      this.$go(url, params);
    },
    toPrepUnitReport(searchStr, searchType) {
      let url = `${window.location.origin}/prep_unit`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        levelCode: this.levelCode,
        targetContactId: this.targetContactId,
        isSelf: true,
      };
      if (searchStr) {
        params[searchStr] = searchType;
      }
      this.$go(url, params);
    },
    toUnitReport(searchStr, searchType, eventType = "UnitDetailClick") {
      this.$track({
        context: this.pageName,
        behavior: eventType,
        item_type: this.pageName,
        item_id: eventType,
      });
      let url = `${window.location.origin}/unit`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        levelCode: this.levelCode,
        targetContactId: this.targetContactId,
        isSelf: true,
      };
      if (searchStr) {
        params[searchStr] = searchType;
      }
      this.$go(url, params);
    },
    toUnitReportFrom2041() {
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
    toTeamReport(searchStr, searchType, eventType = "TeamDetailClick") {
      this.$track({
        context: this.pageName,
        behavior: eventType,
        item_type: this.pageName,
        item_id: eventType,
      });
      let url = `${window.location.origin}/team`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        levelCode: this.levelCode,
        targetContactId: this.targetContactId,
        isSelf: true,
      };
      if (searchStr) {
        params[searchStr] = searchType;
      }
      console.log(params);
      this.$go(url, params);
    },
    toDIQReport(searchStr, searchType, eventType = "DIQDetailsDetailClick") {
      this.$track({
        context: this.pageName,
        behavior: eventType,
        item_type: this.pageName,
        item_id: eventType,
      });
      let url = `${window.location.origin}/diq`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        levelCode: this.levelCode,
        targetContactId: this.targetContactId,
        isSelf: true,
      };
      if (searchStr) {
        params[searchStr] = searchType;
      }
      this.$go(url, params);
    },
    toUnitHistory() {
      this.$track({
        context: this.pageName,
        behavior: "UnitHistoryClick",
        item_type: this.pageName,
        item_id: "UnitHistoryClick",
      });
      let url = `${window.location.origin}/unit_history`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        levelCode: this.levelCode,
        targetContactId: this.targetContactId,
        isSelf: true,
      };
      this.$go(url, params);
    },
    toTeamHistory() {
      this.$track({
        context: this.pageName,
        behavior: "TeamHistoryClick",
        item_type: this.pageName,
        item_id: "TeamHistoryClick",
      });
      let url = `${window.location.origin}/team_history`;
      const params = {
        opaque: false,
        targetContactId: this.targetContactId,
        levelCode: this.levelCode,
      };
      this.$go(url, params);
    },
    toAreaReport(type, searchStr, searchType, eventType = "AeraDetailClick") {
      console.log(eventType);
      this.$track({
        context: this.pageName,
        behavior: eventType,
        item_type: this.pageName,
        item_id: eventType,
      });
      let url = `${window.location.origin}/area`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        levelCode: this.levelCode,
        businessType: type,
        targetContactId: this.targetContactId,
        isSelf: true,
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
      if (!value) return "";
      return formatMoney(value);
    },
    // 2041
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
      this.isShowTips();
    },
    async isShowTips() {
      let salonStausList = storage.get("2041SalonStausList") || [];
      let curYMD = moment().format("YYYYMMDD");
      let salonStausInfo = {
        loginContactId: this.loginContactId,
        targetContactId: this.targetContactId,
        curYMD,
      };
      let isShow = false;
      salonStausList.forEach((item, index, list) => {
        const { loginContactId, targetContactId, curYMD } = item;
        if (
          loginContactId === salonStausInfo.loginContactId &&
          targetContactId === salonStausInfo.targetContactId
        ) {
          if (curYMD === salonStausInfo.curYMD) {
            isShow = true;
          } else {
            list.splice(index, 1);
          }
        }
      });
      if (!salonStausList.length || !isShow) {
        salonStausList.push(salonStausInfo);
        storage.set("2041SalonStausList", salonStausList);
        const data = this.detail_2041;
        this.showTips = true;
        let membersSuccessLadderStatus =
          data.membersSuccessLadderStatus && data.myselfSuccessLadderStatus;
        if (
          data.unitMembersStatus &&
          membersSuccessLadderStatus &&
          data.redSuitMembersStatus
        ) {
          // case9、沙龙人员≥20AND成功阶梯≥4且督导本人达成AND红外套≥1：
          this.tipsImageSrc = require("../../images/2041salon/tips_111_1.png");
        } else if (
          data.unitMembersStatus &&
          membersSuccessLadderStatus &&
          !data.redSuitMembersStatus
        ) {
          // case5、沙龙人员≥20AND成功阶梯≥4且督导本人达成：
          this.tipsImageSrc = require("../../images/2041salon/tips_110.png");
        } else if (
          data.unitMembersStatus &&
          !membersSuccessLadderStatus &&
          data.redSuitMembersStatus
        ) {
          if (data.membersSuccessLadderStatus) {
            if (!data.myselfSuccessLadderStatus) {
              // case8、沙龙人员≥20AND红外套≥1AND成功阶梯≥4但督导本人未达成：
              this.tipsImageSrc = require("../../images/2041salon/tips_111_0.png");
            }
          } else {
            // case6、沙龙人员≥20AND红外套≥1：
            this.tipsImageSrc = require("../../images/2041salon/tips_101.png");
          }
        } else if (
          data.unitMembersStatus &&
          !membersSuccessLadderStatus &&
          !data.redSuitMembersStatus
        ) {
          // case2、沙龙人员≥20：
          this.tipsImageSrc = require("../../images/2041salon/tips_100.png");
        } else if (
          !data.unitMembersStatus &&
          membersSuccessLadderStatus &&
          data.redSuitMembersStatus
        ) {
          // case7、成功阶梯≥4且督导本人达成AND红外套≥1：
          this.tipsImageSrc = require("../../images/2041salon/tips_011.png");
        } else if (
          !data.unitMembersStatus &&
          membersSuccessLadderStatus &&
          !data.redSuitMembersStatus
        ) {
          // case3、成功阶梯≥4且督导本人达成：
          this.tipsImageSrc = require("../../images/2041salon/tips_010.png");
        } else if (
          !data.unitMembersStatus &&
          !membersSuccessLadderStatus &&
          data.redSuitMembersStatus
        ) {
          // case4、红外套≥1：
          this.tipsImageSrc = require("../../images/2041salon/tips_001.png");
        } else {
          // case9、挑战条件均未达成
          this.showTips = false;
        }
      }
    },
    // 消息
    async getMessage() {
      const { data } = await this.$request.get(`${this.$ctx.baseApi}/messages`);
      this.messages = data;
    },
    // 收入
    async getIncome() {
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/dashboards/income`
      );
      if (data) {
        this.income = data;
        this.monthKey = data.monthKey;

        if (this.income.isSettingTarget) {
          this.setTargetTitle = "请修改收入目标！";
        } else {
          this.setTargetTitle = "请输入收入目标！";
        }
        if (this.levelCode < 60) {
          this.setTargetTip =
            "当月的收入需要和美容顾问一起达成，一起来评估她们当月的零售绩效吧。";
          this.setTargetSuccessBtnText = "评估美容顾问成员零售业绩";
        } else if (this.levelCode === 60) {
          this.setTargetTip =
            "当月的收入需要和沙龙成员一起达成，一起来评估她们当月的零售绩效吧。";
          this.setTargetSuccessBtnText = "评估沙龙成员零售业绩";
        } else {
          this.setTargetTip =
            "当月的收入需要和督导一起达成，一起来评估她们当月的零售绩效吧。";
          this.setTargetSuccessBtnText = "评估沙龙成员零售业绩";
        }
      }
    },
    setTargetIncome() {
      this.$track({
        context: this.pageName,
        behavior: "SetTargetClick",
        item_type: this.pageName,
        item_id: "SetTargetClick",
      });
      this.setTargetDialog = true;
      if (this.income.targetIncomeAmt) {
        this.targetIncomeAmt = this.income.targetIncomeAmt;
      }
    },
    targetBoxClick() {
      this.$track({
        context: this.pageName,
        behavior: "TargetBoxClick",
        item_type: this.pageName,
        item_id: "TargetBoxClick",
      });
    },
    inviteSetTarget() {
      if (this.accountType === "operation") {
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
    async setTargetIncomeConfirm() {
      this.$track({
        context: this.pageName,
        behavior: "SaveTargetClick",
        item_type: this.pageName,
        item_id: "SaveTargetClick",
      });
      if (!this.targetIncomeAmt) return;
      let targetIncomeAmt = parseInt(this.targetIncomeAmt.split(",").join(""));
      if (targetIncomeAmt === this.income.targetIncomeAmt) {
        this.setTargetDialog = false;
        return;
      }
      console.log("请求接口");
      const { data } = await this.$request.post(
        `${this.$ctx.baseApi}/target/income`,
        {
          targetAmt: targetIncomeAmt,
          sourceType: "app",
        }
      );
      console.log("setTargetIncomeConfirm", data);
      this.setTargetDialog = false;
      this.getIncome();
    },
    setTargetIncomeCancel() {
      this.setTargetDialog = false;
      this.$track({
        context: this.pageName,
        behavior: "ColseClick",
        item_type: this.pageName,
        item_id: "ColseClick",
      });
    },
    toEstimate() {
      this.$track({
        context: this.pageName,
        behavior: "MembersIncomeEvaluationClick",
        item_type: this.pageName,
        item_id: "MembersIncomeEvaluationClick",
      });
      let path = "area";
      if (this.levelCode < 60) {
        path = "team";
      } else if (this.levelCode >= 60) {
        path = "unit";
      }
      let url = `${window.location.origin}/${path}`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        levelCode: this.levelCode,
        isSelf: true,
        targetContactId: this.targetContactId,
      };
      this.$go(url, params);
    },
    async getRetail() {
      const params = {
        contactId: this.targetContactId,
      };
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/dashboards/retail`,
        {
          params,
        }
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
        `${this.$ctx.baseApi}/dashboards/diqfollowup`
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
    unitTagsPopup() {
      this.$track({
        context: this.pageName,
        behavior: "UnitGroupingRulesIconClick",
        item_type: this.pageName,
        item_id: "UnitGroupingRulesIconClick",
      });
      this.unitTagsPopupShow = true;
    },
    areaTagsPopup() {
      this.$track({
        context: this.pageName,
        behavior: "AreaRulesIconClick",
        item_type: this.pageName,
        item_id: "AreaRulesIconClick",
      });
      this.areaTagsPopupShow = true;
    },
    // tabChange(appId) {
    //   console.log(appId)
    //   switch(appId){
    //     case 'MyContacts':
    //       this.$jsBridge.openSchema(`mk:///Intouch?appId=MyContacts&pageId=myContactsBirth`)
    //       break
    //     case 'MyReport':
    //       let url = `${window.location.origin}/reports`;
    //       const params = {
    //         targetContactId: this.targetContactId
    //       }
    //       this.$go(url, params);
    //       break
    //     case 'calc':
    //       this.$jsBridge.openSchema(`mk:///Intouch?appId=MyBusiness2&pageId=calc`)
    //       break
    //   }
    // }
    toAWeekNote() {
      let url = `${window.location.origin}/a_week_note`;
      const params = {
        opaque: false,
        isSelf: true,
        targetContactId: this.targetContactId,
      };
      this.$go(url, params);
    },
  },
  components: {
    NavBar,
    "van-button": Button,
    "van-tabbar": Tabbar,
    "van-tabbar-item": TabbarItem,
    "van-dialog": Dialog.Component,
    "van-field": Field,
    "van-row": Row,
    "van-col": Col,
    footBar,
    "van-notice-bar": NoticeBar,
    "van-swipe": Swipe,
    "van-swipe-item": SwipeItem,
    "van-sticky": Sticky,
    "van-icon": Icon,
    "van-popup": Popup,
  },
};
</script>
<style lang="less" scoped>
.coach-home {
  background-color: #fff;
  min-height: 100vh;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  .wrap-content {
    background-color: #ee4d9b;
  }
  .income {
    background-color: #ee4d9b;
    padding-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    .line {
      height: 59px;
      width: 1px;
      background-color: #fff;
      //line-height: 90px;
    }
    &-item {
      text-align: center;
      flex: 1;
      color: #fff;
      &-num {
        font-size: 46px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &-desc {
        font-size: 28px;
        margin: 12px 0 35px 0;
      }
    }
    &-real {
      &-icon {
        width: 15px;
        margin-left: 10px;
      }
    }
    &-target {
      &-icon {
        width: 24px;
        margin-left: 10px;
      }
      .set-target {
        // width: 180px;
        padding: 0 30px;
        height: 48px;
        background-color: #fff;
        color: #f16eae;
        font-size: 30px;
        font-weight: bold;
        border: none;
        border-radius: 24px;
      }
    }
  }
  .content {
    background-color: #fff;
    padding: 16px 30px;
    padding-top: 0;
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
        padding-right: 10px;
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
      // margin-top: 0;
      padding: 30px;
      &-item {
        display: flex;
        align-items: center;
        font-size: 22px;
        color: #484848;
        line-height: 32px;
        max-height: 64px;
        img {
          width: 22px;
          height: 28px;
          margin-right: 20px;
        }
      }
    }
    .message-item-icon {
      width: 22px;
      height: 28px;
      margin-right: 20px;
    }

    .notice-swipe {
      height: 64px;
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
        position: relative;
        padding-top: 27px;

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
  }
  .item-2041 {
    width: 690px;
    height: 178px;
    background: url("../../images/index/bg_2041.png") no-repeat;
    background-size: 100% 100%;
    font-size: 22px;
    line-height: 1;
    color: #7f7f7f;
    margin: 20px 30px;
    padding: 20px 0;
    box-shadow: 0px 2px 12px 0px rgba(193, 193, 193, 0.5);
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
  .tip-content {
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    .tip-box {
      img {
        width: 100%;
        height: 83.2vw;
      }
    }
    .tip-close {
      margin-top: 12vw;
      img {
        width: 7.5vw;
        height: 7.5vw;
      }
    }
  }
}
.isAndroid {
  .wrap-content {
    // padding-top: 135px;
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
    margin: 0 auto;
    &-title {
      width: 100%;
      position: absolute;
      font-size: 45px;
      top: 190px;
      font-weight: bold;
      color: #181818;
      padding: 0 80px;
    }
    &-input {
      position: absolute;
      top: 278px;
      left: 50%;
      transform: translateX(-50%);
      width: 261px;
      border-radius: 9px;
      border: 1px solid #ffa7d2;
      .van-field {
        background-color: transparent;
        font-size: 40px;
        line-height: 73px;
        padding: 0;
        /deep/.van-field__control {
          text-align: center;
          color: #f16eae;
        }
      }
    }
    &-btn {
      position: absolute;
      top: 382px;
      width: 100%;
      .btn {
        background: linear-gradient(180deg, #f9a7d7 0%, #f16eae 100%);
        border-radius: 53px;
        height: 76px;
        width: 314px;
        font-size: 30px;
        color: #fff;
      }
    }
    &-tip {
      width: 100%;
      bottom: 90px;
      padding-right: 30px;
      position: absolute;
      text-align: left;
      display: flex;
      align-items: flex-start;
      img {
        width: 30px;
        height: 30px;
        margin-left: 28px;
        margin-right: 8px;
        display: inline-block;
        box-sizing: content-box;
      }
      font-size: 24px;
      line-height: 28px;
      color: #181818;
    }
    &-jump {
      position: absolute;
      bottom: 35px;
      width: 100%;
      text-align: center;
      color: #f16eae;
      font-size: 30px;
      font-weight: 500;
      &::after {
        content: "→";
        display: inline-block;
        width: 40px;
        height: 40px;
        line-height: 40px;
        border-radius: 50%;
        color: #fff;
        background: linear-gradient(180deg, #f9a4d5 0%, #f16faf 100%);
        font-weight: 700;
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
      .icon-weekNote {
        width: 32px;
        height: 42px;
        margin-right: 30px;
      }
    }
  }
  .van-nav-bar__title {
    color: #fff;
    font-size: 30px;
  }
}

.van-notice-bar--wrapable {
  padding: 0;
}
.bold {
  font-weight: 700;
}
</style>
