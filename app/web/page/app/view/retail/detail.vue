<template>
  <div class="retail-detail" :class="{ isAndroid: !isIos }">
    <NavBar
      left-text="返回"
      fixed
      title="零售明细"
      :border="false"
      :safe-area-inset-top="true"
      @click-left="back"
    >
      <template #left>
        <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
      </template>
      <template #right>
        <el-dropdowm-menu
          :filterConfig="filterConfig"
          ref="filterAction"
          :pageName="pageName"
          @visibleChange="visibleChange"
          @filterConfirm="filterConfirm"
        ></el-dropdowm-menu>
      </template>
    </NavBar>
    <div class="detail-content" v-show="showTable">
      <div class="detail-content-order">
        <div class="detail-content-order-left">
          全部订单（<span class="order-num">{{ orderTotal }}</span
          >）
        </div>
        <div
          class="detail-content-order-right"
          v-if="showSyncQuantity"
          @click="toOrderSummary"
        >
          当前沙龙未同步订单：<span class="default-color">{{
            notSyncQuantity
          }}</span>
        </div>
      </div>
      <div class="order-list">
        <List
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <order-list-item
            v-for="(order, index) in orderList"
            :key="`order_${index}`"
            :orderData="order"
            :index="index"
            :monthKey="filter.monthKey"
          ></order-list-item>
        </List>
      </div>
    </div>
    <div v-if="!showTable" class="nodata">
      <img src="../../images/nodata1.png" alt="" />
      <div>暂时没有数据</div>
    </div>
    <van-overlay :show="showOverlay" @click="clickOverlay" />
  </div>
</template>
<script>
import { NavBar, List, Overlay } from "vant";
import { isIos, closeWebview, xxxxxx, formatMoney } from "../../utils/index";
import OrderListItem from "../../components/OrderListItem.vue";
import elDropdowmMenu from "../../components/filterActionSheet/elDropdowmMenu.vue";
export default {
  data() {
    return {
      isIos: isIos(),
      activeNames: "",
      orderList: [],
      loading: true,
      finished: false,
      orderTotal: 0,
      filter: {
        pageNo: 1,
        pageSize: 20,
        monthKeys: [],
        orderTypes: [],
      },
      monthMap: [],
      filterConfig: [
        {
          prop: "orderTypes",
          label: "订单类型",
          options: [
            {
              name: "顾问RC订单",
              value: "顾问RC订单",
            },
            {
              name: "顾问BC订单",
              value: "顾问BC订单",
            },
            {
              name: "顾客RC订单",
              value: "顾客RC订单",
            },
          ],
        },
        {
          prop: "monthKeys",
          label: "时间",
          options: [],
        },
      ],
      targetContactId: null,
      showOverlay: false,
      showTable: true,
      from: "",
      pageName: "",
      accountType: "",
      notSyncQuantity: 0,
      showSyncQuantity: false,
      loginName: "",
    };
  },
  async created() {
    const { targetContactId, from, accountType, levelCode, isSelf, loginName } =
      this.$route.query;
    if (accountType === "operation" && levelCode >= 60) {
      this.showSyncQuantity = true;
    } else {
      if (isSelf && levelCode >= 60) {
        this.showSyncQuantity = true;
      } else {
        this.showSyncQuantity = false;
      }
    }
    this.targetContactId = targetContactId;
    this.from = from;
    this.accountType = accountType;
    if (this.from === "profile") {
      this.pageName = "PersonalProfilePage";
    } else {
      this.pageName = "HomePage";
    }
    let api = this.$ctx.baseApi;
    const { data: monthKey } = await this.$request.get(`${api}/monthkey`);
    let date = new Date(
      monthKey.toString().substr(0, 4),
      monthKey.toString().substr(4, 6)
    );
    date.setMonth(date.getMonth(), 1);
    for (let i = 0; i < 6; i++) {
      date.setMonth(date.getMonth() - 1);
      let newDate = `${date.getFullYear()}${this.addZero(date.getMonth() + 1)}`;
      this.monthMap.push({
        value: newDate,
        name: `${date.getFullYear()}-${this.addZero(date.getMonth() + 1)}`,
      });
    }
    this.filterConfig.forEach((o) => {
      if (o.prop === "monthKeys") {
        o.options = this.monthMap;
      }
    });
    this.$nextTick(() => {
      this.$refs.filterAction.initFilterConfig();
    });
    const data = await this.getListData();
    this.orderList = data.orderList;
    this.getNotSyncQuantity();
  },
  methods: {
    back() {
      closeWebview();
    },
    addZero(m) {
      return m < 10 ? `0${m}` : m;
    },
    async getNotSyncQuantity() {
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(`${baseApi}/oeorders/sync`);
      this.notSyncQuantity = data.notSyncQuantity;
    },
    toOrderSummary() {
      let webViewUrl = `https://{{env_minus}}lucky.marykay.com.cn/reports/order_summary?fullscreen=true&opaque=false&progress_hidden=true&busy_hidden=false&orderStatus=2,3&impersonatedContactId=${this.targetContactId}&ConsultantName=${this.loginName}`;
      console.log(webViewUrl);
      this.$jsBridge.openSchema(webViewUrl);
    },
    visibleChange(type) {
      let eventType = "RetailDetailFilterClick";
      if (this.from === "profile") {
        eventType = "PersonalRetailDetailFilterClick";
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
      this.showOverlay = type;
    },
    clickOverlay() {
      this.showOverlay = false;
      this.$refs.filterAction.clickOverlay();
    },
    async filterConfirm(filter) {
      console.log("filter", filter);
      this.filter.pageNo = 1;
      this.filter = Object.assign(this.filter, filter);

      let eventType = "RetailDetailFilterConfirmClick";
      if (this.from === "profile") {
        eventType = "PersonalFilterConfirmClick";
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
      this.finished = false;
      this.orderList = [];
      const data = await this.getListData();
      this.orderList = data.orderList;
      if (this.orderList && this.orderList.length) {
        this.showTable = true;
      } else {
        this.showTable = false;
      }
    },
    async onLoad() {
      this.filter.pageNo = this.filter.pageNo + 1;
      const data = await this.getListData();
      this.orderList = this.orderList.concat(data.orderList);
    },
    async onRefresh() {
      this.finished = false;
      this.filter.pageNo = 1;
      const data = await this.getListData();
      if (this.refreshing) {
        this.orderList = [];
        this.refreshing = false;
      }
      this.orderList = data.orderList;
    },
    async getListData() {
      this.loading = true;
      const { pageNo, pageSize, monthKeys, orderTypes } = this.filter;
      const params = { pageNo, pageSize, monthKeys, orderTypes };
      if (monthKeys && monthKeys.length) {
        params.monthKeys = monthKeys.join(",");
      }
      if (orderTypes && orderTypes.length) {
        params.orderTypes = orderTypes.join(",");
      }
      //params.contactId = this.targetContactId
      // let baseApi = 'https://mock.marykay.com.cn/mock/489/api/v1'
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(`${baseApi}/orders/retail`, {
        params,
      });
      this.orderTotal = data.orderTotal;
      this.loading = false;
      if (!data.hasNextPage) {
        this.finished = true;
      } else {
        this.finished = false;
      }
      data.orderList = data.orderList.map((o) => {
        o.orderDetails = [];
        return o;
      });
      return data;
    },
  },
  components: {
    NavBar,
    List,
    OrderListItem,
    elDropdowmMenu,
    "van-overlay": Overlay,
  },
};
</script>
<style lang="less" scoped>
.retail-detail {
  background-color: #f6f6f6;
  min-height: 100vh;
  .detail-content {
    padding-top: env(safe-area-inset-top);
    margin-top: 80px;
    &-order {
      color: #484848;
      font-size: 24px;
      line-height: 80px;
      margin: 0 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .order-num {
        color: #f16eae;
        font-weight: bold;
      }
    }
    .order-list {
      padding: 0 30px;
    }
  }
}
.isAndroid {
  .detail-content {
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
    .van-nav-bar__right {
      .nav-filter {
        color: #fff;
        font-size: 28px;
      }
    }
  }
  .van-nav-bar__title {
    color: #fff;
    font-size: 30px;
  }
}
</style>
