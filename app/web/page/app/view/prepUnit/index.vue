<!-- 沙龙详情 -->
<template>
  <div
    class="unit-detail"
    :class="{ isAndroid: !isIos, isFullScreen: isFullScreen }"
  >
    <div v-show="!isFullScreen">
      <NavBar
        left-text="返回"
        fixed
        title="准沙龙详情"
        :border="false"
        :safe-area-inset-top="true"
        @click-left="back"
      >
        <template #left>
          <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
        </template>
        <template #title>
          准沙龙详情
          <img
            class="icon_q"
            @click="popupTime = !popupTime"
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
                  v-if="row.setTargetIncomeAmt"
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
        </common-table>
      </List>
      <div v-if="!showTable" class="nodata">
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
    "van-popup": Popup,
    "van-pull-refresh": PullRefresh,
  },
  mixins: [horizontalScreen],
  data() {
    return {
      showTable: true,
      isFullScreen: false,
      isIos: isIos(),
      loading: true,
      finished: false,
      popupTime: false,
      tableData: {
        header: [
          {
            label: "是否下单",
            minWidth: 90,
            sortable: "custom",
            prop: "isOrder",
            formatter: (row) => {
              return row.isOrder ? "是" : "否";
            },
          },
          {
            label: "当月绩效",
            minWidth: 100,
            sortable: "custom",
            prop: "productionAmt",
            formatter: (row) => {
              return formatMoney(row.productionAmt);
            },
          },
        ],
        data: [],
      },
      filterConfig: [
        {
          prop: "statusCodeIds",
          label: "状态",
          options: [],
        },
        {
          prop: "levelCodeIds",
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
              value: true,
            },
            {
              name: "未设置",
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
        sortEnum: "PRODUCTION_AMT",
        orderEnum: "DESC",
      },
      currentData: {},
      total: 1,
      monthKey: "",
      filterParams: {},
      tableName: "diq-unit",
      accountType: "",
      refreshing: false,
      refreshDisable: false,
      navBarClientHeight: 0, //fix 横屏后获取navBar错误
      levelCode: "",
    };
  },
  created() {
    const { monthKey, targetContactId, accountType, levelCode, isOrder } =
      this.$route.query;
    this.monthKey = monthKey;
    this.targetContactId = targetContactId;
    this.accountType = accountType;
    this.levelCode = levelCode;
    console.log(monthKey);
    if (isOrder !== undefined) {
      this.filter.isOrder = JSON.parse(isOrder);
    }
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
          return formatMoney(row[`productionAmtM${i}`]);
        },
      });
    }
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
      filterContent.style.cssText = `position: unset;`;
      tableHeaderWrap.style.cssText = `position: unset;`;
      tableBodyWrap.style.cssText = "padding-top: 0;";
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
      const { data } = await this.$request.get(`${baseApi}/reports/diq`, {
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
      const { data } = await this.$request.get(
        `${baseApi}/reports/diq/filter-conditions`
      );
      const { activityStatuses, careerLevels, diqDebuteCountDTO } = data;
      this.filterConfig.forEach((o) => {
        if (o.prop === "levelCodeIds" && careerLevels) {
          o.options = careerLevels.map((l) => ({
            name: `${l.careerLevelCode}(${l.bcCount})`,
            value: l.careerLevelId,
          }));
        }
        if (o.prop === "diqDebuteCountDTO" && diqDebuteCountDTO) {
          if (diqDebuteCountDTO.birthDebuteCount) {
            o.options[0].name = `生日周年(${diqDebuteCountDTO.birthDebuteCount})`;
          }
          if (diqDebuteCountDTO.teamDebuteCount) {
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
          // if (debuteCount.dirDebuteCount > 0) {
          //   o.options[2].name = `督导周年(${debuteCount.dirDebuteCount})`;
          // }
          // if (debuteCount.nsdDebuteCount > 0) {
          //   o.options[3].name = `首席周年(${debuteCount.nsdDebuteCount})`;
          // }
        }
        if (o.prop === "statusCodeIds" && activityStatuses) {
          o.options = activityStatuses.map((l) => ({
            name: `${l.activityStatusCode}(${l.bcCount})`,
            value: l.activityStatusId,
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
        levelCodeIds,
        statusCodeIds,
        setTargetIncomeAmt,
        isOrder,
        isFocus,
        sortEnum,
        isNewBc,
        orderEnum,
        diqDebuteCountDTO,
      } = this.filter;
      const params = {
        pageNo,
        pageSize,
        setTargetIncomeAmt,
        isOrder,
        isFocus,
        isNewBc,
        sortEnum,
        orderEnum,
      };
      params.debuteCount = diqDebuteCountDTO;
      if (levelCodeIds && levelCodeIds.length) {
        params.levelCodeIds = levelCodeIds.join(",");
      }
      if (statusCodeIds && statusCodeIds.length) {
        params.statusCodeIds = statusCodeIds.join(",");
      }
      if (diqDebuteCountDTO && diqDebuteCountDTO.length) {
        params.debuteCount = diqDebuteCountDTO.join(",");
      }
      // 存params 用于从搜索页返回时做数据对比
      this.filterParams = deepCopy(params);
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(`${baseApi}/reports/diq`, {
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
        isOrder: "ORDER",
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
    async onRefresh() {
      this.finished = false;
      this.refreshing = true;
      this.filter.pageNo = 1;
      this.tableData.data = [];
      this.loadData();
    },
    async setTargetIncome() {
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
            from: "diq", //督导可以查看DIQ跟进成员的美容顾问小组成员
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
      let url = `${window.location.origin}/prep_unit_search`;
      const params = {
        targetContactId: this.targetContactId,
        monthKey: this.monthKey,
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
  },
};
</script>
<style lang="less" scoped>
.unit-detail {
  .unit-content {
    padding-top: env(safe-area-inset-top);
    margin-top: 80px;
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
  .unit-content {
    margin-top: 135px;
  }
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
