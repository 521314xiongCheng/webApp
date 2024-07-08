<!-- 沙龙详情 -->
<template>
  <div
    class="unit-detail"
    :class="{ isAndroid: !isIos, isFullScreen: isFullScreen }"
  >
    <div v-show="!isFullScreen">
      <van-sticky>
        <NavBar
          left-text="返回"
          :title="title"
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
            {{ title }}
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
            <!-- <img class="icon-more" src="../../images/dot.png" alt=""> -->
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
      <div class="unit-content" v-show="!isFullScreen">
        <div class="unit-content-filter">
          <img class="icon" src="../../images/select.png" alt="" />
          <dropdowm-menu
            :filterConfig="filterConfig"
            :filter="filter"
            ref="filterAction"
            :pageName="pageName"
            filterClickEventName="OffspringDetailsFilterClick"
            tagEventName="OffspringDetailsFilterTagClick"
            resetEventName="OffspringDetailsFilterResetClick"
            confirmEventName="OffspringDetailsFilterConfirmClick"
            :total="total"
            @filterConfirm="filterConfirm"
            @filterActionIsOpen="filterActionIsOpen"
          ></dropdowm-menu>
        </div>
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
            align="center"
            prop="avatar"
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
                  v-show="row.incomeTarget"
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
            label="管理类别"
            slot="between"
            minWidth="90px"
            align="center"
            sortable="custom"
            prop="offspringLineNumber"
            header-align="center"
            :sort-orders="['descending', 'ascending', null]"
            v-if="filter.businessType !== 'AREA_ONE'"
          >
            <template slot-scope="{ row }">
              <span>{{ row.offspringLineNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="收入目标"
            slot="between"
            minWidth="90px"
            align="center"
            sortable="custom"
            prop="incomeTarget"
            header-align="center"
            :sort-orders="['descending', 'ascending', null]"
          >
            <template slot-scope="{ row }">
              <div class="assess-performance">
                <span
                  class="assess-performance-btn"
                  v-if="!row.incomeTarget"
                  @click="setTargetIncome(row)"
                  >{{
                    targetContactId === row.contactId.toString()
                      ? "设置目标"
                      : "提醒设置"
                  }}</span
                >
                <span v-else>{{ row.incomeTarget | formatMoney }}</span>
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
      profileClickEventName="OffspringDetailsClick"
      focusEventName="OffspringDetailsSetFocusClick"
      unfocusEventName="OffspringDetailsUnfocusClick"
      setTargetEventName="OffspringSetIncomeTargetClick"
      callEventName="OffspringPhoneCallClick"
      cancelEventName="OffspringDetailsCancelClick"
      :info="currentData"
      :isFullScreen="isFullScreen"
      :accountType="accountType"
      :targetContactId="targetContactId"
      @onSelect="onSelect"
    />
    <img
      v-if="isFullScreen"
      @click="resetToPortraitScreen"
      src="../../images/portraitscreen.png"
      class="resetToPortraitScreen"
      alt=""
    />
    <set-target
      :isSettingTarget="currentData.setTargetIncomeAmt"
      :levelCode="
        currentData.careerLevelCode && Number(currentData.careerLevelCode)
      "
      :incomeTargetIncomeAmt="currentData.incomeTarget"
      ref="setTarget"
      @setTargetIncomeConfirm="setTargetIncomeConfirm"
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
  Sticky,
  PullRefresh,
  Popup,
} from "vant";
import { isIos, closeWebview, formatMoney, deepCopy } from "../../utils/index";
import commonTable from "../../components/commonTable.vue";
import horizontalScreen from "../../mixin/horizontalScreen";
import SetTarget from "../../components/setTarget";
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
    "van-sticky": Sticky,
    "van-pull-refresh": PullRefresh,
    "van-popup": Popup,
    SetTarget,
  },
  mixins: [horizontalScreen],
  data() {
    return {
      showTable: true,
      isIos: isIos(),
      loading: true,
      finished: false,
      popupTime: false,
      title: "",
      tableData: {
        header: [
          {
            label: "当月绩效",
            minWidth: 90,
            sortable: "custom",
            prop: "productionAmtCurrentMonth",
            formatter: (row) => {
              return formatMoney(row.productionAmtCurrentMonth, 2);
            },
          },
        ],
        data: [],
      },
      tableHeaderData: {
        header: [
          {
            label: "当月绩效",
            minWidth: 90,
            sortable: "custom",
            prop: "productionAmtCurrentMonth",
            formatter: (row) => {
              return formatMoney(row.productionAmtCurrentMonth, 2);
            },
          },
        ],
        data: [],
      },
      filterConfig: [
        {
          prop: "dirTags",
          label: "分类",
          options: [],
        },
        {
          prop: "activityStatuses",
          label: "状态",
          options: [],
        },

        {
          prop: "careerLevels",
          label: "职级",
          options: [],
        },
        {
          prop: "setTargetIncomeAmt",
          label: "收入目标",
          multiple: false,
          options: [
            {
              name: "已设置",
              value: 1,
            },
            {
              name: "未设置",
              value: 0,
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
            // {
            //   name: "美容顾问周年",
            //   value: 2,
            // },
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
        businessType: "AREA_ONE",
        sortEnum: "INCOME_TARGET",
        orderEnum: "DESC",
      },
      currentData: {},
      total: 1,
      monthKey: "",
      filterParams: {},
      tableName: "area",
      accountType: "",
      refreshing: false,
      refreshDisable: false,
      navBarClientHeight: 0, //fix 横屏后获取navBar错误
      pageName: "OffspringDetailsPage",
      landscapeEventName: "OffspringDetailsLandscapeClick",
      export2ExcelEventName: "OffspringDetailsExcelExportClick",
    };
  },
  created() {
    const {
      monthKey,
      businessType,
      targetContactId,
      accountType,
      tagId,
      levelCode,
      isFocus,
      lineNumbers,
    } = this.$route.query;
    this.monthKey = monthKey;
    this.filter.businessType = businessType;
    this.title = businessType === "AREA_ONE" ? "一类区域详情" : "区域详情";
    this.targetContactId = targetContactId;
    this.accountType = accountType;
    this.levelCode = levelCode;
    if (tagId) {
      this.filter.dirTags = [tagId];
    }
    if (isFocus !== undefined) {
      this.filter.isFocus = JSON.parse(isFocus);
    }
    if (lineNumbers !== undefined) {
      this.filter.lineNumbers = [Number(lineNumbers)];
    }
    console.log(monthKey);
    let date = new Date(monthKey.substr(0, 4), monthKey.substr(4, 6));
    date.setMonth(date.getMonth() - 1, 1);
    for (let i = 1; i <= 12; i++) {
      date.setMonth(date.getMonth() - 1);
      let newDate = `${date.getFullYear()}/${this.addZero(
        date.getMonth() + 1
      )}`;
      this.tableData.header.push({
        label: `${newDate}`,
        minWidth: 90,
        sortable: "custom",
        prop: `productionAmtM${i}`,
        formatter: (row) => {
          return formatMoney(
            row.productionAmtHistoryMonth[`productionAmtM${i}`],
            2
          );
        },
      });
    }
    this.tableHeaderData.header = this.tableData.header;
    this.loadData();
    this.getFilterConditions();
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.filterAction.initFilterConfig();
    });
    const onFronted = () => {
      // 从搜索页返回时需要刷新数据
      this.onFronted();
    };
    this.$jsBridge.onFronted(onFronted);
    //是否员工账号

    // 固定表头
    this.fixedHeader();
  },
  methods: {
    fixedHeader() {
      let navBar = document.querySelector(".van-nav-bar");
      let filterContent = document.querySelector(".unit-content-filter");
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
    filterActionIsOpen(type) {
      this.refreshDisable = type;
    },
    async onFronted() {
      const params = deepCopy(this.filterParams);
      params.pageNo = 1;
      params.pageSize = this.tableData.data.length || 20;
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(`${baseApi}/reports/area`, {
        params,
      });

      this.baseData = data;
      this.tableData.data.forEach((table, index, tableData) => {
        data.members.forEach((item, i) => {
          if (table.contactId === item.contactId) {
            tableData.splice(index, 1, item);
          }
        });
      });
    },
    addZero(m) {
      return m < 10 ? `0${m}` : m;
    },
    back() {
      closeWebview();
    },
    async getFilterConditions() {
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
      let baseApi = this.$ctx.baseApi;
      const params = {
        businessType: this.filter.businessType,
      };
      const { data } = await this.$request.get(
        `${baseApi}/reports/area/filter-conditions`,
        {
          params,
        }
      );
      const {
        activityStatuses,
        careerLevels,
        lineNumbers,
        dirTags,
        debuteCount,
      } = data;
      const { businessType } = this.$route.query;
      if (businessType !== "AREA_ONE") {
        let options = [];
        if (businessType === "AREA_ONE_TO_THREE") {
          options = [
            {
              name: "一类管理区域",
              value: 1,
            },
            {
              name: "二类管理区域",
              value: 2,
            },
            {
              name: "三类管理区域",
              value: 3,
            },
          ];
        } else if (businessType === "AREA_ONE_TO_TWO") {
          options = [
            {
              name: "一类管理区域",
              value: 1,
            },
            {
              name: "二类管理区域",
              value: 2,
            },
          ];
        } else {
          o.options = [];
        }
        this.filterConfig.push({
          prop: "lineNumbers",
          label: "管理区域",
          options,
        });
      }
      this.filterConfig.forEach((o) => {
        if (o.prop === "careerLevels" && careerLevels) {
          o.options = careerLevels.map((l) => ({
            name: `${l.careerLevelCode}(${l.dirCount})`,
            value: l.careerLevelId,
          }));
        }
        if (o.prop === "debuteCount" && debuteCount) {
          if (debuteCount.birthDebuteCount > 0) {
            o.options[0].name = `生日周年(${debuteCount.birthDebuteCount})`;
          }

          // if (debuteCount.teamDebuteCount > 0) {
          //   o.options[1].name = `美容顾问周年(${debuteCount.teamDebuteCount})`;
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
        if (o.prop === "activityStatuses" && activityStatuses) {
          o.options = activityStatuses.map((l) => ({
            name: `${l.activityStatusCode}(${l.dirCount})`,
            value: l.activityStatusId,
          }));
        }
        if (o.prop === "dirTags" && dirTags) {
          o.options = dirTags.map((l) => ({
            name: `${l.tagName}(${l.dirCount})`,
            value: l.tagId,
          }));
        }
      });
      this.$nextTick(() => {
        this.$refs.filterAction.initFilterConfig();
      });
    },
    async loadData() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      this.loading = true;
      const {
        pageNo,
        pageSize,
        dirTags,
        focusStatus,
        careerLevels,
        activityStatuses,
        setTargetIncomeAmt,
        lineNumbers,
        businessType,
        sortEnum,
        orderEnum,
        debuteCount,
        isFocus,
      } = this.filter;
      const params = {
        pageNo,
        pageSize,
        businessType,
        focusStatus,
        setTargetIncomeAmt,
        sortEnum,
        orderEnum,
        debuteCount,
        isFocus,
      };
      if (dirTags && dirTags.length) {
        params.dirTagIds = dirTags.join(",");
      }
      if (debuteCount && debuteCount.length) {
        params.debuteCount = debuteCount.join(",");
      }
      if (careerLevels && careerLevels.length) {
        params.careerLevelIds = careerLevels.join(",");
      }
      if (activityStatuses && activityStatuses.length) {
        params.activityStatusIds = activityStatuses.join(",");
      }
      if (lineNumbers && lineNumbers.length) {
        params.lineNumbers = lineNumbers.join(",");
      }
      // 存params 用于从搜索页返回时做数据对比
      this.filterParams = deepCopy(params);
      // let baseApi = 'https://mock.marykay.com.cn/mock/489/api/v1'
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(`${baseApi}/reports/area`, {
        params,
      });

      this.total = data.total;
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
      // this.tableData.data = [...new Set(this.tableData.data.concat(data.members))]
      if (this.tableData.data && this.tableData.data.length) {
        this.showTable = true;
      } else {
        this.showTable = false;
      }
      window.scrollTo(0, scrollTop);
      this.filter.pageNo = this.filter.pageNo + 1;
    },
    sortMap(prop) {
      let propMap = {
        incomeTarget: "INCOME_TARGET",
        productionAmtCurrentMonth: "PRODUCTION_AMT_CURRENT_MONTH",
        offspringLineNumber: "LINE_NUMBER",
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
    async onRefresh() {
      this.finished = false;
      this.refreshing = true;
      this.filter.pageNo = 1;
      this.tableData.data = [];
      this.loadData();
    },
    async setTargetIncome(row) {
      console.log(row);
      if (this.accountType === "operation") {
        this.$toast("抱歉，暂时不支持对她进行操作～");
        return;
      }
      if (this.isFullScreen) {
        this.$toast("请返回竖屏下操作～");
        return;
      }
      if (this.targetContactId.toString() === row.contactId.toString()) {
        // 是本人 直接设置收入目标
        this.$track({
          context: this.pageName,
          behavior: "OffspringSetTargetClick",
          item_type: this.pageName,
          item_id: "OffspringSetTargetClick",
        });
        this.currentData = row;
        this.$refs.setTarget.setTargetIncome();
      } else {
        this.$track({
          context: this.pageName,
          behavior: "OffspringRemindToSetClick",
          item_type: this.pageName,
          item_id: "OffspringRemindToSetClick",
        });
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
    },
    setTargetIncomeConfirm() {
      this.onFronted();
    },
    filterConfirm(filter) {
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
    toSearch() {
      let url = `${window.location.origin}/area_search`;
      const params = {
        targetContactId: this.targetContactId,
        monthKey: this.monthKey,
        businessType: this.filter.businessType,
        levelCode: this.levelCode,
      };
      this.$go(url, params);
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
          let filterContent = document.querySelector(".unit-content-filter");
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
          console.log("scrollTop", scrollTop);
          console.log(
            "this.navBarClientHeight",
            commonTable.clientHeight +
              filterContent.clientHeight +
              this.navBarClientHeight
          );
          console.log("screen.height", this.screenHeight);
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
          this.fixedHeader();
        });
      }
    },
    popupTime(n) {
      if (n) {
        this.$track({
          context: this.pageName,
          behavior: "OffspringDetailsRuleIconClick",
          item_type: this.pageName,
          item_id: "OffspringDetailsRuleIconClick",
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.unit-detail {
  min-height: 100vh;
  .unit-content {
    // padding-top: env(safe-area-inset-top);
    // margin-top: 80px;
    &-filter {
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
  }
  .assess-performance {
    position: relative;
    display: inline-block;
    &-btn {
      color: #f99e79;
    }
    &-tip {
      position: absolute;
      width: 24px;
      height: 24px;
      right: -10px;
      top: 0;
    }
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
.isAndroid {
  // .unit-content {
  //   margin-top: 135px;
  // }
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
/deep/.van-nav-bar__placeholder {
  // height: 75px!important;
  background-color: #ee4d9b;
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
    font-size: 30px;
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
