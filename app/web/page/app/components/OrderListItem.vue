<template>
  <div class="order-list-item">
    <div class="order-info">
      <div class="user-info">
        <div class="user-info-left">
          <img
            class="avatar"
            :src="
              orderData.headImageUrl
                ? orderData.headImageUrl
                : `https://xxxxxx/20210510150439_466_@_thumb_60.jpg`
            "
            alt=""
          />
          <div>
            <div class="user-name">{{ orderData.name }}</div>
            <div class="order-date">
              {{ orderData.orderDate | formatDate("YYYY/MM/DD HH:mm:ss") }}
            </div>
          </div>
        </div>
        <div class="user-info-right">
          <div>{{ orderData.orderType }}</div>
          <div v-show="orderData.orderExchange">
            (此订单为调单)
          </div>
        </div>
      </div>
      <div class="order-discount">
        <div
          v-if="orderData.orderType === '顾问BC订单'"
          class="flex-align-center"
        >
          立减：<span class="bold" v-if="orderData.discount === 0"
            >¥{{ orderData.discount | formatMoney(2) }}</span
          >
          <span class="bold mk-red" v-else
            >¥{{ orderData.discount | formatMoney(2) }}</span
          >
        </div>
        <div v-else class="flex-align-center">
          收益：<span class="bold mk-red"
            >¥{{ orderData.income | formatMoney(2) }}</span
          >
        </div>
        <span class="line"></span>
        绩效：<span class="bold">{{
          orderData.production | formatMoney(2)
        }}</span>
      </div>
      <div class="discount-desc">
        <div
          v-if="orderData.orderType === '顾问BC订单'"
          class="discount-desc-detail"
        >
          <span>订单金额:{{ orderData.realRetail }} </span>
          <span
            >订单折扣:{{ parseInt(orderData.discountRate * 10) * 10 }}%</span
          >
        </div>
        <div v-else class="discount-desc-detail">
          <span> 返利:{{ orderData.returnBonus }} </span>
          <span> 产品点数:{{ orderData.priceoffPointTotal }} </span>
          <span> 女主人奖励:{{ orderData.hostessReward }} </span>
        </div>
      </div>
    </div>
    <div class="order-detail">
      <!-- <div>订单明细</div> -->
      <van-collapse
        v-model="activeNames"
        accordion
        :border="false"
        @change="change"
      >
        <van-collapse-item
          ref="CollapseItem"
          :border="false"
          :name="`order_${index}`"
        >
          <template #right-icon>{{ null }}</template>
          <div class="order-detail-info">
            <div
              class="order-detail-info-item"
              v-for="(item, index) in orderDetails.orderList"
              :key="`item_${index}`"
            >
              <div class="product-image">
                <img
                  :src="
                    item.imageUrl
                      ? item.imageUrl
                      : 'https://xxxxxx/20220106140017_630.png'
                  "
                  alt=""
                />
              </div>
              <div class="product-info">
                <div class="climp product-name">
                  <span
                    v-if="item.itemType === 'FreeBonusPart'"
                    class="type-btn"
                    >促销活动</span
                  >
                  <span class="desc">{{ item.partBase.itemDesc }}</span>
                </div>
                <div>
                  <span class="product-sku">({{ item.partBase.partId }})</span>
                </div>
              </div>
              <div class="product-quantity">
                <span>x {{ item.partBase.quantity }}</span>
              </div>
            </div>
          </div>
          <div class="order-total" v-if="orderData.orderType !== '顾问BC订单'">
            <div class="order-total-item">
              <span>零售价总额</span>
              <span>{{ orderDetails.totals.section_I_retail_with_point }}</span>
            </div>
            <div class="order-total-item">
              <span>工具产品总额</span>
              <span>{{ orderDetails.totals.section_II_retail }}</span>
            </div>
            <div class="order-total-item">
              <span>运费</span>
              <span>{{ orderDetails.totals.freight_charge_on_order }}</span>
            </div>
            <div class="order-total-item">
              <span>优惠券优惠</span>
              <span>{{ orderDetails.totals.order_voucher }}</span>
            </div>
            <div class="order-total-item">
              <span class="name">订单支付金额</span>
              <span class="payment">{{
                orderDetails.totals.order_payment
              }}</span>
            </div>
          </div>
          <div class="order-total" v-else>
            <div class="order-total-item">
              <span>零售价总额</span>
              <span>{{ orderDetails.totals.section_I_retail }}</span>
            </div>
            <div class="order-total-item">
              <span>辅助产品总额</span>
              <span>{{ orderDetails.totals.section_II_retail }}</span>
            </div>
            <div class="order-total-item">
              <span>运费</span>
              <span>{{ orderDetails.totals.freight_charge_on_order }}</span>
            </div>
            <div class="order-total-item">
              <span>折扣优惠</span>
              <span>{{ orderDetails.totals.section_I_discount }}</span>
            </div>
            <div class="order-total-item">
              <span class="name">订单支付金额</span>
              <span class="payment">{{
                orderDetails.totals.order_payment
              }}</span>
            </div>
          </div>
        </van-collapse-item>
        <div class="arrow-btn" @click="showOrderDetail">
          <img
            v-if="arrowType === 'down'"
            src="../images/arrow-down.png"
            alt=""
          />
          <img v-else src="../images/arrow-up.png" alt="" />
        </div>
      </van-collapse>
    </div>
  </div>
</template>
<script>
import { Collapse, CollapseItem, Icon, Button } from "vant";
export default {
  props: {
    orderData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    index: 0,
    page: "",
    monthKey: "",
  },
  data() {
    return {
      activeNames: [],
      arrowType: "down",
      orderDetails: {
        orderList: [],
        totals: {},
      },
    };
  },
  watch: {
    monthKey() {
      this.activeNames = [];
    },
  },
  methods: {
    async change(value) {
      let baseApi = this.$ctx.baseApi;
      if (!value) {
        this.arrowType = "down";
        return;
      }
      this.arrowType = "up";
      const { data } = await this.$request.get(
        `${baseApi}/orders/${this.orderData.orderId}/oeitems`
      );
      this.orderDetails.orderList = [];
      if (data.orderPackages) {
        data.orderPackages.forEach((order) => {
          this.orderDetails.orderList = this.orderDetails.orderList.concat(
            order.lineItems
          );
        });
      }
      if (data.totals) {
        data.totals.forEach((item) => {
          let prefix = item.value >= 0 ? "¥" : "-¥";
          let value = Math.abs(item.value);
          this.orderDetails.totals[item.name] = `${prefix}${value}`;
        });
      }

      console.log("this.orderDetails", this.orderDetails);
    },
    showOrderDetail() {
      this.$refs.CollapseItem.toggle();
    },
  },
  components: {
    "van-collapse": Collapse,
    "van-collapse-item": CollapseItem,
    "van-icon": Icon,
    "van-button": Button,
  },
};
</script>
<style lang="less" scoped>
@default-color: #f16eae;
.order-list-item {
  border-radius: 16px;
  background-color: #fff;
  overflow: hidden;
  margin-bottom: 20px;
  .order-info {
    padding: 30px 30px 0 24px;
    .user-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      &-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          margin-right: 13px;
        }
        .user-name {
          color: #484848;
          font-size: 30px;
          line-height: 40px;
          font-weight: bold;
        }
        .order-date {
          font-size: 24px;
          line-height: 36px;
          color: #7f7f7f;
        }
      }
      &-right {
        text-align: right;
        font-size: 22px;
        color: #7f7f7f;
        min-width: 130px;
      }
    }
    .order-discount {
      font-size: 24px;
      line-height: 36px;
      color: #7f7f7f;
      display: flex;
      align-items: center;
      .bold {
        font-size: 34px;
        line-height: 36px;
        color: #484848;
        font-weight: bold;
      }
      .line {
        width: 1px;
        height: 27px;
        margin: 0 25px;
        background-color: #181818;
      }
    }
    .discount-desc {
      margin-top: 20px;
      background-color: #f7f7f7;
      padding: 20px;
      font-size: 24px;
      line-height: 36px;
      color: #7f7f7f;
      border-radius: 16px;
      position: relative;
      &::before {
        content: " ";
        width: 0;
        border-left: 30px solid transparent;
        border-right: 30px solid transparent;
        border-bottom: 30px solid #f7f7f7;
        position: absolute;
        left: 22px;
        top: -18px;
      }
      &-detail {
        span {
          margin-right: 30px;
        }
      }
    }
    .order-exchange {
      display: flex;
      align-items: center;
      font-weight: normal;
      font-size: 24px;
      color: #7f7f7f;
      img {
        width: 22px;
        height: 26px;
        margin-right: 5px;
      }
    }
  }
  .order-detail-info {
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    padding-top: 23px;
    // padding-bottom: 30px;
    &-item {
      color: #7f7f7f;
      font-size: 24px;
      line-height: 36px;
      margin-bottom: 30px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      .product-image {
        width: 160px;
        height: 160px;
        margin-right: 30px;
        img {
          display: block;
          width: 100%;
        }
      }
      .product-info {
        padding-top: 10px;
        flex: 1;
        max-width: 400px;
        align-content: flex-start;
        .product-name {
          max-width: 520px;
          color: #181818;
        }
        .product-sku {
          color: #7f7f7f;
        }
        .type-btn {
          padding: 0 5px;
          height: 26px;
          // background-color: #fff;
          color: #f16eae;
          font-size: 18px;
          border-radius: 3px;
          box-sizing: border-box;
          border: 1px solid #f16eae;
        }
      }
      .product-quantity {
        align-self: center;
      }
    }
    &-sum {
      display: flex;
      justify-content: flex-end;
      color: #7f7f7f;
      font-size: 20px;
      line-height: 40px;
      .num {
        color: #484848;
        font-size: 26px;
        font-weight: bold;
        margin-right: 8px;
      }
    }
  }
  .order-total {
    font-size: 24px;
    line-height: 1;
    color: #7f7f7f;
    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      .name {
        font-weight: bold;
        color: #181818;
        font-size: 26px;
      }
      .payment {
        font-weight: bold;
        color: #f16eae;
        font-size: 26px;
      }
    }
  }
  .flex-align-center {
    display: flex;
    align-items: center;
  }
  .mk-red {
    color: @default-color!important;
  }
  .arrow-btn {
    margin: 20px 0;
    text-align: center;
    img {
      display: block;
      width: 35px;
      margin: 0 auto;
    }
  }
}
/deep/.van-collapse {
  .van-cell {
    padding: 0;
    text-align: center;
    justify-content: center;
  }
  .van-cell__right-icon {
    color: #d9d9d9;
  }
  .van-collapse-item__content {
    padding: 30px 30px 0 24px;
  }
}
</style>
