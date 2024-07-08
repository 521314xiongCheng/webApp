<!-- 沙龙详情 -->
<template>
  <div
    class="unit-detail"
    :class="{
      isAndroid: !isIos,
      isFullScreen: isFullScreen,
      isIphoneX: isIphoneX,
    }"
  >
    <div v-show="!isFullScreen" class="content-header">
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
              @click="popupTime = !popupTime"
              src="../../images/icon_q.png"
              alt=""
            />
          </template>
          <template #right>
            <img
              class="icon-search"
              @click="toSearch"
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
      <div class="unit-content-income" v-show="!isFullScreen">
        <div class="retail-wrap">
          <div class="retail retail-flex">
            <div class="retail-item">
              <div>¥{{ baseData.incomeAmt | formatMoney }}</div>
              <div class="retail-item-desc">已达成收入</div>
            </div>
            <div class="retail-item" @click="setTargetIncome">
              <div class="target-income" v-if="baseData.setTargetIncomeAmt">
                <span>¥{{ baseData.targetIncomeAmt | formatMoney }}</span>
                <img
                  v-if="isSelf"
                  class="target-income-icon"
                  src="../../images/icon_edit_y.png"
                  alt=""
                />
              </div>
              <van-button v-else class="set-target">设目标</van-button>
              <div class="retail-item-desc">收入目标</div>
            </div>
            <div class="retail-item" @click="toIncome">
              <van-button class="income-history">历史收入</van-button>
            </div>
          </div>
          <div class="retail retail-unit retail-flex">
            <div
              class="retail-item"
              @click="toEstimate('UnitDetailsIncomeEvaluationClick')"
            >
              <div>¥{{ baseData.estimateIncomeAmt | formatMoney }}</div>
              <div class="retail-item-desc">收入评估</div>
            </div>
            <img src="../../images/icon_equal.png" class="retail-icon" alt="" />
            <div
              class="retail-item"
              @click="toEstimate('UnitDetailsManagementServiceFeeClick')"
            >
              <div>
                ¥{{
                  baseData.currentEstimateIncomeAmt.estimateIncomeAmt
                    | formatMoney
                }}
              </div>
              <div class="retail-item-desc">
                {{ baseData.currentEstimateIncomeAmt.describe }}
              </div>
            </div>
            <img src="../../images/icon_add.png" class="retail-icon" alt="" />
            <div
              class="retail-item"
              @click="toEstimate('UnitDetailsOthersServiceFeeClick')"
            >
              <div class="estimateBox">
                ¥{{
                  baseData.otherEstimateIncomeAmt.estimateIncomeAmt
                    | formatMoney
                }}
                <van-icon class="icon-info" name="info" />
              </div>
              <div class="retail-item-desc">
                {{ baseData.otherEstimateIncomeAmt.describe }}
              </div>
            </div>
          </div>
        </div>
        <div class="retail retail-product retail-flex">
          <div class="retail-item">
            <div>{{ baseData.productionAmt | formatMoney }}</div>
            <div class="retail-item-desc">已达成绩效</div>
          </div>
          <div class="retail-item">
            <div>
              {{ baseData.estimateProductionAmt | formatMoney }}
            </div>
            <div class="retail-item-desc">评估绩效累计</div>
          </div>
          <div class="retail-item" @click="toUnitHistory">
            <van-button class="income-history">历史绩效</van-button>
          </div>
        </div>
      </div>
      <div class="unit-content-filter" v-show="!isFullScreen">
        <img class="icon" src="../../images/select.png" alt="" />
        <dropdowm-menu
          :filterConfig="filterConfig"
          :filter="filter"
          ref="filterAction"
          pageName="UnitDetailsPage"
          filterClickEventName="UnitDetailsFilterClick"
          tagEventName="UnitDetailsFilterTagClick"
          resetEventName="UnitDetailsFilterResetClick"
          confirmEventName="UnitDetailsFilterConfirmClick"
          :total="total"
          @filterConfirm="filterConfirm"
          @filterActionIsOpen="filterActionIsOpen"
        ></dropdowm-menu>
      </div>
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
          ref="unitTable"
          :border="false"
          :tableData="tableData"
          :isFullScreen="isFullScreen"
          :setClassName="setClassName"
          @sortChange="sortChange"
        >
          <el-table-column
            label="头像"
            width="60px"
            fixed="left"
            align="center"
            prop="avatar"
            slot="between"
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
            align="center"
            fixed="left"
            header-align="center"
            width="70px"
            prop="name"
            slot="between"
          >
            <template slot-scope="{ row }">
              <div class="user">
                <div class="user-info">
                  <div class="user_name">
                    <span class="climp">{{ row.name }}</span>
                  </div>
                </div>
                <div
                  class="tags"
                  v-if="targetContactId === row.contactId.toString()"
                >
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
            align="center"
            prop="estimateProductionAmt"
            sortable="custom"
            width="96px"
            header-align="center"
            :sort-orders="['descending', 'ascending', null]"
          >
            <template slot-scope="{ row }">
              <div class="assess-performance">
                <van-button
                  v-if="!row.setTargetProductionAmt"
                  class="assess-performance-btn"
                  @click="setEstimateProduction(row)"
                  >评估绩效</van-button
                >
                <van-button
                  @click="setEstimateProduction(row)"
                  v-else
                  class="assess-performance-btn"
                  >{{ row.estimateProductionAmt | formatMoney }}</van-button
                >
                <img
                  v-if="!row.setBySelf && row.setTargetProductionAmt"
                  @click="getRelationship(row)"
                  class="assess-performance-tip"
                  src="../../images/avatar.png"
                  alt=""
                />
              </div>
            </template>
          </el-table-column>
        </common-table>
      </List>
      <div v-show="!showTable" class="nodata">
        <img src="../../images/nodata1.png" alt="" />
        <div>暂时没有数据</div>
      </div>
    </van-pull-refresh>
    <!-- 点击头像弹出层 -->
    <click-avatar-action-sheet
      ref="clickAvatarActionSheet"
      pageName="UnitDetailsPage"
      profileClickEventName="UnitDetailsClick"
      focusEventName="UnitDetailsSetFocusClick"
      unfocusEventName="UnitDetailsUnfocusClick"
      setTargetEventName="UnitDetailsSetIncomeTargetClick"
      callEventName="UnitDetailsPhoneCallClick"
      cancelEventName="UnitDetailsCancelClick"
      :info="currentData"
      :isFullScreen="isFullScreen"
      :accountType="accountType"
      :targetContactId="targetContactId"
      @onSelect="onSelect"
    />
    <set-target
      :isSettingTarget="baseData.setTargetIncomeAmt"
      :levelCode="levelCode"
      :incomeTargetIncomeAmt="baseData.targetIncomeAmt"
      ref="setTarget"
      pageName="UnitDetailsPage"
      @setTargetIncomeConfirm="setTargetIncomeConfirm"
    />

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
    <!-- 评估绩效面板 -->
    <productionSheet
      ref="productionAction"
      :contactId="productionContactId"
      queryType="unit"
      pageName="UnitDetailsPage"
      inputEventName="UnitDetailsRetailProdClick"
      lastMonthEventName="UnitDetailsLastMonthProdClick"
      sixMonthEventName="UnitDetailsSixMonthProdClick"
      saveEventName="UnitDetailsSaveRetailProdClick"
      inviteEventName="UnitDetailsInviteToSetTargetClick"
      :productionName="productionName"
      @addProduction="addProduction"
    ></productionSheet>
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
  </div>
</template>
<script>
import dropdowmMenu from "../../components/filterActionSheet/dropdowmMenu.vue";
import {
  NavBar,
  List,
  Button,
  Icon,
  Dialog,
  Popup,
  Sticky,
  PullRefresh,
} from "vant";
import {
  isIos,
  closeWebview,
  deepCopy,
  xxxxxx,
  formatMoney,
  isIphoneX,
} from "../../utils/index";
import commonTable from "../../components/commonTable.vue";
import SetTarget from "../../components/setTarget";
import productionSheet from "../../components/productionSheet/index.vue";
import horizontalScreen from "../../mixin/horizontalScreen";
import clickAvatarActionSheet from "../../components/clickAvatarActionSheet";

export default {
  components: {
    commonTable,
    List,
    NavBar,
    "van-button": Button,
    "van-icon": Icon,
    dropdowmMenu,
    clickAvatarActionSheet,
    SetTarget,
    productionSheet,
    "van-popup": Popup,
    "van-sticky": Sticky,
    "van-pull-refresh": PullRefresh,
  },
  mixins: [horizontalScreen],
  data() {
    return {
      showTable: true,
      navTitle: "",
      isIos: isIos(),
      isIphoneX: isIphoneX(),
      loading: true,
      finished: false,
      tableData: {
        header: [],
        data: [],
      },
      tableHeader: [
        {
          label: "绩效进度",
          sortable: "custom",
          minWidth: "90px",
          prop: "productionAmtRate",
          formatter: (row) => {
            return `${row.productionAmtRate}%`;
          },
        },
        {
          label: "当月绩效",
          sortable: "custom",
          minWidth: "90px",
          prop: "productionAmt",
          formatter: (row) => {
            return formatMoney(row.productionAmt, 2);
          },
        },
      ],
      filterConfig: [
        {
          prop: "tagIds",
          label: "分类",
          options: [],
        },
        {
          prop: "activityStatusCodes",
          label: "状态",
          options: [],
        },
        {
          prop: "careerLevelCodes",
          label: "职级",
          options: [],
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
          prop: "setTargetIncomeAmt",
          label: "收入目标",
          multiple: false,
          options: [
            {
              name: "已设置",
              value: true,
            },
            {
              name: "未设置",
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
      filter: {
        pageSize: 50,
        pageNo: 1,
        tagIds: [],
        careerLevelCodes: [],
        activityStatusCodes: [],
        setTargetProductionAmt: null,
        setTargetIncomeAmt: null,
        sortEnum: "ESTIMATE_PRODUCTION_AMT",
        orderEnum: "DESC",
        debuteCount: "",
      },
      currentData: {},
      baseData: {
        currentEstimateIncomeAmt: {},
        otherEstimateIncomeAmt: {},
      },
      total: 1,
      targetContactId: null,
      levelCode: 97,
      isSelf: true,
      monthKey: "",
      describe: "",
      popup: false,
      popupTime: false,
      productionContactId: "",
      productionName: "",
      filterParams: {},
      tableName: "unit",
      accountType: "",
      from: "", //从员工账号区域列表进入，可邀请设置收入目标
      tableHeaderFixed: true, //固定表头
      refreshing: false,
      refreshDisable: false,
      navBarClientHeight: 0, //fix 横屏后获取navBar错误
      pageName: "UnitDetailsPage",
      landscapeEventName: "UnitDetailsLandscapeClick",
      export2ExcelEventName: "UnitDetailsExcelExportClick",
    };
  },
  async created() {
    const {
      monthKey,
      levelCode,
      targetContactId,
      isSelf,
      accountType,
      navTitle,
      from,
      tagId,
      isOrder,
      isNewBc,
      isFocus,
      careerLevelCodes,
      activityStatusCodes,
    } = this.$route.query;
    if (navTitle) {
      this.navTitle = navTitle;
    } else {
      this.navTitle = "沙龙详情";
    }
    if (isOrder !== undefined) {
      this.filter.isOrder = JSON.parse(isOrder);
    }
    if (isNewBc !== undefined) {
      this.filter.isNewBc = JSON.parse(isNewBc);
    }
    if (isFocus !== undefined) {
      this.filter.isFocus = JSON.parse(isFocus);
    }
    if (tagId) {
      this.filter.tagIds = [tagId];
    }
    if (careerLevelCodes) {
      this.filter.careerLevelCodes = careerLevelCodes.split(",");
    }
    if (activityStatusCodes) {
      this.filter.activityStatusCodes = activityStatusCodes.split(",");
    }
    this.monthKey = monthKey;
    this.levelCode = Number(levelCode);
    this.targetContactId = targetContactId;
    this.isSelf = JSON.parse(isSelf);
    this.accountType = accountType;
    this.from = from;
    console.log(isSelf);
    let date = new Date(monthKey.substr(0, 4), monthKey.substr(4, 6));
    date.setMonth(date.getMonth() - 1, 1);
    for (let i = 1; i <= 12; i++) {
      date.setMonth(date.getMonth() - 1);
      let newDate = `${date.getFullYear()}/${this.addZero(
        date.getMonth() + 1
      )}`;
      this.tableHeader.push({
        label: `${newDate}`,
        sortable: "custom",
        minWidth: "90px",
        prop: `productionAmtM${i}`,
        formatter: (row) => {
          return formatMoney(row[`productionAmtM${i}`], 2);
        },
      });
    }
    this.tableData.header = this.tableHeader;
    this.loadData();
    this.getFilterConditions();
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
  methods: {
    fixedHeader() {
      let navBar = document.querySelector(".van-nav-bar");
      let filterContent = document.querySelector(".unit-content-filter");
      let unitContentIncome = document.querySelector(".unit-content-income");
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
    filterActionIsOpen(type) {
      this.refreshDisable = type;
    },
    async onFronted() {
      const params = deepCopy(this.filterParams);
      params.pageNo = 1;
      params.pageSize = this.tableData.data.length || 20;
      let baseApi = this.$ctx.baseApi.replace("v1", "v2");
      const { data } = await this.$request.get(
        `${baseApi}/reports/unit/details`,
        {
          params,
        }
      );

      this.baseData = data;

      this.tableData.data.forEach((table, index, tableData) => {
        data.members.forEach((item, i) => {
          if (table.contactId === item.contactId) {
            tableData.splice(index, 1, item);
          }
        });
      });
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
    async getRelationship(row) {
      if (this.isFullScreen) {
        this.$toast("请返回竖屏下操作～");
        return;
      }
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
      let baseApi = this.$ctx.baseApi;
      const params = {
        contactId: row.contactId,
      };
      const { data } = await this.$request.get(
        `${baseApi}/estimate/production/relationship`,
        { params }
      );
      console.log("data", data);
      // this.describe = "该美容顾问的目标由她的辅导老师王云在2021-07-02日更新。";
      this.describe = data.describe;
      this.popup = true;
    },
    async getFilterConditions() {
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(
        `${baseApi}/reports/unit/filter-conditions`
      );
      const { activityStatusCodes, careerLevelCodes, tagIds, debuteCount } =
        data;

      this.filterConfig.forEach((o) => {
        if (o.prop === "careerLevelCodes" && careerLevelCodes) {
          o.options = careerLevelCodes.map((l) => ({
            name: `${l.careerLevelCode}(${l.count})`,
            value: l.careerLevelCode,
          }));
        }
        if (o.prop === "debuteCount" && debuteCount) {
          if (debuteCount.birthDebuteCount > 0) {
            o.options[0].name = `生日周年(${debuteCount.birthDebuteCount})`;
          }
          if (debuteCount.teamDebuteCount > 0) {
            o.options[1].name = `美容顾问周年(${debuteCount.teamDebuteCount})`;
          }
          // if (debuteCount.dirDebuteCount > 0) {
          //   o.options[2].name = `督导周年(${debuteCount.dirDebuteCount})`;
          // }
          // if (debuteCount.nsdDebuteCount > 0 ) {
          //   o.options[3].name = `首席周年(${debuteCount.nsdDebuteCount})`;
          // }
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
        if (o.prop === "activityStatusCodes" && activityStatusCodes) {
          o.options = activityStatusCodes.map((l) => ({
            name: `${l.activityStatusCode}(${l.count})`,
            value: l.activityStatusCode,
          }));
        }
        if (o.prop === "tagIds" && tagIds) {
          o.options = tagIds.map((l) => ({
            name: `${l.tagName}(${l.count})`,
            value: l.tagId,
          }));
        }
      });
      console.log(this.filterConfig, "filterConfig");
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
    async loadData() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      this.loading = true;
      const {
        pageNo,
        pageSize,
        tagIds,
        careerLevelCodes,
        activityStatusCodes,
        setTargetProductionAmt,
        setTargetIncomeAmt,
        sortEnum,
        orderEnum,
        debuteCount,
        isOrder,
        isNewBc,
        isFocus,
      } = this.filter;

      //sortEnum.SET_TARGET_PRODUCTION_AMT=true
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

      if (tagIds && tagIds.length) {
        params.tagIds = tagIds.join(",");
      }
      if (debuteCount && debuteCount.length) {
        params.debuteCount = debuteCount.join(",");
      }
      if (careerLevelCodes && careerLevelCodes.length) {
        params.careerLevelCodes = careerLevelCodes.join(",");
      }
      if (activityStatusCodes && activityStatusCodes.length) {
        params.activityStatusCodes = activityStatusCodes.join(",");
      }

      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
      let baseApi = this.$ctx.baseApi.replace("v1", "v2");
      // 存params 用于从搜索页返回时做数据对比
      this.filterParams = deepCopy(params);
      const { data } = await this.$request.get(
        `${baseApi}/reports/unit/details`,
        {
          params,
        }
      );

      this.total = data.total;
      this.baseData = data;

      this.loading = false;
      this.refreshing = false;
      if (!data.hasNextPage) {
        this.finished = true;
      } else {
        this.finished = false;
      }
      const map = new Map();
      let newMembers = this.tableData.data.concat(data.members);
      this.tableData.data = newMembers.filter(
        (nm) => !map.has(nm.contactId) && map.set(nm.contactId, 1)
      );
      if (this.tableData.data && this.tableData.data.length) {
        this.showTable = true;
      } else {
        this.showTable = false;
      }
      // table数据更新后会直接滚动到页面底部导致一直触发load事件
      window.scrollTo(0, scrollTop);
      this.filter.pageNo = this.filter.pageNo + 1;
    },
    async onRefresh() {
      this.finished = false;
      this.refreshing = true;
      this.filter.pageNo = 1;
      this.tableData.data = [];
      this.loadData();
    },
    async setTargetIncome() {
      this.$track({
        context: "UnitDetailsPage",
        behavior: "UnitDetailsSetTargetClick",
        item_type: "UnitDetailsPage",
        item_id: "UnitDetailsSetTargetClick",
      });
      if (this.accountType === "operation" && this.from !== "employeeArea") {
        this.$toast("抱歉，暂时不支持对她进行操作～");
        return;
      }
      if (this.isSelf) {
        this.$refs.setTarget.setTargetIncome();
      } else {
        if (!this.baseData.setTargetIncomeAmt) {
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
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(
        `${baseApi}/reports/unit/details`
      );
      this.baseData = data;
    },
    filterConfirm(filter) {
      console.log("11", filter);
      this.filter.pageNo = 1;
      this.filter = Object.assign(this.filter, filter);
      this.tableData.data = [];
      this.loadData();
    },
    handleClickAvatar(row) {
      this.currentData = row;
      this.$nextTick(() => {
        this.$refs.clickAvatarActionSheet.showActions();
      });
    },
    async onSelect(item) {
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
      let baseApi = this.$ctx.baseApi;
      switch (item.prop) {
        case "follow": //关注
          const { data } = await this.$request.post(`${baseApi}/focus`, {
            focusContactId: this.currentData.contactId.toString(),
          });
          this.currentData.isFocus = !this.currentData.isFocus;
          console.log(this.currentData.isFocus);
          break;
        case "profile": //个人详情
          let url = `${window.location.origin}/profile`;
          const params = {
            opaque: false,
            targetContactId: this.currentData.contactId,
            levelCode: this.currentData.careerLevelCode,
            from: "unit", //督导可以查看沙龙成员的美容顾问小组成员
            //跟进人
            followed: this.$route.query.targetContactId,
          };
          this.$go(url, params);
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
          let path = "team";
          if (Number(this.currentData.careerLevelCode) >= 60) {
            path = "unit";
          }
          let detailUrl = `${window.location.origin}/${path}`;
          const query = {
            opaque: false,
            isSelf: false,
            targetContactId: this.currentData.contactId,
            levelCode: this.currentData.careerLevelCode,
            monthKey: this.monthKey,
            navTitle: "收入目标评估",
          };
          this.$go(detailUrl, query);
          break;
        case "call": //拨打电话
          window.location.href = `tel:${this.currentData.mobile}`;
          break;
      }
      this.$refs.clickAvatarActionSheet.show = false;
    },
    toEstimate(eventType) {
      this.$track({
        context: "UnitDetailsPage",
        behavior: eventType,
        item_type: "UnitDetailsPage",
        item_id: eventType,
      });
      let url = `${window.location.origin}/estimate`;
      const params = {
        opaque: false,
        targetContactId: this.targetContactId,
        levelCode: this.levelCode,
      };
      this.$go(url, params);
    },
    sortMap(prop) {
      let propMap = {
        estimateProductionAmt: "ESTIMATE_PRODUCTION_AMT",
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
    setEstimateProduction(row) {
      this.$track({
        context: "UnitDetailsPage",
        behavior: "UnitDetailsRetailProdEstimateClick",
        item_type: "UnitDetailsPage",
        item_id: "UnitDetailsRetailProdEstimateClick",
      });
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
      this.$refs.productionAction.showProductionAction = true;
    },
    async addProduction(targetAmt) {
      // this.setproductionAmtM = false
      // this.currentData.setTargetProductionAmt = true
      // this.currentData.estimateProductionAmt = targetAmt
      // this.currentData.setBySelf = true
      this.$refs.productionAction.showProductionAction = false;
      this.onFronted();
      this.reloadData();
    },
    async reloadData() {
      let baseApi = this.$ctx.baseApi.replace("v1", "v2");
      const { data } = await this.$request.get(
        `${baseApi}/reports/unit/details`
      );
      this.baseData = data;
    },
    toSearch() {
      let url = `${window.location.origin}/unit_search`;
      const params = {
        targetContactId: this.targetContactId,
        monthKey: this.monthKey,
        levelCode: this.levelCode,
      };
      this.$go(url, params);
    },
    toUnitHistory() {
      this.$track({
        context: "UnitDetailsPage",
        behavior: "UnitDetailsHistoryProdClick",
        item_type: "UnitDetailsPage",
        item_id: "UnitDetailsHistoryProdClick",
      });
      let url = `${window.location.origin}/unit_history`;
      const params = {
        opaque: false,
        targetContactId: this.targetContactId,
        levelCode: this.levelCode,
        accountType: this.accountType,
        from: "UnitDetailsPage",
      };
      this.$go(url, params);
    },
    async toIncome() {
      this.$track({
        context: "UnitDetailsPage",
        behavior: "UnitDetailsHistoryIcomeClick",
        item_type: "UnitDetailsPage",
        item_id: "UnitDetailsHistoryIcomeClick",
      });
      let url = `${window.location.origin}/income`;
      const params = {
        monthKey: this.monthKey,
        opaque: false,
        amount: this.baseData.incomeAmt,
        targetContactId: this.targetContactId,
        levelCode: this.levelCode,
        from: "UnitDetailsPage",
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
            ".unit-content-income"
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
              navBar.clientHeight + filterContent.clientHeight - 1
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
      } else {
        let filterContent = document.querySelector(".unit-content-filter");
        filterContent.style.cssText = `position: unset;`;
      }
    },
    popupTime(n) {
      if (n) {
        this.$track({
          context: "UnitDetailsPage",
          behavior: "UnitDetailsRuleIconClick",
          item_type: "UnitDetailsPage",
          item_id: "UnitDetailsRuleIconClick",
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.unit-detail {
  // padding-top: env(safe-area-inset-top);
  min-height: 100vh;
  .unit-content {
    // padding-top: env(safe-area-inset-top);
    // margin-top: 80px;
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
    .icon_crown {
      position: absolute;
      width: 32px;
      right: 26px;
      top: 7px;
    }
    &-income {
      padding: 40px 30px 10px 30px;
      // box-sizing: content-box;
      // margin-bottom: 10px;
      .retail-wrap {
        box-shadow: 0px 2px 8px 0px rgba(211, 211, 211, 0.5);
        padding: 20px 0;
        border-radius: 16px;
      }
      .retail {
        display: flex;
        justify-content: center;
        align-items: center;
        &-item-line {
          height: 60px;
          width: 1px;
          background-color: #d1d1d1;
        }
        &-flex .retail-item {
          flex: 1;
        }
        &-flex-grow .retail-item {
          flex-grow: 1;
        }
        &-item {
          text-align: center;
          font-size: 36px;
          line-height: 48px;
          color: #484848;
          font-weight: bold;
          &-desc {
            font-size: 22px;
            line-height: 28px;
            color: #7f7f7f;
            font-weight: normal;
            margin-top: 11px;
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
          .set-target {
            // width: 180px;
            padding: 0 30px;
            height: 48px;
            background-color: #fffaf0;
            color: #f99e79;
            font-size: 30px;
            border-color: #ffd6b3;
            border-radius: 24px;
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
          .estimateBox {
            position: relative;
          }
          .icon-info {
            position: absolute;
            font-size: 28px;
            color: #f99e79;
            transform: translateY(-50%);
          }
        }
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
    }
    &-filter {
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
      top: -9px;
      z-index: 2;
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
}
.isAndroid {
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
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
    }
  }
  .van-nav-bar__title {
    color: #fff;
    // font-size: 30px;
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
</style>
