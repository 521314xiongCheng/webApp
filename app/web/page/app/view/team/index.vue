<template>
  <div
    class="unit-detail"
    :class="{ isAndroid: !isIos, isFullScreen: isFullScreen }"
  >
    <div v-show="!isFullScreen">
      <van-sticky>
        <NavBar
          left-text="返回"
          :title="navTitle"
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
          <template #title>
            {{ navTitle }}
            <img
              class="icon_q"
              @click="showPopTime"
              src="../../images/icon_q.png"
              alt=""
            />
          </template>

          <template #right>
            <img
              @click="toSearch"
              class="icon-search"
              src="../../images/index/icon_search.png"
              alt=""
            />
            <van-popover
              v-model="showPopover"
              trigger="click"
              placement="bottom-end"
              :actions="popoverActions"
              @select="popoverSelect"
              v-if="levelCode >= 90 && accountType != 'operation'"
            >
              <template #reference>
                <img class="icon-more" src="../../images/dot.png" alt="" />
              </template>
            </van-popover>
            <template v-else>
              <span @click="gofullscreen()">
                <img class="icon-screen" src="../../images/screen.png" alt="" />
              </span>
            </template>
          </template>
        </NavBar>
      </van-sticky>
    </div>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      :head-height="100"
      :disabled="refreshDisable"
    >
      <template #pulling>
        <div class="refresh-icon">
          <img src="../../images/refresh-icon.gif" alt="" />
        </div>
        <p class="refresh-text">下拉刷新</p>
      </template>
      <template #loosing>
        <div class="refresh-icon">
          <img src="../../images/refresh-icon.gif" alt="" />
        </div>
        <p class="refresh-text">松开刷新</p>
      </template>
      <template #loading>
        <div class="refresh-icon">
          <img src="../../images/refresh-icon.gif" alt="" />
        </div>
        <p class="refresh-text">刷新中</p>
      </template>
      <div class="coach-home-content" v-show="!isFullScreen">
        <div class="coach-home-content-income" v-show="this.levelCode <= 50">
          <div class="retail-wrap">
            <div class="retail retail-flex">
              <div class="retail-item">
                <div>¥{{ retail.incomeAmt | formatMoney }}</div>
                <div class="retail-item-desc">已达成收入</div>
              </div>
              <div class="retail-item" @click="setTargetIncome">
                <div
                  class="retail-item-target"
                  v-if="!this.retail.setTargetIncomeAmt"
                >
                  设目标
                </div>
                <div v-else class="retail-num">
                  <span> ¥{{ retail.targetIncomeAmt | formatMoney }}</span>
                  <img
                    class="target-income-icon"
                    src="../../images/icon_edit_y.png"
                    alt=""
                    v-if="this.isSelf"
                  />
                </div>
                <div class="retail-item-desc">收入目标</div>
              </div>
              <div class="retail-item" @click="toIncome">
                <van-button class="income-history">历史收入</van-button>
              </div>
            </div>
            <div class="retail retail-unit retail-flex" @click="goEstimate">
              <div class="retail-item">
                <div>¥{{ retail.estimateIncomeAmt | formatMoney }}</div>
                <div class="retail-item-desc">收入评估</div>
              </div>
              <img
                src="../../images/icon_equal.png"
                class="retail-icon"
                alt=""
              />
              <div class="retail-item">
                <div>
                  ¥{{
                    retail.currentEstimateIncomeAmt.estimateIncomeAmt
                      | formatMoney
                  }}
                </div>
                <div class="retail-item-desc">
                  {{ retail.currentEstimateIncomeAmt.describe }}
                </div>
              </div>
              <img src="../../images/icon_add.png" class="retail-icon" alt="" />
              <div class="retail-item">
                <div class="estimateBox">
                  ¥{{
                    retail.otherEstimateIncomeAmt.estimateIncomeAmt
                      | formatMoney
                  }}
                  <van-icon class="icon-info" name="info" />
                </div>
                <div class="retail-item-desc">
                  {{ retail.otherEstimateIncomeAmt.describe }}
                </div>
              </div>
            </div>
          </div>
          <div class="retail retail-product retail-flex">
            <div class="retail-item">
              <div>{{ retail.productionAmt | formatMoney }}</div>
              <div class="retail-item-desc">已达成绩效</div>
            </div>
            <div class="retail-item">
              <div>
                {{ retail.estimateProductionAmt | formatMoney }}
              </div>
              <div class="retail-item-desc">评估绩效累计</div>
            </div>
            <div class="retail-item" @click="toTeamHistory">
              <van-button class="income-history">历史绩效</van-button>
            </div>
          </div>
        </div>

        <div class="unit-content-filter">
          <img class="icon" src="../../images/select.png" alt="" />
          <dropdowm-menu
            :filterConfig="filterConfig"
            :filter="filter"
            ref="filterAction"
            :pageName="pageName"
            filterClickEventName="TeamDetailsFilterClick"
            tagEventName="TeamDetailsFilterTagClick"
            resetEventName="TeamDetailsFilterResetClick"
            confirmEventName="TeamDetailsFilterConfirmClick"
            :total="total"
            @filterConfirm="filterConfirm"
            @filterActionIsOpen="filterActionIsOpen"
          ></dropdowm-menu>
        </div>
      </div>
      <!-- table -->
      <List
        :finished="finished"
        v-model="loading"
        :finished-text="
          tableData.data && tableData.data.length ? '没有更多了' : ''
        "
        @load="loadData"
        v-if="showTable"
      >
        <common-table
          id="table-content"
          ref="teamTable"
          :border="false"
          :tableData="tableData"
          :isFullScreen="isFullScreen"
          @sortChange="sortChange"
          :setClassName="setClassName"
          @cellClick="cellClick"
        >
          <el-table-column
            fixed="left"
            width="60px"
            align="center"
            prop="avatar"
            label="头像"
          >
            <template slot-scope="{ row }">
              <div class="avatar-wrap">
                <img
                  @click="handleClickAvatar(row)"
                  class="avatar"
                  :src="`https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${row.contactId}/avatar?size=60`"
                  alt=""
                />
                <img
                  v-show="row.setTargetIncomeAmt"
                  class="icon_crown"
                  src="../../images/crown.png"
                  alt=""
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="姓名"
            fixed="left"
            align="center"
            width="70px"
            header-align="center"
          >
            <template slot-scope="{ row }">
              <div class="user">
                <div class="user-info">
                  <div class="user_name">
                    <span class="climp">{{ row.name }}</span>
                  </div>
                </div>
                <div class="tags" v-if="targetContactId == row.contactId">
                  <span class="level">{{ row.careerLevelCode }}</span>
                  <span class="status">{{ row.activityStatusCode }}</span>
                  <span class="self">本人</span>
                </div>
                <div class="no-self" v-else>
                  <span class="level">{{ row.careerLevelCode }}</span>
                  <span class="line"></span>
                  <span class="status">{{ row.activityStatusCode }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="评估绩效"
            slot="between"
            prop="estimateProductionAmt"
            width="96px"
            align="center"
            header-align="center"
            sortable="custom"
            v-if="this.levelCode < 60"
            :sort-orders="['descending', 'ascending', null]"
          >
            <template slot-scope="{ row }">
              <div class="assess-performance">
                <van-button
                  @click="setTarget(row)"
                  v-if="!row.setTargetProductionAmt"
                  class="assess-performance-btn"
                  >评估绩效</van-button
                >
                <van-button
                  v-else
                  class="assess-performance-btn"
                  @click="setTarget(row)"
                  >{{ row.estimateProductionAmt | formatMoney }}</van-button
                >
                <img
                  v-if="!row.setBySelf && row.setTargetProductionAmt"
                  class="assess-performance-tip"
                  src="../../images/avatar.png"
                  alt=""
                  @click="setByself(row)"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="收入目标"
            slot="between"
            prop="setTargetIncomeAmt"
            align="center"
            header-align="center"
            minWidth="90px"
            sortable="custom"
            v-if="this.levelCode >= 60"
            :sort-orders="['descending', 'ascending', null]"
          >
            <template slot-scope="{ row }">
              <div class="assess-performance">
                <van-button
                  @click="setTargetIncomerow(row)"
                  v-if="!row.setTargetIncomeAmt"
                  class="assess-performance-btn"
                  >未设置</van-button
                >
                <van-button
                  v-else
                  class="assess-performance-btn"
                  @click="setTargetIncomerow(row)"
                  >{{ row.incomeTargetAmt | formatMoney }}</van-button
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column
            key="0"
            label="绩效进度"
            slot="between"
            prop="productionAmtRate"
            minWidth="90px"
            align="center"
            header-align="center"
            sortable="custom"
            v-if="this.levelCode < 60"
            :sort-orders="['descending', 'ascending', null]"
          >
            <template slot-scope="{ row }">
              {{ row.productionAmtRate }}%
            </template>
          </el-table-column>
        </common-table>
      </List>
      <div v-show="!showTable" class="nodata">
        <img src="../../images/nodata1.png" alt="" />
        <div>暂时没有数据</div>
      </div>
    </van-pull-refresh>
    <!-- 数据更新提示时间 -->
    <van-popup
      v-model="popupTime"
      class="timePopup"
      position="center"
      round
      closeable
    >
      <div class="popupTime">
        <div class="msg">
          <span><img src="../../images/mk_title_icon.png" alt="" />规则</span>
          <p>数据更新时间：<span>6</span>小时</p>
        </div>
        <div class="bottom">
          <img src="../../images/mk_bottom_icon.png" alt="" />
        </div>
      </div>
    </van-popup>
    <!-- 点击头像弹出层 -->
    <click-avatar-action-sheet
      ref="clickAvatarActionSheet"
      :pageName="pageName"
      profileClickEventName="TeamDetailsClick"
      focusEventName="TeamDetailsSetFocusClick  "
      unfocusEventName="TeamDetailsUnfocusClick"
      setTargetEventName="TeamDetailsSetIncomeTargetClick"
      callEventName="TeamDetailsPhoneCallClick"
      cancelEventName="TeamDetailsUnsetClick"
      :info="currentData"
      :isFullScreen="isFullScreen"
      :accountType="accountType"
      :targetContactId="targetContactId"
      @onSelect="onSelect"
    />
    <!-- 评估绩效面板 -->
    <productionSheet
      ref="productionAction"
      :contactId="productionContactId"
      queryType="team"
      :productionName="productionName"
      @addProduction="addProduction"
    ></productionSheet>
    <!-- 收入目标 -->
    <set-target
      :isSettingTarget="retail.setTargetIncomeAmt"
      :levelCode="levelCode"
      :incomeTargetIncomeAmt="retail.targetIncomeAmt"
      ref="setTarget"
      @setTargetIncomeConfirm="setTargetIncomeConfirm"
    />

    <van-popup v-model="popup" position="center" class="popupmodel" closeable>
      <div class="popbox">
        <div class="msg">
          <p class="popbox-title">
            <span><img src="../../images/mk_title_icon.png" alt="" />提示</span>
          </p>
          <p class="popbox-mes">{{ describe }}</p>
        </div>
        <div class="bottom">
          <img src="../../images/mk_bottom_icon.png" alt="" />
        </div>
      </div>
    </van-popup>
    <img
      v-if="isFullScreen"
      @click="resetToPortraitScreen"
      src="../../images/portraitscreen.png"
      class="resetToPortraitScreen"
      alt=""
    />
    <!-- <largeText v-if="largeTextbox" @closeLargeText='closeLargeText' :largeTextInfo="largeTextInfo"></largeText> -->
  </div>
</template>
<script>
import dropdowmMenu from "../../components/filterActionSheet/dropdowmMenu.vue";
import productionSheet from "../../components/productionSheet/index.vue";
import SetTarget from "../../components/setTarget";
import storage from "good-storage";

import {
  NavBar,
  Button,
  Tabbar,
  TabbarItem,
  Dialog,
  Field,
  Icon,
  List,
  Popup,
  Sticky,
  PullRefresh,
} from "vant";
import commonTable from "../../components/commonTable.vue";
import largeText from "../../components/largeText";
import {
  isIos,
  isIphoneX,
  closeWebview,
  formatMoney,
  deepCopy,
} from "../../utils/index";
import horizontalScreen from "../../mixin/horizontalScreen";
import clickAvatarActionSheet from "../../components/clickAvatarActionSheet";

export default {
  mixins: [horizontalScreen],
  data() {
    return {
      largeTextbox: false,
      largeTextInfo: {},
      showTable: true,
      popup: false,
      popupTime: false,
      describe: "",
      isSelf: false,
      currentData: {},
      levelCode: 97,
      isIos: isIos(),
      isIphoneX: isIphoneX(),
      contactId: "",
      loading: true,
      finished: false,
      navTitle: "",
      tableData: {
        data: [],
        header: [],
      },
      tableHeader: [
        {
          label: "当月绩效",
          sortable: "custom",
          minWidth: "90px",
          prop: "productionAmt",
          formatter: (row) => {
            return formatMoney(row.productionAmt);
          },
        },
      ],
      //收入
      retail: {
        //是否设置收入
        setTargetIncomeAmt: false,
        //收入目标
        targetIncomeAmt: 0,
        //预估收入
        estimateIncomeAmt: 0,
        //已达成收入
        incomeAmt: 0,
        currentEstimateIncomeAmt: {
          estimateIncomeAmt: "",
        },
        otherEstimateIncomeAmt: {
          estimateIncomeAmt: "",
        },
      },
      filterText: "筛选",
      filterSheet: false,
      total: 0,
      //分页
      filter: {
        pageSize: 50,
        pageNo: 1,
        sortEnum: "ESTIMATE_PRODUCTION_AMT",
        orderEnum: "DESC",
      },
      filterConfig: [
        {
          prop: "activityStatuses",
          label: "状态",
          options: [],
        },
        {
          prop: "careeLevels",
          label: "职级",
          options: [],
        },
        {
          prop: "setTargetIncomeAmt",
          label: "收入目标",
          multiple: false,
          options: [
            {
              name: "已设定",
              value: true,
            },
            {
              name: "未设定",
              value: false,
            },
          ],
        },
        {
          prop: "setTargetProductionAmt",
          label: "评估绩效",
          multiple: false,
          options: [
            {
              name: "已评估",
              value: true,
            },
            {
              name: "未评估",
              value: false,
            },
          ],
        },
        {
          prop: "debuteCount",
          label: "生日周年",
          multiple: true,
          options: [
            {
              name: "生日周年",
              value: 1,
            },
            {
              name: "美容顾问周年",
              value: 2,
            },
          ],
        },
        {
          prop: "isNewBc",
          label: "新成员",
          multiple: false,
          options: [
            {
              name: "是",
              value: true,
            },
            {
              name: "否",
              value: false,
            },
          ],
        },
        {
          prop: "isOrder",
          label: "是否下单",
          multiple: false,
          options: [
            {
              name: "已下单",
              value: true,
            },
            {
              name: "未下单",
              value: false,
            },
          ],
        },
        {
          prop: "isFocus",
          label: "是否关注",
          multiple: false,
          options: [
            {
              name: "是",
              value: true,
            },
            {
              name: "否",
              value: false,
            },
          ],
        },
      ],
      productionContactId: "",
      productionName: "",
      targetContactId: "",
      monthKey: "",
      tableName: "team",
      filterParams: {},
      refreshing: false,
      refreshDisable: false,
      navBarClientHeight: 0, //fix 横屏后获取navBar错误
      pageName: "TeamDetailsPage",
      landscapeEventName: "TeamDetailsLandscapeClick",
      export2ExcelEventName: "TeamDetailsExcelExportClick",
    };
  },
  mounted() {
    const onFronted = () => {
      // 从搜索页返回时需要刷新数据
      this.onFronted();
    };
    this.$jsBridge.onFronted(onFronted);

    // 固定表头
    this.fixedHeader();
  },
  async created() {
    if (this.$route.query.navTitle) {
      this.navTitle = this.$route.query.navTitle;
    } else {
      this.navTitle = "美容顾问详情";
    }
    const {
      monthKey,
      levelCode,
      targetContactId,
      isSelf,
      accountType,
      isOrder,
      isNewBc,
    } = this.$route.query;
    if (isOrder !== undefined) {
      this.filter.isOrder = JSON.parse(isOrder);
    }
    if (isNewBc !== undefined) {
      this.filter.isNewBc = JSON.parse(isNewBc);
    }
    this.levelCode = Number(levelCode);
    this.isSelf = JSON.parse(isSelf);
    this.targetContactId = targetContactId;
    this.monthKey = monthKey;
    this.accountType = accountType;

    // this.contactId = this.$route.query.targetContactId;
    //console.log(monthKey);
    let date = new Date(monthKey.substr(0, 4), monthKey.substr(4, 6));
    date.setMonth(date.getMonth() - 1, 1);
    for (let i = 1; i < 13; i++) {
      date.setMonth(date.getMonth() - 1);
      let newDate = `${date.getFullYear()}/${this.addZero(
        date.getMonth() + 1
      )}`;
      this.tableHeader.push({
        label: `${newDate}`,
        minWidth: "90px",
        sortable: "custom",
        prop: `productionAmtM${i}`,
        formatter: (row) => {
          return formatMoney(row[`productionAmtM${i}`]);
        },
      });
    }
    this.tableData.header = this.tableHeader;
    this.loadData();
    this.getFilterConditions();
  },
  methods: {
    fixedHeader() {
      let navBar = document.querySelector(".van-nav-bar");
      let filterContent = document.querySelector(".unit-content-filter");
      let unitContentIncome = document.querySelector(
        ".coach-home-content-income"
      );
      let tableHeaderWrap = document.querySelector(".el-table__header-wrapper");
      let tableBodyWrap = document.querySelector(".el-table__body-wrapper");
      let commonTable = document.querySelector(".common-table");
      window.addEventListener("scroll", (e) => {
        this.navBarClientHeight = navBar.clientHeight;
        if (
          commonTable.clientHeight +
            filterContent.clientHeight +
            navBar.clientHeight <=
          screen.height
        )
          return;
        let tableFixedHeaderWrap = document.querySelector(
          ".el-table__fixed-header-wrapper"
        );
        let tableFixedBodyWrap = document.querySelector(
          ".el-table__fixed-body-wrapper"
        );
        let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (!this.isFullScreen) {
          if (scrollTop >= unitContentIncome.clientHeight) {
            tableFixedHeaderWrap.style.cssText = `position: fixed;top: ${
              navBar.clientHeight + filterContent.clientHeight - 1
            }px;width: 130px;z-index: 4;overflow: hidden;`;
            tableFixedBodyWrap.style.cssText = `top: ${
              tableHeaderWrap.clientHeight + filterContent.clientHeight - 1
            }px`;
            filterContent.style.cssText = `position: fixed;top: ${navBar.clientHeight}px;right: 0;z-index: 5;width: 100%;`;
            tableHeaderWrap.style.cssText = `position: fixed;top: ${
              navBar.clientHeight + filterContent.clientHeight - 1
            }px;z-index: 3;`;
            tableBodyWrap.style.cssText = `padding-top: ${
              tableHeaderWrap.clientHeight + filterContent.clientHeight - 1
            }px`;
          } else {
            tableFixedHeaderWrap.style.cssText = `position: absolute;top: 0`;
            tableFixedBodyWrap.style.cssText = `padding-top:0;top: ${tableFixedHeaderWrap.clientHeight}px;`;
            filterContent.style.cssText = `position: unset;`;
            tableHeaderWrap.style.cssText = `position: unset;`;
            tableBodyWrap.style.cssText = "padding-top: 0;";
          }
        }
      });
    },
    initTableFixed() {
      // let filterContent = document.querySelector(".unit-home-content-wrap");
      let tableHeaderWrap = document.querySelector(".el-table__header-wrapper");
      let tableBodyWrap = document.querySelector(".el-table__body-wrapper");
      let tableFixedHeaderWrap = document.querySelector(
        ".el-table__fixed-header-wrapper"
      );
      let tableFixedBodyWrap = document.querySelector(
        ".el-table__fixed-body-wrapper"
      );
      console.log(
        `tableFixedHeaderWrap:${tableFixedHeaderWrap},tableFixedBodyWrap:${tableFixedBodyWrap}`
      );
      // filterContent.style.cssText = `position: unset;`;
      if (tableHeaderWrap) {
        tableHeaderWrap.style.cssText = `position: unset;`;
      }
      if (tableBodyWrap) {
        tableBodyWrap.style.cssText = "padding-top: 0;";
      }
      tableFixedHeaderWrap.style.cssText = `position: absolute;top: 0`;
      tableFixedBodyWrap.style.cssText = `padding-top:0;top: ${tableFixedHeaderWrap.clientHeight}px;`;
    },
    showPopTime() {
      this.popupTime = !this.popupTime;
      this.$track({
        context: this.pageName,
        behavior: "TeamDetailsRuleIconClick",
        item_type: this.pageName,
        item_id: "TeamDetailsRuleIconClick",
      });
    },
    closeLargeText() {
      this.largeTextbox = false;
    },
    cellClick(data) {
      this.largeTextInfo.name = data.row.name;
      this.largeTextInfo.label = data.column.label;
      var type = data.column.property;

      this.largeTextInfo.data = data.row[type];

      this.largeTextbox = true;
    },
    filterActionIsOpen(type) {
      this.refreshDisable = type;
    },
    setClassName({ row, column }) {
      if (column.property === "name") {
        return "cell-class_name";
      }
      if (column.property === "avatar") {
        return "cell-class_avatar";
      }
      if (column.property === "estimateProductionAmt") {
        return "cell-class_estimateProductionAmt";
      }
    },
    async onFronted() {
      const params = deepCopy(this.filterParams);
      params.pageNo = 1;
      params.pageSize = this.tableData.data.length || 20;
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(
        `${baseApi}/reports/team/details`,
        {
          params,
        }
      );

      this.retail = data;
      console.log("retail", retail);
      this.tableData.data.forEach((table, index, tableData) => {
        data.members.forEach((item, i) => {
          if (table.contactId === item.contactId) {
            tableData.splice(index, 1, item);
          }
        });
      });
    },
    rowsetTargetIncomeAmt(row) {
      //console.log("row", row);
    },
    async setTargetIncomeConfirm() {
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
      let baseApi = this.$ctx.baseApi;

      const { data } = await this.$request.get(
        `${baseApi}/reports/team/details`
      );
      this.retail = data;
      this.onFronted();
    },
    toSearch() {
      let url = `${window.location.origin}/team_search`;
      const params = {
        targetContactId: this.$route.query.targetContactId,
        monthKey: this.$route.query.monthKey,
        levelCode: this.levelCode,
      };
      this.$go(url, params);
    },
    setTarget(row) {
      if (this.isFullScreen) {
        this.$toast("请返回竖屏下操作～");
        return;
      }
      if (this.accountType === "operation") {
        this.$toast("抱歉，暂时不支持对她进行操作～");
        return;
      }

      this.currentData = row;
      this.productionContactId = row.contactId;
      this.productionName = row.name;
      //console.log('点开始',this.currentData)
      this.$refs.productionAction.showProductionAction = true;
    },

    //保存绩效
    async addProduction(data) {
      this.currentData.setTargetProductionAmt = true;
      this.currentData.estimateProductionAmt = data;
      this.currentData.setBySelf = true;
      this.$refs.productionAction.showProductionAction = false;
      //刷新预估收入
      let baseApi = this.$ctx.baseApi;
      const res = await this.$request.get(`${baseApi}/reports/team/details`);
      this.retail = res.data;
    },
    goEstimate() {
      let url = `${window.location.origin}/estimate`;
      const params = {
        opaque: false,
        targetContactId: this.$route.query.targetContactId,
        levelCode: this.$route.query.levelCode,
      };
      // console.log("params", params);
      this.$go(url, params);
    },
    async setByself(row) {
      if (this.isFullScreen) {
        this.$toast("请返回竖屏下操作～");
        return;
      }
      //console.log("row", row);
      this.currentData = row;
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
      let baseApi = this.$ctx.baseApi;
      const params = {
        contactId: this.currentData.contactId,
      };
      const { data } = await this.$request.get(
        `${baseApi}/estimate/production/relationship`,
        { params }
      );
      // this.describe = "该美容顾问的目标由她的辅导老师王云在2021-07-02日更新。";
      this.describe = data.describe;
      this.popup = true;
      //console.log("data", data);
    },
    handleClickAvatar(row) {
      this.currentData = row;
      this.$nextTick(() => {
        this.$refs.clickAvatarActionSheet.showActions();
      });
    },
    sortMap(prop) {
      let propMap = {
        estimateProductionAmt: "ESTIMATE_PRODUCTION_AMT",
        setTargetProductionAmt: "SET_TARGET_PRODUCTION_AMT",
        setTargetIncomeAmt: "INCOME_TARGET_AMT",
        productionAmtRate: "PRODUCTIONAMT_RATE",
        productionAmt: "PRODUCTION_AMT",
        productionAmtM1: "PRODUCTION_AMT_M1",
        productionAmtM2: "PRODUCTION_AMT_M2",
        productionAmtM3: "PRODUCTION_AMT_M3",
        productionAmtM4: "PRODUCTION_AMT_M4",
        productionAmtM5: "PRODUCTION_AMT_M5",
        productionAmtM6: "PRODUCTION_AMT_M6",
        productionAmtM7: "PRODUCTION_AMT_M7",
        productionAmtM8: "PRODUCTION_AMT_M8",
        productionAmtM9: "PRODUCTION_AMT_M9",
        productionAmtM10: "PRODUCTION_AMT_M10",
        productionAmtM11: "PRODUCTION_AMT_M11",
        productionAmtM12: "PRODUCTION_AMT_M12",
      };
      return propMap[prop];
    },
    sortChange({ column, prop, order }) {
      if (order) {
        if (order === "descending") {
          order = "desc";
        } else if (order === "ascending") {
          order = "asc";
        }
        console.log("prop", prop);
        this.filter.sortEnum = this.sortMap(prop);
        this.filter.orderEnum = order.toLocaleUpperCase();
      } else {
        this.filter.sortEnum = null;
        this.filter.orderEnum = null;
      }
      this.tableData.data = [];
      this.filter.pageNo = 1;
      this.loadData();
    },
    async loadData() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      this.loading = true;
      const {
        pageNo,
        pageSize,
        careeLevels,
        activityStatuses,
        setTargetProductionAmt,
        setTargetIncomeAmt,
        sortEnum,
        orderEnum,
        debuteCount,
        isOrder,
        isNewBc,
        isFocus,
      } = this.filter;

      const params = {
        pageNo,
        pageSize,
        setTargetProductionAmt,
        setTargetIncomeAmt,
        sortEnum,
        orderEnum,
        debuteCount,
        isOrder,
        isNewBc,
        isFocus,
      };
      let baseApi = this.$ctx.baseApi;
      if (careeLevels && careeLevels.length) {
        params.levelCodeIds = careeLevels.join(",");
      }

      if (debuteCount && debuteCount.length) {
        params.debuteCount = debuteCount.join(",");
      }
      if (activityStatuses && activityStatuses.length) {
        params.statusCodeIds = activityStatuses.join(",");
      }
      this.filterParams = deepCopy(params);

      const res = await this.$request.get(`${baseApi}/reports/team/details`, {
        params,
      });

      this.total = res.data.total;
      this.loading = false;
      this.refreshing = false;
      if (!res.data.hasNextPage) {
        this.finished = true;
      } else {
        this.finished = false;
      }
      const map = new Map();
      let newMembers = this.tableData.data.concat(res.data.members);
      this.tableData.data = newMembers.filter(
        (nm) => !map.has(nm.contactId) && map.set(nm.contactId, 1)
      );
      // this.tableData.data = [...new Set(this.tableData.data.concat(res.data.members))];
      if (this.tableData.data && this.tableData.data.length) {
        this.showTable = true;
      } else {
        this.showTable = false;
      }

      window.scrollTo(0, scrollTop);

      this.filter.pageNo = this.filter.pageNo + 1;
      //dev
      this.retail = res.data;
    },
    async getFilterConditions() {
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(
        `${baseApi}/reports/team/filter-conditions`
      );
      //console.log("筛选", data);

      if (this.$route.query.levelCode >= 60) {
        this.filterConfig.forEach((item, index, arr) => {
          if (item.prop === "setTargetProductionAmt") {
            arr.splice(index, 1);
          }
        });
      }

      const { activityStatuses, careeLevels, debuteCount } = data;

      this.filterConfig.forEach((o) => {
        if (o.prop === "careeLevels" && careeLevels) {
          o.options = careeLevels.map((l) => ({
            name: `${l.careerLevelCode}(${l.dirCount})`,
            value: l.careerLevelId,
          }));
        }
        if (o.prop === "debuteCount" && debuteCount) {
          if (debuteCount.birthDebuteCount > 0) {
            o.options[0].name = `生日周年(${debuteCount.birthDebuteCount})`;
          }
          if (debuteCount.teamDebuteCount > 0) {
            o.options[1].name = `美容顾问周年(${debuteCount.teamDebuteCount})`;
          }
          if (debuteCount.dirDebuteCount > 0) {
            o.options.push({
              name: `督导周年(${debuteCount.dirDebuteCount})`,
              value: 3,
            });
          }
          if (debuteCount.nsdDebuteCount > 0) {
            o.options.push({
              name: `首席周年(${debuteCount.nsdDebuteCount})`,
              value: 4,
            });
          }
        }
        if (o.prop === "activityStatuses" && activityStatuses) {
          o.options = activityStatuses.map((l) => ({
            name: `${l.activityStatusCode}(${l.dirCount})`,
            value: l.activityStatusId,
          }));
        }
      });
      this.$nextTick(() => {
        this.$refs.filterAction.initFilterConfig();
      });
    },
    addZero(m) {
      return m < 10 ? `0${m}` : m;
    },
    back() {
      closeWebview();
    },
    async setTargetIncomerow(row) {
      if (this.accountType === "operation") {
        this.$toast("抱歉，暂时不支持对她进行操作～");
        return;
      }
      if (row.contactId == this.targetContactId) {
        this.setTargetIncome();
        //this.onRefresh()
      }

      if (!row.setTargetIncomeAmt && row.contactId != this.targetContactId) {
        // 分享逻辑
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

        this.$track({
          context: this.pageName,
          behavior: "TeamDetailsUnsetClick",
          item_type: this.pageName,
          item_id: "TeamDetailsUnsetClick",
        });
      }
    },
    async setTargetIncome() {
      if (this.accountType === "operation") {
        this.$toast("抱歉，暂时不支持对她进行操作～");
        return;
      }
      if (this.isSelf) {
        this.$refs.setTarget.setTargetIncome();
      } else {
        if (!this.retail.setTargetIncomeAmt) {
          // 分享逻辑
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
        }
      }
    },
    filterConfirm(filter) {
      //console.log("filter", filter);
      this.filter.pageNo = 1;
      this.filter = Object.assign(this.filter, filter);
      this.tableData.data = [];
      this.loadData();
    },
    //关注
    async isFollow() {
      const baseApi = this.$ctx.baseApi;

      const { data } = await this.$request.post(`${baseApi}/focus`, {
        focusContactId: this.currentData.contactId.toString(),
      });
      this.currentData.isFocus = !this.currentData.isFocus;
    },
    async onRefresh() {
      this.finished = false;
      this.refreshing = true;
      this.filter.pageNo = 1;
      this.tableData.data = [];
      this.loadData();
    },
    goProflie() {
      let url = `${window.location.origin}/profile`;
      const params = {
        opaque: false,
        targetContactId: this.currentData.contactId,
        levelCode: this.currentData.careerLevelCode,
        //跟进人
        followed: this.$route.query.targetContactId,
      };
      this.$go(url, params);
    },
    async share() {
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
      let baseApi = this.$ctx.baseApi;
      const inviteLinkData = await this.$request.post(`${baseApi}/invite/link`);

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
    async onSelect(item) {
      //console.log(item);
      switch (item.prop) {
        case "follow":
          this.isFollow(); //关注
          break;
        case "profile": //个人详情
          this.goProflie();
          break;
        case "setTarget": //邀请设置收入目标
          let { setTargetIncomeAmt } = this.currentData;
          let message = setTargetIncomeAmt
            ? "是否邀请修改收入目标"
            : "是否邀请设置收入目标";

          Dialog.confirm({
            message,
          })
            .then(() => {
              // on confirm
              this.share();
            })
            .catch(() => {
              // on cancel
            });

          break;
        case "assess": //查看目标评估
          var detailUrl = "";
          if (this.currentData.careerLevelCode >= 60) {
            detailUrl = `${window.location.origin}/unit`;
          } else {
            detailUrl = `${window.location.origin}/team`;
          }

          const query = {
            opaque: false,
            isSelf: "",
            targetContactId: this.currentData.contactId,
            levelCode: this.currentData.careerLevelCode,
            monthKey: this.$route.query.monthKey,
            navTitle: "收入目标评估",
          };
          if (this.currentData.contactId == this.targetContactId) {
            query.isSelf = true;
          } else {
            query.isSelf = false;
          }
          this.$go(detailUrl, query);
          break;
        case "call": //拨打电话
          window.location.href = `tel:${this.currentData.mobile}`;
          break;
      }
      this.$refs.clickAvatarActionSheet.show = false;
    },
    toTeamHistory() {
      let url = `${window.location.origin}/team_history`;
      const params = {
        opaque: false,
        targetContactId: this.targetContactId,
        levelCode: this.levelCode,
        accountType: this.accountType,
      };
      this.$go(url, params);
    },
    async toIncome() {
      let url = `${window.location.origin}/income`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        amount: this.retail.incomeAmt,
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
  },
  watch: {
    isFullScreen(n) {
      if (!n) {
        let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        this.$nextTick(() => {
          let filterContent = document.querySelector(".unit-content-filter");
          let unitContentIncome = document.querySelector(
            ".coach-home-content-income"
          );
          let tableHeaderWrap = document.querySelector(
            ".el-table__header-wrapper"
          );
          let tableFixedHeaderWrap = document.querySelector(
            ".el-table__fixed-header-wrapper"
          );
          let tableFixedBodyWrap = document.querySelector(
            ".el-table__fixed-body-wrapper"
          );
          let tableBodyWrap = document.querySelector(".el-table__body-wrapper");
          let commonTable = document.querySelector(".common-table");
          if (
            scrollTop > unitContentIncome.clientHeight &&
            commonTable.clientHeight +
              filterContent.clientHeight +
              this.navBarClientHeight >
              this.screenHeight
          ) {
            tableFixedHeaderWrap.style.cssText = `position: fixed;top: ${
              this.navBarClientHeight + filterContent.clientHeight - 1
            }px;width: 130px;z-index: 4;overflow: hidden;`;
            tableFixedBodyWrap.style.cssText = `top: ${
              tableHeaderWrap.clientHeight + filterContent.clientHeight - 1
            }px`;
            filterContent.style.cssText = `position: fixed;top: ${this.navBarClientHeight}px;right: 0;z-index: 5;width: 100%;`;
            tableHeaderWrap.style.cssText = `position: fixed;top: ${
              this.navBarClientHeight + filterContent.clientHeight - 1
            }px;z-index: 3;`;
            tableBodyWrap.style.cssText = `padding-top: ${
              tableHeaderWrap.clientHeight + filterContent.clientHeight - 1
            }px`;
          } else {
            tableFixedHeaderWrap.style.cssText = `position: absolute;top: 0`;
            tableFixedBodyWrap.style.cssText = `padding-top:0;top: ${tableFixedHeaderWrap.clientHeight}px;`;
            filterContent.style.cssText = `position: unset;`;
            tableHeaderWrap.style.cssText = `position: unset;`;
            tableBodyWrap.style.cssText = "padding-top: 0;";
          }
        });
      }
    },
    showTable(n) {
      if (n) {
        window.scrollTo(0, 0);
        this.$nextTick(() => {
          this.fixedHeader();
        });
      }
    },
  },
  components: {
    commonTable,
    largeText,
    List,
    NavBar,
    "van-button": Button,
    "van-tabbar": Tabbar,
    "van-tabbar-item": TabbarItem,
    "van-pull-refresh": PullRefresh,
    "van-field": Field,
    "van-icon": Icon,
    "van-popup": Popup,
    dropdowmMenu,
    clickAvatarActionSheet,
    productionSheet,
    SetTarget,
    "van-sticky": Sticky,
  },
};
</script>
<style lang="less" scoped>
.unit-detail {
  min-height: 100vh;
}
.coach-home-content {
  //padding-top: env(safe-area-inset-top);
  //margin-top: 80px;
  &-income {
    padding: 40px 30px 10px 30px;
    .retail-wrap {
      box-shadow: 0px 2px 8px 0px rgba(211, 211, 211, 0.5);
      padding: 20px 0;
      border-radius: 16px;
    }
  }
}
.retail-item-target {
  width: 180px;
  height: 48px;
  background: #fffaf0;
  border-radius: 24px;
  border: 1px solid #ffd6b3;
  color: #f99e79;
  font-size: 30px;
  margin: 0 auto;
  line-height: 48px;
}
.isAndroid {
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
.area_query {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 4vw;
  font-weight: bold;
  img {
    width: 4vw;
    height: 4.5vw;
    margin-right: 1.5vw;
  }
  /deep/.el-input__inner {
    border: none;
    padding: 0;
    font-size: 4vw;
    line-height: 2;
    height: auto;
    text-align: center;
    color: #333;
    font-weight: bold;
  }
  /deep/.el-input--suffix {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35vw;
  }
  /deep/.el-input__suffix {
    position: initial;
  }
  /deep/.el-select .el-input .el-select__caret {
    color: #f26899;
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
    .van-nav-bar__title {
      display: flex;
      align-items: center;
      .icon_q {
        width: 30px;
        height: 30px;
        margin-left: 10px;
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
.search {
  margin-right: 2vw;
  width: 46px;
  height: 47px;
}
.tablist {
  width: 36px;
  height: 10px;
}
.estimateBox {
  position: relative;
}
.icon-info {
  position: absolute;
  font-size: 28px;
  color: #f99e79;
  transform: translateY(-50%);
}
.retail {
  width: 690px;
  // height: 146px;
  background: #ffffff;
  // box-shadow: 0px 2px 8px 0px rgba(211, 211, 211, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  // margin-left: auto;
  // margin-right: auto;
  // margin-top: 130px;
  // margin-bottom: 50px;
  &-item-line {
    height: 59px;
    width: 1px;
    background-color: #efefef;
  }
  &-flex .retail-item {
    flex: 1;
  }
  &-flex-grow .retail-item {
    flex-grow: 1;
  }
  &-item {
    text-align: center;
    font-size: 42px;
    color: #484848;
    font-weight: bold;
    &-desc {
      font-size: 22px;
      color: #7f7f7f;
      font-weight: normal;
      margin-top: 16px;
    }
  }
}
.income-history {
  background-color: rgba(254, 235, 255, 0.44);
  padding: 0 28px;
  height: 40px;
  border-radius: 20px;
  color: #f16eae;
  font-size: 22px;
  text-align: center;
  line-height: 40px;
  font-weight: normal;
  border: none;
}
.retail-unit {
  margin-top: 30px;
}
.retail-product {
  margin-top: 30px;
}
.retail-icon {
  width: 25px;
}
/deep/.popupmodel {
  background: none;
}
.retail-num {
  color: #f99e79;
}
.icon-search {
  width: 46px;
  margin-right: 25px;
}
.icon-more {
  width: 42px;
}
.icon-screen {
  width: 42px;
  vertical-align: top;
}
.unit-content-filter {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 28px;
  font-weight: bold;
  color: #f16eae;
  line-height: 28px;
  padding: 30px 20px;
  background-color: #fff;
  .icon {
    width: 22px;
    margin-right: 8px;
  }
  .num {
    font-size: 22px;
    color: #000;
  }
}
.target-income {
  color: #f99e79;
  display: flex;
  align-items: center;
  justify-content: center;
  &-icon {
    width: 20px;
    margin-left: 6px;
  }
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.icon_crown {
  position: absolute;
  width: 32px;
  height: 30px;
  right: 36px;
  top: 12px;
}
.assess-performance {
  position: relative;
  display: inline-block;
  &-btn {
    padding: 0 12px;
    height: 44px;
    background-color: #fff7fd;
    color: #f16eae;
    font-size: 24px;
    border-color: #ffa7d2;
    border-radius: 9px;
    width: 150px;
  }
  &-tip {
    position: absolute;
    width: 24px;
    height: 24px;
    right: -10px;
    top: 0;
  }
}
.level_noself {
  font-size: 20px !important;

  color: #898989;
}
.status_noself {
  font-size: 20px !important;

  color: #898989;
}

.timePopup {
  background: none;
  /deep/ .van-popup__close-icon--top-right {
    top: 60px;
    right: 60px;
  }
}
.popupTime {
  padding: 50px;
  .msg {
    width: 600px;
    height: 233px;
    padding: 50px 45px 0;
    text-align: center;
    background: url(../../images/self.png) no-repeat center center;
    background-size: 100%;
    border-radius: 30px;
    span {
      font-size: 34px;
      font-weight: bold;
      color: #333;
      text-align: center;
      position: relative;
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
      font-weight: bold;
      color: #595959;
      margin-top: 30px;
      span {
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
.isFullScreen {
  /deep/.el-table__fixed-header-wrapper {
    position: fixed !important;
    top: 0 !important;
    width: 130px;
    z-index: 4;
    overflow: hidden;
  }
  /deep/.el-table__fixed-body-wrapper {
    top: 60px !important;
  }
  /deep/.el-table__header-wrapper {
    position: fixed !important;
    top: 0 !important;
    z-index: 3;
  }
  /deep/.el-table__body-wrapper {
    padding-top: 60px !important;
  }
}
.popupmodel {
  background: none;
  /deep/ .van-popup__close-icon--top-right {
    right: 70px;
  }
}
.popupmodel {
  background-color: transparent;
}
.popbox {
  padding: 0 50px;
  .msg {
    position: relative;
    width: 590px;
    height: 268px;
    background-image: url("../../images/self.png");
    background-size: 100%;
    background-repeat: no-repeat;
    padding-top: 50px;
    span {
      position: relative;
      font-size: 36px;
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
  &-title {
    font-size: 36px;
    text-align: center;
    margin: 0 auto;
    color: #541b5a;
    line-height: 1;
  }
  &-mes {
    font-size: 26px;
    padding: 0 37px 0 45px;
    color: #333333;
    margin-top: 36px;
    color: #333333;
    line-height: 44px;
  }
}
</style>
