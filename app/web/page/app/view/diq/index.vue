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
              src="../../images/index/icon_back.png"
              alt=""
            />
          </template>
          <template #title>
            DIQ跟进
            <img
              class="icon_q"
              @click="showDialog = !showDialog"
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
      <div class="unit-home-content" v-show="!isFullScreen">
        <div class="unit-home-content-wrap">
          <Tabs ref="tabs" v-model="currentTabName" @click="handleTabClick">
            <Tab title="申请期" name="apply"></Tab>
            <Tab title="考核期" name="assess"></Tab>
          </Tabs>
          <!-- 筛选 -->
          <div
            class="unit-content-filter"
            :class="{ sb_class: currentTabName === 'apply' }"
          >
            <img class="icon" src="../../images/select.png" alt="" />
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
            width="60px"
            label="头像"
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
                  src="../../images/crown.png"
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
          <el-table-column
            prop="offSpringLineNumber"
            label="管理类别"
            width="80px"
            align="center"
            v-if="levelCode > 60 && currentTabName === 'apply'"
          >
          </el-table-column>
          <el-table-column
            prop="directorName"
            v-if="levelCode > 60 && currentTabName === 'apply'"
            align="center"
            label="督导姓名"
          >
          </el-table-column>
        </common-table>
      </List>
      <div v-if="!showTable" class="nodata">
        <img src="../../images/nodata1.png" alt="" />
        <div>暂时没有数据</div>
      </div>
    </van-pull-refresh>

    <van-action-sheet
      v-model="showActions"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
    />
    <!-- 规则 -->
    <van-popup
      v-model="showDialog"
      class="rule-popup"
      position="center"
      round
      closeable
    >
      <div class="dialog-wrap">
        <div class="dialog-content">
          <span class="dialog-title">
            <img src="../../images/reports/incomeDeclaration/hg.png" alt="" />
            {{
              currentTabName === "apply" ? "申请进入DIQ规则" : "DIQ考核期规则"
            }}
          </span>
          <div class="dialog-box">
            <div
              class="content-scroll no-button"
              v-if="currentTabName === 'apply'"
            >
              <div class="content-item">
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
            <div class="content-scroll no-button" v-else>
              <div class="content-item">
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
            src="../../images/reports/incomeDeclaration/xin.png"
            alt=""
          />
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
  Button,
  Tabbar,
  TabbarItem,
  Dialog,
  Field,
  Icon,
  List,
  ActionSheet,
  Popup,
  Sticky,
  PullRefresh,
  Tab,
  Tabs,
} from "vant";
import commonTable from "../../components/commonTable.vue";
import { isIos, closeWebview, formatMoney, deepCopy } from "../../utils/index";
import horizontalScreen from "../../mixin/horizontalScreen";
const actions = [
  {
    name: "个人详情",
    prop: "profile",
  },
  {
    name: "新人行动",
    prop: "nbcAction",
  },
  {
    name: "添加笔记",
    prop: "addNote",
  },
  {
    name: "邀请设置收入目标",
    prop: "setTarget",
  },
];
export default {
  mixins: [horizontalScreen],
  data() {
    return {
      monthKey: "",
      currentTabName: "apply",
      filterParams: {},
      tableName: "diq",
      showTable: true,
      isSelf: false,
      showDialog: false,
      currentData: {},
      isFullScreen: false,
      showActions: false,
      levelCode: 97,
      isIos: isIos(),
      contactId: "",
      loading: true,
      finished: false,
      actions: [],
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
          label: "DIQ沙龙\nA成员",
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
            let month = Number(this.monthKey.substr(4, 6));
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
          label: "管理类别",
          prop: "offSpringLineNumber",
        },
        {
          label: "督导姓名",
          prop: "directorName",
        },
      ],
      filterText: "筛选",
      filterSheet: false,
      total: 0,
      //分页
      filter: {
        pageSize: 50,
        pageNo: 1,
        sortEnum: "OFF_SPRING_LINE_NUMBER",
        orderEnum: "ASC",
        offSpringLineNumbers: [],
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
          prop: "offSpringLineNumbers",
          label: "管理类别",
          options: [],
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
      accountType: "",
      refreshing: false,
      refreshDisable: false,
      navBarClientHeight: 0, //fix 横屏后获取navBar错误
      pageName: "DIQDetailsPage",
      landscapeEventName: "DIQDetailsLandscapeClick",
      export2ExcelEventName: "DIQDetailsExcelExportClick",
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
    let api = this.$ctx.baseApi;
    const { data } = await this.$request.get(`${api}/monthkey`);
    this.monthKey = `${data}`;
    const { levelCode, targetContactId, isSelf, accountType, tabType } =
      this.$route.query;
    this.levelCode = Number(levelCode);
    this.isSelf = isSelf ? JSON.parse(isSelf) : false;
    this.targetContactId = targetContactId;
    this.accountType = accountType;
    this.currentTabName = tabType ? tabType : "apply";
    this.filterConfig = this[`${this.currentTabName}FilterConfig`];
    console.log(this.filterConfig);
    this.tableData.header = this[`${this.currentTabName}Header`];
    this.loadData();
    if (this.currentTabName === "assess") {
      this.tableName = "diq";
      this.getFilterConditions();
    } else {
      this.tableName = "diq/applyperiod";
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
  methods: {
    fixedHeader() {
      let navBar = document.querySelector(".van-nav-bar");
      // let filterContent = document.querySelector(".unit-content-filter");
      let filterContent = document.querySelector(".unit-home-content-wrap");
      let tableHeaderWrap = document.querySelector(".el-table__header-wrapper");
      let tableBodyWrap = document.querySelector(".el-table__body-wrapper");
      let commonTable = document.querySelector(".common-table");
      console.log(commonTable);
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
        sortEnum: "OFF_SPRING_LINE_NUMBER",
        orderEnum: "ASC",
        offSpringLineNumbers: [],
      };
      if (n === "assess") {
        this.tableName = "diq";
        this.getFilterConditions();
      } else {
        this.tableName = "diq/applyperiod";
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
      let apiUrl = `${baseApi}/reports/area-diq`;
      if (this.currentTabName === "apply") {
        apiUrl = `${baseApi}/reports/diq/applyperiod`;
      }
      const { data } = await this.$request.get(apiUrl, {
        params,
      });
      let members = data.members || data.pageList;

      this.tableData.data.forEach((table, index, tableData) => {
        //a状态
        if (table.notActiveMonth == null || table.notActiveMonth == "") {
          table.notActiveMonth = "-";
        }
        //违规
        if (table.citationDate == null || table.citationDate == "") {
          item.citationDate = "-";
        }

        members.forEach((item, i) => {
          if (table.contactId === item.contactId) {
            tableData.splice(index, 1, item);
          }
        });
      });
    },
    toSearch() {
      let url = `${window.location.origin}/diq_search`;
      const params = {
        targetContactId: this.$route.query.targetContactId,
        monthKey: this.monthKey,
        currentTabName: this.currentTabName,
        levelCode: this.levelCode,
      };
      this.$go(url, params);
    },
    async handleClickAvatar(row) {
      if (this.isFullScreen) {
        this.$toast("请返回竖屏下操作～");
        return;
      }
      // 新人行动
      let baseApi = this.$ctx.baseApi;
      // let baseApi = `https://mock.marykay.com.cn/mock/646/api/v1`;
      const {
        data: { isNew },
      } = await this.$request.get(
        `${baseApi}/goldenweek/newconsultant?contactId=${row.contactId}`
      );
      let copyActions = deepCopy(actions);
      console.log(row.setTargetIncomeAmt);
      if (row.setTargetIncomeAmt) {
        copyActions[3].name = "邀请修改收入目标";
      } else {
        copyActions[3].name = "邀请设置收入目标";
      }
      if (this.accountType === "operation") {
        copyActions.forEach((item, index, arr) => {
          if (item.prop === "setTarget" || item.prop === "nbcAction") {
            arr.splice(index, 1);
          }
        });
        if (Number(row.careerLevelCode) < 50) {
          copyActions.forEach((item, index, arr) => {
            if (item.prop === "call") {
              arr.splice(index, 1);
            }
          });
        }
      }
      if (!isNew) {
        copyActions.forEach((item, index, arr) => {
          if (item.prop === "nbcAction") {
            arr.splice(index, 1);
          }
        });
      }
      this.actions = copyActions;
      this.currentData = row;
      this.showActions = true;

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
      //  console.log('offSpringLineNumbers',offSpringLineNumbers)
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
      let apiUrl = `${baseApi}/reports/area-diq`;
      if (this.currentTabName === "apply") {
        apiUrl = `${baseApi}/reports/diq/applyperiod`;
      }
      const res = await this.$request.get(apiUrl, {
        params,
      });
      this.filterParams = deepCopy(params);
      this.total = res.data.total || res.data.totalCount;

      let members = res.data.members || res.data.pageList;

      //零售绩效4800
      members.map((item) => {
        //a状态
        if (item.notActiveMonth == null || item.notActiveMonth == "") {
          item.notActiveMonth = "-";
        }
        //违规
        if (item.citationDate == null || item.citationDate == "") {
          item.citationDate = "-";
        }
      });
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
    async getFilterConditions() {
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(
        `${baseApi}/reports/area-diq/filter-conditions`
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
        //diq数据不会有本人
        // this.$refs.setTarget.setTargetIncome();
      } else {
        if (!this.baseData.setTargetIncomeAmt) {
          // 分享逻辑
          this.share();
        }
      }
    },
    filterConfirm(filter) {
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
        //跟进人
        followed: this.$route.query.targetContactId,
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
          this.$track({
            context: this.pageName,
            behavior: "DIQDetailsClick",
            item_type: this.pageName,
            item_id: "DIQDetailsClick",
          });
          this.goProflie();
          break;
        case "setTarget": //邀请设置收入目标
          this.$track({
            context: this.pageName,
            behavior: "DIQDetailsSetIncomeTargetClick",
            item_type: this.pageName,
            item_id: "DIQDetailsSetIncomeTargetClick",
          });
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
            isSelf: false,
            targetContactId: this.currentData.contactId,
            levelCode: this.currentData.careerLevelCode,
            monthKey: this.monthKey,
            navTitle: "收入目标评估",
          };
          // if (this.$route.query.impersonatedContactId) {
          //   query.impersonatedContactId =
          //     this.$route.query.impersonatedContactId;
          // }
          this.$go(detailUrl, query);
          break;
        case "call": //拨打电话
          window.location.href = `tel:${this.currentData.mobile}`;
          break;
        case "nbcAction":
          this.toActionPlan();
          break;
        case "addNote":
          this.goAddNote();
          break;
      }
      this.showActions = false;
    },
    toActionPlan() {
      let url = `${window.location.origin}/nbcActionPlan`;
      const params = {
        opaque: false,
        targetContactId: this.currentData.contactId,
      };
      this.$go(url, params);
    },
    async goAddNote() {
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/notes/check?followContactId=${this.currentData.contactId}&contactId=${this.targetContactId}`
      );

      let url = `${window.location.origin}/note`;
      let params = {
        opaque: false,
        targetContactId: this.currentData.contactId,
        name: this.currentData.name,
        levelCode: this.currentData.careerLevelCode,
        followed: this.targetContactId,
      };
      if (!data.hasNote) {
        url = `${window.location.origin}/addNote`;
        params = {
          targetContactId: this.currentData.contactId,
          name: this.currentData.name,
          opaque: false,
          levelCode: this.currentData.careerLevelCode,
          from: "addNote_none",
          followed: this.targetContactId,
        };
      }
      console.log("params", params);
      this.$go(url, params);
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
    showDialog(n) {
      if (n) {
        this.$track({
          context: this.pageName,
          behavior: "DIQDetailsRuleIconClick",
          item_type: this.pageName,
          item_id: "DIQDetailsRuleIconClick",
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
    "van-popup": Popup,
    dropdowmMenu,
    "van-action-sheet": ActionSheet,
    "van-sticky": Sticky,
    "van-pull-refresh": PullRefresh,
  },
};
</script>
<style lang="less" scoped>
.unit-detail {
  min-height: 100vh;
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
.search {
  margin-right: 2vw;
  width: 46px;
  height: 47px;
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
    padding: 0 12px;
    height: 42px;
    background-color: #fff7fd;
    color: #f16eae;
    font-size: 24px;
    border-color: #ffa7d2;
    border-radius: 9px;
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
      .content-item {
        margin-top: 36px;
        text-align: left;
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
/deep/.rule-popup.van-popup {
  background-color: transparent;
  .van-popup__close-icon {
    top: 20px;
    right: 60px;
    color: #f8b4c4;
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
  height: 8px;
  border-radius: 4px;
}
</style>
