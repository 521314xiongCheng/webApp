<template>
  <div
    class="unit-detail"
    :class="{ isAndroid: !isIos, isFullScreen: isFullScreen }"
  >
    <div v-show="!isFullScreen">
      <van-sticky>
        <NavBar
          left-text="返回"
          title="DIQ跟进"
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
            DIQ跟进
            <img
              class="icon_q"
              @click="popupRule = !popupRule"
              src="../../../images/icon_q.png"
              alt=""
            />
          </template>

          <template #right>
            <img
              @click="toSearch"
              class="icon-search"
              src="../../../images/index/icon_search.png"
              alt=""
            />
            <template>
              <span @click="gofullscreen()">
                <img
                  class="icon-screen"
                  src="../../../images/screen.png"
                  alt=""
                />
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
          <img src="../../../images/refresh-icon.gif" alt="" />
        </div>
        <p class="refresh-text">下拉刷新</p>
      </template>
      <template #loosing>
        <div class="refresh-icon">
          <img src="../../../images/refresh-icon.gif" alt="" />
        </div>
        <p class="refresh-text">松开刷新</p>
      </template>
      <template #loading>
        <div class="refresh-icon">
          <img src="../../../images/refresh-icon.gif" alt="" />
        </div>
        <p class="refresh-text">刷新中</p>
      </template>
      <div class="unit-home-content" v-show="!isFullScreen">
        <div class="unit-home-content-wrap">
          <Tabs ref="tabs" v-model="currentTabName" @click="handleTabClick">
            <Tab title="申请期" name="apply" v-if="true"></Tab>
            <Tab title="考核期" name="assess"></Tab>
          </Tabs>
          <!-- 筛选 -->
          <div
            class="unit-content-filter"
            :class="{ sb_class: currentTabName === 'apply' }"
          >
            <img class="icon" src="../../../images/select.png" alt="" />
            <dropdowm-menu
              :filterConfig="filterConfig"
              :filter="filter"
              ref="filterAction"
              :pageName="pageName"
              filterClickEventName="DIQDetailsFilterClick"
              tagEventName="DIQDetailsFilterTagClick"
              resetEventName="DIQDetailsFilterResetClick"
              confirmEventName="DIQDetailsFilterConfirmClick"
              :total="total"
              @filterConfirm="filterConfirm"
              @filterActionIsOpen="filterActionIsOpen"
            ></dropdowm-menu>
          </div>
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
          ref="gemPointTable"
          :border="false"
          :tableData="tableData"
          :isFullScreen="isFullScreen"
          :setClassName="setClassName"
          @sortChange="sortChange"
        >
          <el-table-column
            fixed="left"
            label="头像"
            width="60px"
            prop="avatar"
            align="center"
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
                  src="../../../images/crown.png"
                  alt=""
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="姓名"
            fixed="left"
            width="70px"
            align="center"
            header-align="center"
          >
            <template slot-scope="{ row }">
              <div class="user">
                <div class="user-info">
                  <div class="user_name">
                    <span class="climp">{{ row.name }}</span>
                  </div>
                </div>
                <div class="no-self">
                  <span class="level">{{ row.careerLevelCode }}</span>
                  <span class="line"></span>
                  <span class="status">{{ row.activityStatusCode }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </common-table>
      </List>
      <div v-show="!showTable" class="nodata">
        <img src="../../../images/nodata1.png" alt="" />
        <div>暂时没有数据</div>
      </div>
    </van-pull-refresh>
    <!-- 规则 -->
    <van-popup
      v-model="popupRule"
      class="timePopup"
      position="center"
      round
      closeable
    >
      <div class="popupRule">
        <div class="title">
          {{ currentTabName === "apply" ? "DIQ申请期规则" : "DIQ考核期规则" }}
        </div>
        <div v-if="currentTabName === 'apply'">
          <p>
            连续<span class="default-color">1-3</span
            >个月内，累计零售销售绩效需达成<span class="default-color"
              >4,800</span
            >，本人需培养<span class="default-color">10</span>名<span
              class="default-color"
              >A</span
            >顾问，本人需通过“DIQ网上申请和自测”，且申请前<span
              class="default-color"
              >2</span
            >个月内无书面提醒，前<span class="default-color">4</span
            >个月无书面警告及以上警告处分。
          </p>
        </div>
        <div v-else>
          <p>
            本人每月需保持<span class="default-color">A</span
            >状态，且DIQ沙龙销售绩效需至少每月达成10,000。
          </p>
          <p>
            本人累计零售销售绩效最多可计入<span class="default-color"
              >10,000</span
            >至DIQ沙龙销售绩效。
          </p>
          <p>
            若考核期三个月内除DIQ沙龙<span class="default-color">A</span
            >成员外均已达成，可顺延一个月达成该条件。
          </p>
        </div>
      </div>
    </van-popup>
    <img
      v-if="isFullScreen"
      @click="resetToPortraitScreen"
      src="../../../images/portraitscreen.png"
      class="resetToPortraitScreen"
      alt=""
    />
  </div>
</template>
<script>
import dropdowmMenu from "../../../components/filterActionSheet/dropdowmMenu.vue";
import {
  NavBar,
  Button,
  Tabbar,
  TabbarItem,
  Field,
  Icon,
  List,
  ActionSheet,
  Sticky,
  PullRefresh,
  Popup,
  Tab,
  Tabs,
} from "vant";
import commonTable from "../../../components/commonTable.vue";

import {
  isIos,
  closeWebview,
  deepCopy,
  formatMoney,
} from "../../../utils/index";
import horizontalScreen from "../../../mixin/horizontalScreen";
export default {
  mixins: [horizontalScreen],
  data() {
    return {
      currentTabName: "assess",
      showTable: true,
      popupRule: false,
      isSelf: false,
      currentData: {},
      isFullScreen: false,
      isEmployee: true,
      tableName: "area-diq",
      showActions: false,
      levelCode: 97,
      isIos: isIos(),
      contactId: "",
      loading: true,
      finished: false,
      tableData: {
        data: [],
        header: [],
      },
      applyHeader: [
        {
          label: "累计零售\n绩效",
          width: 80,
          prop: "totalProductionAmt",
          formatter: (row) => {
            return formatMoney(row.totalProductionAmt);
          },
        },
        {
          label: "零售绩效\n达成4800",
          width: 80,
          prop: "productionAmtReachedStatus",
          formatter: (row) => {
            return row.productionAmtReachedStatus ? "已达成" : "未达成";
          },
        },
        {
          label: "培养A状态\n顾问数",
          width: 80,
          prop: "trainAContactNum",
          formatter: (row) => {
            return `${row.trainAContactNum}/10`;
          },
        },
        {
          label: "DIQ网上申请\n和自测",
          width: 90,
          prop: "onlineSelfExamStatus",
          formatter: (row) => {
            switch (row.onlineSelfExamStatus) {
              case 0:
                return "未自测";
              case 1:
                return "已通过";
              case 2:
                return "未通过";
            }
          },
        },
        {
          label: "是否有行为\n规范处理",
          width: 90,
          prop: "citationStatus",
        },
        {
          label: "督导姓名",
          prop: "directorName",
        },
      ],
      assessHeader: [
        {
          label: "DIQ考核\n月份",
          prop: "assessMonthNo",
          formatter: (row) => {
            return this.assessMonthNoMap(row.assessMonthNo);
          },
        },
        {
          label: "累计零售\n绩效",
          prop: "productionAmt",
          formatter: (row) => {
            return formatMoney(row.productionAmt);
          },
        },
        {
          label: "零售绩效\n达成4800",
          prop: "isProductionReach",
          formatter: (row) => {
            return row.isProductionReach ? "已达成" : "未达成";
          },
        },
        {
          label: "累计DIQ\n沙龙绩效",
          prop: "diqProductionAmt",
          formatter: (row) => {
            return formatMoney(row.diqProductionAmt);
          },
        },
        {
          label: "DIQ沙龙绩效\n达成45000",
          prop: "isDiqProductionReach",
          minWidth: "90px",
          formatter: (row) => {
            return row.isDiqProductionReach ? "已达成" : "未达成";
          },
        },
        {
          label: "DIQ沙龙成员\nA成员",
          prop: "activeConsultantCount",
          minWidth: "90px",
        },
        {
          label: "DIQ沙龙成员\n达成20A",
          prop: "isActiveConsultantCountReach",
          minWidth: "90px",
          formatter: (row) => {
            return row.isActiveConsultantCountReach ? "已达成" : "未达成";
          },
        },
        {
          label: "每月A状态",
          prop: "isActiveEveryMonth",
          formatter: (row) => {
            let month = Number(this.$route.query.monthKey.substr(4, 6));
            return row.isActiveEveryMonth ? "已达成" : `${month}月未达成`;
          },
        },
        {
          label: "是否有行为\n规范处理",
          prop: "citationDate",
          formatter: (row) => {
            return row.citationDate ? row.citationDate : "-";
          },
        },
        {
          label: "督导姓名",
          prop: "directorName",
        },
      ],
      filterParams: {},
      filterText: "筛选",
      filterSheet: false,
      total: 0,
      //分页
      filter: {
        pageSize: 20,
        pageNo: 1,
        sortEnum: null,
        orderEnum: null,
      },
      filterConfig: [],
      applyFilterConfig: [
        {
          prop: "productionAmtReachedStatus",
          label: "累计零售绩效",
          multiple: false,
          options: [
            {
              name: "已达成",
              value: 1,
            },
            {
              name: "未达成",
              value: 0,
            },
          ],
        },
        {
          prop: "trainAContactStatus",
          label: "直接培养A状态",
          multiple: false,
          options: [
            {
              name: "已达成",
              value: 1,
            },
            {
              name: "未达成",
              value: 0,
            },
          ],
        },
        {
          prop: "onlineSelfExamStatus",
          label: "网上申请与自测",
          multiple: false,
          options: [
            {
              name: "已通过",
              value: 1,
            },
            {
              name: "未通过",
              value: 2,
            },
            {
              name: "未自测",
              value: 0,
            },
          ],
        },
        {
          prop: "citationStatus",
          label: "是否行为规范处理",
          multiple: false,
          options: [
            {
              name: "是",
              value: 1,
            },
            {
              name: "否",
              value: 0,
            },
          ],
        },
      ],
      assessFilterConfig: [
        {
          prop: "assessMonthNo",
          label: "考核月份",
          options: [
            {
              name: "第一月",
              value: "0",
            },
            {
              name: "第二月",
              value: "1",
            },
            {
              name: "第三月",
              value: "2",
            },
            {
              name: "第四月",
              value: "3",
            },
          ],
        },
        {
          prop: "isProductionReach",
          label: "零售绩效",
          multiple: false,
          options: [
            {
              name: "已达成",
              value: true,
            },
            {
              name: "未达成",
              value: false,
            },
          ],
        },
        {
          prop: "isDiqProductionReach",
          label: "DIQ沙龙绩效",
          multiple: false,
          options: [
            {
              name: "已达成",
              value: true,
            },
            {
              name: "未达成",
              value: false,
            },
          ],
        },
        {
          prop: "isActiveConsultantCountReach",
          label: "DIQ沙龙成员达成20A",
          multiple: false,
          options: [
            {
              name: "已达成",
              value: true,
            },
            {
              name: "未达成",
              value: false,
            },
          ],
        },
        {
          prop: "isActiveEveryMonth",
          label: "每月A状态",
          multiple: false,
          options: [
            {
              name: "已达成",
              value: true,
            },
            {
              name: "未达成",
              value: false,
            },
          ],
        },
        {
          prop: "isCitation",
          label: "是否行为规范处理",
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
          prop: "diqDebuteCountDTO",
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
      ],
      refreshing: false,
      refreshDisable: false,
      navBarClientHeight: 0, //fix 横屏后获取navBar错误
      pageName: "StaffDIQDetailsPage",
      landscapeEventName: "DIQDetailsLandscapeClick",
    };
  },
  async created() {
    const { levelCode, targetContactId, isSelf, isOrder, isNewBc, tabType } =
      this.$route.query;
    if (isOrder !== undefined) {
      this.filter.isOrder = JSON.parse(isOrder);
    }
    if (isNewBc !== undefined) {
      this.filter.isNewBc = JSON.parse(isNewBc);
    }
    this.levelCode = Number(levelCode);
    this.isSelf = JSON.parse(isSelf);
    this.targetContactId = targetContactId;
    this.currentTabName = tabType ? tabType : "apply";
    console.log(this.currentTabName);
    this.filterConfig = this[`${this.currentTabName}FilterConfig`];
    console.log(this.filterConfig);
    this.tableData.header = this[`${this.currentTabName}Header`];
    this.loadData();
    if (this.currentTabName === "assess") {
      this.getFilterConditions();
    } else {
      this.$nextTick(() => {
        this.$refs.filterAction.initFilterConfig();
      });
    }
    setTimeout(() => {
      //初始化时位置计算错位，放在nextTickt中无效
      this.$refs.tabs.resize();
    }, 80);
  },
  // created() {

  // },
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
      // let filterContent = document.querySelector(".unit-content-filter");
      let filterContent = document.querySelector(".unit-home-content-wrap");
      let tableHeaderWrap = document.querySelector(".el-table__header-wrapper");
      let tableBodyWrap = document.querySelector(".el-table__body-wrapper");
      let commonTable = document.querySelector(".common-table");
      // filterContent.style.cssText = `position: unset;`;
      // tableHeaderWrap.style.cssText = `position: unset;`;
      // tableBodyWrap.style.cssText = "padding-top: 0;";
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
          if (scrollTop > 0) {
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
      let filterContent = document.querySelector(".unit-home-content-wrap");
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
      filterContent.style.cssText = `position: unset;`;
      if (tableHeaderWrap) {
        tableHeaderWrap.style.cssText = `position: unset;`;
      }
      if (tableBodyWrap) {
        tableBodyWrap.style.cssText = "padding-top: 0;";
      }
      if (tableFixedHeaderWrap) {
        tableFixedHeaderWrap.style.cssText = `position: absolute;top: 0`;
      }
      if (tableFixedBodyWrap) {
        tableFixedBodyWrap.style.cssText = `padding-top:0;top: ${tableFixedHeaderWrap.clientHeight}px;`;
      }
      window.scrollTo(0, 0);
    },
    handleTabClick(n) {
      this.initTableFixed();
      this.currentTabName = n;
      this.filterConfig = this[`${n}FilterConfig`];
      this.tableData.header = this[`${n}Header`];
      this.filter = {
        pageSize: 50,
        pageNo: 1,
        sortEnum: null,
        orderEnum: null,
        offSpringLineNumbers: [],
      };
      if (n === "assess") {
        this.getFilterConditions();
      } else {
        this.$nextTick(() => {
          this.$refs.filterAction.initFilterConfig();
        });
      }

      this.$refs.filterAction.setFilterText("筛选");
      this.filter.pageNo = 1;
      this.tableData.data = [];
      this.loadData();
    },
    filterActionIsOpen(type) {
      this.refreshDisable = type;
    },
    async onFronted() {
      const params = deepCopy(this.filterParams);
      params.pageNo = 1;
      params.pageSize = this.tableData.data.length || 20;
      let baseApi = this.$ctx.baseApi;
      let apiUrl = `${baseApi}/reports/employee/area-diq`;
      if (this.currentTabName === "apply") {
        apiUrl = `${baseApi}/reports/employee/diq/applyperiod`;
      }
      const { data } = await this.$request.get(apiUrl, {
        params,
      });
      let members = data.members || data.pageList;
      this.tableData.data.forEach((table, index, tableData) => {
        members.forEach((item, i) => {
          if (table.contactId === item.contactId) {
            tableData.splice(index, 1, item);
          }
        });
      });
    },
    toSearch() {
      this.$track({
        context: "StaffDIQDetailsPage",
        behavior: "DIQDetailsProfileSearchIconClick",
        item_type: "StaffDIQDetailsPage",
        item_id: "DIQDetailsProfileSearchIconClick",
      });
      let url = `${window.location.origin}/operation_areadiq_search`;
      const params = {
        targetContactId: this.$route.query.targetContactId,
        monthKey: this.$route.query.monthKey,
        accountType: "operation",
        currentTabName: this.currentTabName,
      };
      this.$go(url, params);
    },
    handleClickAvatar(row) {
      if (this.isFullScreen) {
        this.$toast("请返回竖屏下操作～");
        return;
      }
      this.currentData = row;
      this.goProflie();

      //console.log( 'currentData',this.currentData)
    },
    sortMap(prop) {
      let propMap = {
        totalProductionAmt: "TOTAL_PRODUCTION_AMT",
        productionAmtReachedStatus: "PRODUCTION_AMT_REACHED_STATUS",
        trainAContactNum: "TRAIN_A_CONTACT_NUM",
        onlineSelfExamStatus: "ONLINE_SELF_EXAM_STATUS",
        citationStatus: "CITATION_STATUS",
        offSpringLineNumber: "OFF_SPRING_LINE_NUMBER",
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
    async loadData() {
      this.loading = true;
      const {
        pageNo,
        pageSize,
        isActiveConsultantCountReach,
        assessMonthNo,
        isProductionReach,
        isActiveEveryMonth,
        isCitation,
        isDiqProductionReach,
        offSpringLineNumbers,
        isOrder,
        diqDebuteCountDTO,
        onlineSelfExamStatus,
        citationStatus,
        productionAmtReachedStatus,
        trainAContactStatus,
        sortEnum,
        orderEnum,
      } = this.filter;

      const params = {
        isActiveConsultantCountReach,
        pageNo,
        pageSize,
        isProductionReach,
        isActiveEveryMonth,
        isCitation,
        isDiqProductionReach,
        isOrder,
        onlineSelfExamStatus,
        citationStatus,
        productionAmtReachedStatus,
        trainAContactStatus,
        sortEnum,
        orderEnum,
      };
      params.debuteCount = diqDebuteCountDTO;

      let baseApi = this.$ctx.baseApi;
      if (assessMonthNo && assessMonthNo.length) {
        params.assessMonthNo = assessMonthNo.join(",");
      }
      if (offSpringLineNumbers && offSpringLineNumbers.length) {
        params.offSpringLineNumbers = offSpringLineNumbers.join(",");
      }
      if (diqDebuteCountDTO && diqDebuteCountDTO.length) {
        params.debuteCount = diqDebuteCountDTO.join(",");
      }
      let apiUrl = `${baseApi}/reports/employee/area-diq`;
      if (this.currentTabName === "apply") {
        apiUrl = `${baseApi}/reports/employee/diq/applyperiod`;
      }
      const res = await this.$request.get(apiUrl, {
        params,
      });
      this.filterParams = deepCopy(params);
      this.total = res.data.total || res.data.totalCount;

      let members = res.data.members || res.data.pageList;
      if (!res.data.hasNextPage) {
        this.finished = true;
      } else {
        this.finished = false;
      }
      const map = new Map();
      let newMembers = this.tableData.data.concat(members);
      this.tableData.data = newMembers.filter(
        (nm) => !map.has(nm.contactId) && map.set(nm.contactId, 1)
      );
      if (this.tableData.data && this.tableData.data.length) {
        this.showTable = true;
      } else {
        this.showTable = false;
      }
      this.loading = false;
      this.refreshing = false;
      this.filter.pageNo = this.filter.pageNo + 1;
    },
    assessMonthNoMap(assessMonthNo) {
      switch (assessMonthNo) {
        case 0:
          return "第一月";
        case 1:
          return "第二月";
        case 2:
          return "第三月";
        case 3:
          return "第四月";
        case 4:
          return "第五月";
        case 5:
          return "第六月";
        case 6:
          return "第七月";
        case 7:
          return "第八月";
        case 8:
          return "第九月";
        case 9:
          return "第十月";
      }
    },
    async getFilterConditions() {
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(
        `${baseApi}/reports/employee/area-diq/filter-conditions`
      );
      const { offSpringLineNumbers, diqDebuteCountDTO } = data;
      this.filterConfig.forEach((o) => {
        if (o.prop === "offSpringLineNumbers" && offSpringLineNumbers) {
          o.options = offSpringLineNumbers.map((l) => ({
            name: `${l.offSpringLineNumber}(${l.dirCount})`,
            value: l.offSpringLineNumber,
          }));
        }
        if (o.prop === "diqDebuteCountDTO" && diqDebuteCountDTO) {
          if (diqDebuteCountDTO.birthDebuteCount > 0) {
            o.options[0].name = `生日周年(${diqDebuteCountDTO.birthDebuteCount})`;
          }
          if (diqDebuteCountDTO.teamDebuteCount > 0) {
            o.options[1].name = `美容顾问周年(${diqDebuteCountDTO.teamDebuteCount})`;
          }
          // if (diqDebuteCountDTO.birthDebuteCount > 0) {
          //   o.options[2].name = `督导周年(${diqDebuteCountDTO.dirDebuteCount})`;
          // }
          // if (diqDebuteCountDTO.teamDebuteCount > 0) {
          //   o.options[3].name = `首席周年(${diqDebuteCountDTO.nsdDebuteCount})`;
          // }
          if (diqDebuteCountDTO.dirDebuteCount > 0) {
            o.options.push({
              name: `督导周年(${diqDebuteCountDTO.dirDebuteCount})`,
              value: 3,
            });
          }
          if (diqDebuteCountDTO.nsdDebuteCount > 0) {
            o.options.push({
              name: `首席周年(${diqDebuteCountDTO.nsdDebuteCount})`,
              value: 4,
            });
          }
        }
      });
      console.log(this.filterConfig, "2");
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
    async setTargetIncome() {
      if (this.isSelf) {
        this.$refs.setTarget.setTargetIncome();
      } else {
        if (!this.baseData.setTargetIncomeAmt) {
          // 分享逻辑
          this.share();
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
      const params = {};
      params.focusContactId = this.currentData.contactId;
      const res = await this.$request.post(`${baseApi}/focus`, params);
      this.onRefresh();
      this.showActions = false;
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
        accountType: "operation",
        isEmployee: true,
        followed: this.$route.query.targetContactId,
        from: "operation",
      };
      // if (this.$route.query.impersonatedContactId) {
      //   params.impersonatedContactId = this.$route.query.impersonatedContactId;
      // }
      this.$go(url, params);
    },
    async share() {
      let baseApi = this.$ctx.baseApi;
      const inviteLinkData = await this.$request.post(`${baseApi}/invite/link`);
      //console.log(inviteLinkData);
      let shareUrl = `${this.$ctx.baseShareUrl}?linkKey=${inviteLinkData.data.linkKey}`;
      const shareArg = {
        kind: "media",
        title: "写下你的收入愿望，我们一起实现她",
        description: "愿望无论大小，说不定就实现了呢？",
        thumbnail: "",
        mediatype: "webpage",
        scene: "WXSceneSession",
        url: shareUrl,
      };
      this.$jsBridge.shareToWechat(shareArg);
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
  },
  watch: {
    isFullScreen(n) {
      if (!n) {
        let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        this.$nextTick(() => {
          // let filterContent = document.querySelector(".unit-content-filter");
          let filterContent = document.querySelector(".unit-home-content-wrap");
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
            scrollTop > 0 &&
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
          this.initTableFixed();
          this.fixedHeader();
        });
      }
    },
  },
  components: {
    commonTable,
    List,
    NavBar,
    Tab,
    Tabs,
    "van-button": Button,
    "van-tabbar": Tabbar,
    "van-tabbar-item": TabbarItem,
    "van-field": Field,
    "van-icon": Icon,
    dropdowmMenu,
    "van-action-sheet": ActionSheet,
    "van-sticky": Sticky,
    "van-pull-refresh": PullRefresh,
    "van-popup": Popup,
  },
};
</script>
<style lang="less" scoped>
.unit-home-content {
  // padding-top: env(safe-area-inset-top);
  // margin-top: 80px;
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
}
.isAndroid {
  // .unit-home-content {
  //   margin-top: 135px;
  // }
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
.icon-info {
  font-size: 28px;
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
  padding: 37px 20px;
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
  border-radius: 50%;
}
.assess-performance {
  position: relative;
  &-btn {
    padding: 0 30px;
    height: 47px;
    background-color: #fff7fd;
    color: #f16eae;
    font-size: 24px;
    border-color: #ffa7d2;
    border-radius: 9px;
    width: 146px;
  }
  &-tip {
    position: absolute;
    width: 24px;
    right: 0;
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

/deep/.filter-type-title {
  width: fit-content !important;
  margin-right: 10px;
}
/deep/.sb_class {
  .filter-type-title {
    width: 230px !important;
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
.timePopup {
  // background: none;
  border-radius: 20px;
  /deep/ .van-popup__close-icon--top-right {
    top: 30px;
    right: 30px;
  }
}
.popupRule {
  padding: 60px 50px 25px;
  width: 600px;
  font-size: 26px;
  line-height: 36px;
  color: #595959;
  .title {
    font-size: 34px;
    color: #333333;
    font-weight: bold;
    text-align: center;
    margin-bottom: 37px;
  }
  p {
    text-indent: 54px;
  }
}
/deep/.van-tabs__wrap {
  height: 90px;
  border: none;
  margin-top: -1px;
  .van-tabs__nav {
    padding-bottom: 0;
  }
}
/deep/.van-tab {
  background: #ee4d9b;
  color: #fff;
  font-size: 32px;
  // &--active {
  //   background: #FA6E8F;
  // }
}
/deep/ .van-hairline--bottom::after {
  border: none;
}
/deep/.van-tabs__nav--line {
  background-color: #ee4d9b;
}
/deep/.van-tabs__line {
  bottom: 12px;
  background-color: #fff;
  width: 72px;
  height: 8px;
  border-radius: 4px;
}
</style>
