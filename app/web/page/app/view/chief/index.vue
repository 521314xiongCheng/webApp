<template>
  <div
    class="chief"
    :class="{
      isAndroid: !isIos,
      isFullScreen: isFullScreen,
      isIphoneX: isIphoneX,
    }"
  >
    <div v-show="!isFullScreen" ref="navbar" class="content-header">
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
            >
              <template #reference>
                <img class="icon-more" src="../../images/dot.png" alt="" />
              </template>
            </van-popover>
          </template>
        </NavBar>
      </van-sticky>
    </div>
    <div v-show="!isFullScreen" ref="time" class="status_wrap status_wrap_area">
      <div class="status_wrap_query">
        <div class="area_query">
          <img src="../../images/month.png" />
          <span style="font-size: 14px">选择月份：</span>
          <el-select
            v-model="filter.monthKey"
            placeholder="请选择"
            @change="changeHandler"
          >
            <el-option
              v-for="item in monthMap"
              :key="item.date"
              :label="item.month"
              :value="item.date"
            ></el-option>
          </el-select>
        </div>
        <div class="area_query">
          <img src="../../images/select.png" />
          <dropdowm-menu
            :filterConfig="filterConfig"
            ref="filterAction"
            :total="total"
            @filterConfirm="filterConfirm"
            @filterActionIsOpen="filterActionIsOpen"
          ></dropdowm-menu>
        </div>
      </div>
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
      <List
        :finished="finished"
        v-model="loading"
        :finished-text="tableData && tableData.length ? '没有更多了' : ''"
        @load="getData"
        v-if="showTable"
      >
        <common-table
          id="table-content"
          ref="table"
          :border="false"
          :tableData="tableData"
          :isFullScreen="isFullScreen"
        >
        </common-table>
      </List>
      <div v-if="!showTable" class="nodata">
        <img src="../../images/nodata1.png" alt="" />
        <div>暂时没有数据</div>
      </div>
    </van-pull-refresh>

    <!-- 规则 -->
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
          <p>
            1.老顾问，顾问在加入的<span>第一个月</span>才称为新顾问，<span>第二个月</span>开始为老顾问。非当月加入的都算老顾问
          </p>
          <p>
            2.休职，<span>A</span>之后就是<span>P</span>,休职，分为<span
              >P1-P3</span
            >
          </p>
          <p>
            3.停职，<span>P</span>之后就是<span>T</span>,停职，分为<span
              >T1-T6</span
            >
          </p>
          <p>
            4.复职，顾问<span>T</span>状态恢复到<span>A</span>状态就称为复职
          </p>
          <p>5.数据更新时间，<span>24</span>小时</p>
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
import { NavBar, List, Button, Popup, Sticky, PullRefresh } from "vant";
import {
  isIos,
  isIphoneX,
  getMonthMap,
  createQuery,
  closeWebview,
  deepCopy,
} from "../../utils/index";
import commonTable from "../../components/chiefTable/table.vue";
import horizontalScreen from "../../mixin/chief_horizontalScreen";

export default {
  components: {
    commonTable,
    List,
    NavBar,
    "van-button": Button,
    dropdowmMenu,
    "van-popup": Popup,
    "van-sticky": Sticky,
    "van-pull-refresh": PullRefresh,
  },
  mixins: [horizontalScreen],
  data() {
    return {
      navTitle: "首席认可报表",
      isIos: isIos(),
      isIphoneX: isIphoneX(),
      isFullScreen: false,
      ImpersonatedContactID: "",
      baseTime: "202201",
      finished: false,
      refreshing: false,
      showTable: true,
      loading: true,
      total: 0,
      monthMap: [],
      filter: {
        pageNo: 1,
        monthKey: null,
      },
      filterParams: {},
      filterConfig: [
        {
          prop: "activityStatusCodes",
          label: "状态",
          multiple: true,
          options: [],
        },
        {
          prop: "levelCodes",
          label: "职级",
          multiple: true,
          options: [],
        },
        {
          prop: "offspringType",
          label: "区域",
          multiple: false,
          options: [
            {
              name: "0-3",
              value: 1,
            },
            {
              name: "4-N",
              value: 2,
            },
          ],
        },
      ],
      refreshDisable: false,
      tableData: [],
      popupTime: false,
      // // track参数
      // pageName: "chief",
      // landscapeEventName: "chiefLandscapeClick",
      // export2ExcelEventName: "chiefExcelExportClick",
      // accountType: "",
    };
  },
  async created() {
    this.ImpersonatedContactID = this.$route.query.ImpersonatedContactID;
    let api = this.$ctx.baseApi;
    const { data } = await this.$request.get(`${api}/monthkey`);
    this.filter.monthKey = this.baseTime = data.toString();
    this.monthMap = getMonthMap(202201, this.baseTime, {
      keyLabel: "month",
      valueLabel: "date",
    });
    this.getData();
    this.getFilter();
    this.fixedHeader();
  },
  mounted() {},
  methods: {
    async getData() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      this.loading = true;
      let chieftApi = this.$ctx.baseApiList.income;
      const params = createQuery(this.filter);
      // 保存此次搜索条件
      this.filterParams = deepCopy(this.filter);
      const { data } = await this.$request.get(
        `${chieftApi}/nsdapprovals/consultants?${params}`
      );
      this.finished = !data.hasNextPage;
      this.filter.pageNo = data.pageNo + 1;
      this.loading = false;
      this.refreshing = false;
      this.total = data.total;
      this.tableData = this.tableData.concat(data.members || []);
      if (this.tableData && this.tableData.length) {
        this.showTable = true;
      } else {
        this.showTable = false;
      }
      // table数据更新后会直接滚动到页面底部导致一直触发load事件
      window.scrollTo(0, scrollTop);
    },
    async getFilter() {
      let chieftApi = this.$ctx.baseApiList.income;
      const params = {
        monthKey: this.filter.monthKey,
        contactId: this.ImpersonatedContactID,
      };
      const { data } = await this.$request.get(
        `${chieftApi}/nsdapprovals/filter-conditions`,
        { params }
      );
      const { activityStatusCodes, careerLevelCodes } = data;
      this.filterConfig.forEach((o) => {
        if (o.prop === "activityStatusCodes" && activityStatusCodes) {
          o.options = activityStatusCodes.map((l) => ({
            name: `${l.activityStatusCode}(${l.count})`,
            value: l.activityStatusCode,
          }));
        }
        if (o.prop === "levelCodes" && careerLevelCodes) {
          o.options = careerLevelCodes.map((l) => ({
            name: `${l.careerLevelCode}(${l.count})`,
            value: l.careerLevelCode,
          }));
        }
      });
      this.$nextTick(() => {
        this.$refs.filterAction.initFilterConfig();
      });
    },
    changeHandler() {
      this.filter.pageNo = 1;
      this.tableData = [];
      this.getData();
      this.getFilter();
    },
    filterConfirm(filter) {
      // console.log(filter);
      this.filter = Object.assign(this.filter, filter);
      this.filter.pageNo = 1;
      this.tableData = [];
      this.getData();
    },
    async onRefresh() {
      this.finished = false;
      this.refreshing = true;
      this.filter.pageNo = 1;
      this.tableData = [];
      this.getData();
    },
    filterActionIsOpen(type) {
      this.refreshDisable = type;
    },
    back() {
      closeWebview();
    },
    toSearch() {
      let url = `${window.location.origin}/chief_search`;
      const params = {
        monthKey: this.filter.monthKey,
        // opaque: false,
        // fullscreen: false,
      };
      this.$go(url, params);
    },
    fixedHeader() {
      let navBar = document.querySelector(".van-nav-bar");
      let tableHeader = document.querySelector(".el-table__header-wrapper");
      let tableBody = document.querySelector(".el-table__body-wrapper");
      let tableFixedHeaderWrap = document.querySelector(
        ".el-table__fixed-header-wrapper"
      );
      let tableFixedBodyWrap = document.querySelector(
        ".el-table__fixed-body-wrapper"
      );
      window.addEventListener("scroll", (e) => {
        let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        console.log(scrollTop, this.$refs.time.clientHeight);
        if (scrollTop >= this.$refs.time.clientHeight) {
          tableFixedHeaderWrap.style.cssText = `position: fixed;top: ${navBar.clientHeight}px;width: 100px;z-index: 4;overflow: hidden;`;
          tableFixedBodyWrap.style.cssText = `top: ${tableHeader.clientHeight}px`;
          tableHeader.style.position = "fixed";
          tableHeader.style.top = `${this.$refs.navbar.clientHeight}px`;
          tableBody.style.paddingTop = `${tableHeader.clientHeight}px`;
          console.log(tableHeader.style.position, tableHeader.style.top);
        } else {
          tableFixedHeaderWrap.style.cssText = `position: absolute;top: 0`;
          tableFixedBodyWrap.style.cssText = `padding-top:0;top: ${tableFixedHeaderWrap.clientHeight}px;`;
          tableHeader.style.position = "unset";
          tableHeader.style.top = 0;
          tableBody.style.paddingTop = 0;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.isAndroid {
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
.status_wrap_query {
  padding: 0 5.333vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .area_query {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 28px;
    img {
      width: 4vw;
      height: 4.5vw;
      margin-right: 1.5vw;
    }
    /deep/.el-input__inner {
      border: none;
      padding: 0;
      font-size: 28px;
      line-height: 2;
      height: auto;
      text-align: center;
      color: #f26899;
    }
    /deep/.el-input--suffix {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20vw;
    }
    /deep/.el-input__suffix {
      position: initial;
    }
    /deep/.el-input__icon {
      width: auto;
      height: 107px;
    }
    /deep/.el-select .el-input .el-select__caret {
      color: #f26899;
    }
  }
}
.timePopup {
  background: none;
  /deep/ .van-popup__close-icon--top-right {
    top: 70px;
    right: 70px;
  }
}
.popupTime {
  padding: 50px;
  .msg {
    width: 600px;
    padding: 40px 45px 40px;
    text-align: center;
    background: url(../../images/self.png) no-repeat center center;
    background-size: 100% 100%;
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
      text-align: left;
      font-size: 26px;
      font-weight: bold;
      color: #595959;
      margin-top: 30px;
      span {
        font-size: 26px;
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
/deep/.el-table__header-wrapper {
  z-index: 3;
}
.isFullScreen {
  /deep/.el-table__fixed-header-wrapper {
    position: fixed !important;
    top: 0 !important;
    width: 130px;
    z-index: 4;
    overflow: hidden;
  }
  /deep/.el-table__header-wrapper {
    position: fixed !important;
    top: 0 !important;
    z-index: 3;
  }
}
/deep/.filter-content .filter-type-title {
  padding-top: 0;
}
/deep/.van-dropdown-menu__bar {
  height: 107px;
}
</style>
