<template>
  <div :class="{ isAndroid: !isIos }">
    <van-action-sheet
      v-model="showProductionAction"
      :title="productionName + '绩效评估'"
      :class="{ 'production-action': fullscreen }"
      :close-on-click-overlay="true"
      @close="close"
    >
      <div class="content">
        <div>
          <p class="title">
            零售绩效设定
            <span> ({{ new Date() | formatDate("YYYY-MM") }}) </span>
          </p>
          <div class="change">
            <div class="changebg" @click="openNumber">
              <span>
                {{ productionAmtMdata.targetProductionAmt | formatMoney }}
              </span>

              <img src="../../images/edit.png" alt="" class="edit" />
            </div>
            <div class="sum">
              （当月已达成绩效{{
                productionAmtMdata.productionAmt | formatMoney
              }}）
            </div>
          </div>
        </div>
        <div>
          <p class="title">目标参考</p>
          <div class="productmap">
            <div @click="lastMonthpro" :class="{ productionBg: lastMonth }">
              <p>上个月绩效</p>
              <p>
                {{
                  productionAmtMdata.reference &&
                    productionAmtMdata.reference.lastMonthProductionAmt
                      | formatMoney
                }}
              </p>
            </div>
            <div @click="halfYearpro" :class="{ productionBg: halfYear }">
              <p>近6个月平均绩效</p>
              <p>
                {{
                  productionAmtMdata.reference &&
                    productionAmtMdata.reference.halfYearAvgProductionAmt
                      | formatMoney
                }}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p class="title">收益分析</p>
          <div class="Income">
            <p v-html="productionAmtMdata.incomeDescribe"></p>

            <p
              class="active"
              v-show="
                Number(this.$route.query.targetContactId) !==
                  Number(this.contactId)
              "
              @click="shareToWechat"
            >
              邀请她设置当月收入目标
            </p>
          </div>
        </div>
        <div class="btn" @click="addproduction">保存绩效</div>
      </div>
    </van-action-sheet>
    <van-number-keyboard
      v-model="pro"
      :show="show"
      theme="custom"
      close-button-text="完成"
      :maxlength="7"
      :hide-on-click-outside="false"
      @blur="
        show = false;
        fullscreen = false;
      "
      :z-index="zIndex"
      @input="onInput"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import { NumberKeyboard, ActionSheet, Dialog } from "vant";
import { isIos, getMaxZIndex, formatMoney } from "../../utils/index";
import storage from "good-storage";
export default {
  // props: ["contactId", "productionName", "queryType"],
  props: {
    contactId: "",
    productionName: "",
    queryType: "",
    pageName: {
      type: String,
      default: "UnitDetailsPage",
    },
    inputEventName: {
      type: String,
      default: "UnitDetailsRetailProdClick",
    },
    lastMonthEventName: {
      type: String,
      default: "UnitDetailsLastMonthProdClick",
    },
    sixMonthEventName: {
      type: String,
      default: "UnitDetailsSixMonthProdClick",
    },
    saveEventName: {
      type: String,
      default: "UnitDetailsSaveRetailProdClick",
    },
    inviteEventName: {
      type: String,
      default: "UnitDetailsInviteToSetTargetClick",
    },
  },
  data() {
    return {
      isIos: isIos(),
      pro: "",
      show: false,
      lastMonth: false,
      halfYear: false,
      productionAmtMdata: {
        reference: {},
      },
      fullscreen: false,
      showProductionAction: false,
      zIndex: 100,
    };
  },
  methods: {
    onInput(key) {
      this.pro += key;
      this.productionAmtMdata.targetProductionAmt = Number(
        this.pro.split(",").join("")
      );
      this.estimateData(this.productionAmtMdata.targetProductionAmt);
    },
    onDelete() {
      console.log(this.productionAmtMdata.targetProductionAmt);
      this.productionAmtMdata.targetProductionAmt = this.productionAmtMdata.targetProductionAmt.toString();
      if (this.productionAmtMdata.targetProductionAmt != "") {
        this.productionAmtMdata.targetProductionAmt = this.productionAmtMdata.targetProductionAmt.slice(
          0,
          this.productionAmtMdata.targetProductionAmt.length - 1
        );
      }
      this.estimateData(Number(this.productionAmtMdata.targetProductionAmt));
    },
    shareToWechat() {
      this.$track({
        context: this.pageName,
        behavior: this.inviteEventName,
        item_type: this.pageName,
        item_id: this.inviteEventName,
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
    },
    async share() {
      let baseApi = this.$ctx.baseApi;
      const inviteLinkData = await this.$request.post(`${baseApi}/invite/link`);
      console.log(inviteLinkData);
      let shareUrl = `${this.$ctx.baseShareUrl}?linkKey=${inviteLinkData.data.linkKey}`;
      const shareArg = {
        kind: "media",
        title: "写下你的收入愿望，我们一起实现她",
        description: "愿望无论大小，说不定就实现了呢？",
        thumbnail:
          "https://xxxxx/20210917102605_661.png",
        mediatype: "webpage",
        scene: "WXSceneSession",
        url: shareUrl,
      };
      this.$jsBridge.shareToWechat(shareArg);
    },
    async addproduction() {
      this.$track({
        context: this.pageName,
        behavior: this.saveEventName,
        item_type: this.pageName,
        item_id: this.saveEventName,
      });
      if (
        this.productionAmtMdata.targetProductionAmt <
        this.productionAmtMdata.productionAmt
      ) {
        this.$toast("评估绩效请大于已达成绩效～");
        return;
      }
      let baseApi = this.$ctx.baseApi;
      let ImpersonatedContactID = storage.get("ImpersonatedInfo")
        .targetContactId;
      const params = {
        //设置人id
        setByContactId: ImpersonatedContactID,
        //被设置人id
        memberContactId: this.contactId,
        //设定绩效
        targetAmt: this.productionAmtMdata.targetProductionAmt,
      };
      const { data } = await this.$request.post(
        `${baseApi}/target/production`,
        params
      );
      console.log(data);
      this.pro = "";
      this.show = false;
      this.fullscreen = false;
      this.$emit("addProduction", this.productionAmtMdata.targetProductionAmt);
    },
    lastMonthpro() {
      this.$track({
        context: this.pageName,
        behavior: this.lastMonthEventName,
        item_type: this.pageName,
        item_id: this.lastMonthEventName,
      });
      this.lastMonth = true;
      this.halfYear = false;
      this.productionAmtMdata.targetProductionAmt = this.productionAmtMdata.reference.lastMonthProductionAmt;
      this.estimateData(this.productionAmtMdata.targetProductionAmt);
    },
    halfYearpro() {
      this.$track({
        context: this.pageName,
        behavior: this.sixMonthEventName,
        item_type: this.pageName,
        item_id: this.sixMonthEventName,
      });
      this.lastMonth = false;
      this.halfYear = true;
      this.productionAmtMdata.targetProductionAmt = this.productionAmtMdata.reference.halfYearAvgProductionAmt;
      this.estimateData(this.productionAmtMdata.targetProductionAmt);
    },
    openNumber() {
      this.$track({
        context: this.pageName,
        behavior: this.inputEventName,
        item_type: this.pageName,
        item_id: this.inputEventName,
      });
      this.show = true;
      this.lastMonth = false;
      this.halfYear = false;
      this.pro = "";
      this.fullscreen = true;
    },
    //实时输入接口
    async estimateData(data) {
      console.log(data, "data");
      let baseApi = this.$ctx.baseApi;
      const params = {};
      params.memberContactId = this.contactId;
      params.estimateProductionAmt = data;
      const res = await this.$request.get(`${baseApi}/estimate/production`, {
        params,
      });
      this.productionAmtMdata.incomeDescribe = res.data.incomeDescribe;
    },
    close() {
      this.lastMonth = false;
      this.halfYear = false;
      this.show = false;
      this.fullscreen = false;
      this.pro = "";
      this.zIndex = 100;
    },
  },
  components: {
    "van-number-keyboard": NumberKeyboard,
    "van-action-sheet": ActionSheet,
  },
  watch: {
    async showProductionAction(n) {
      if (n) {
        let zIndex = getMaxZIndex();
        console.log(zIndex);
        this.zIndex = zIndex + 5000;
        const params = {
          queryType: this.queryType,
          memberContactId: this.contactId,
        };
        let baseApi = this.$ctx.baseApi;
        const { data } = await this.$request.get(
          `${baseApi}/estimate/production`,
          {
            params,
          }
        );
        this.productionAmtMdata = data;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  font-size: 32px;
  color: #303133;
  line-height: 28px;
}
.content > div {
  margin-top: 40px;
}
.content {
  padding: 25px;
}
.change {
  display: flex;
  align-items: baseline;
}
.changebg {
  position: relative;
  margin-top: 25px;
  width: 293px;
  height: 81px;
  border-radius: 10px;
  background: #fff7fa;
  padding: 0 15px;
  line-height: 81px;
  font-size: 50px;
  color: #f16eae;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.edit {
  width: 25px;
  height: 25px;
  // position: absolute;
  // right: 5px;
  // top: 50%;
  // transform: translateY(-50%);
}
.sum {
  font-size: 24px;
  color: #303133;
  margin-left: 20px;
}
.productmap {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
}
.productmap > div {
  flex: 1;
  margin: 4px;
  height: 100px;
  background: #f8f8f8;
  border-radius: 8px;
  font-size: 24px;
  text-align: center;
  font-weight: 400;
  color: #484848;
  padding: 15px 0px;
  box-sizing: border-box;
}
.productmap .active {
  background: #fff7fa;
}
.Income {
  width: 100%;
  border: 1px dotted #f16eae;
  border-radius: 8px;
  padding: 15px;
  font-size: 28px;

  color: #484848;
  line-height: 36px;
  margin-top: 25px;
}
.Income span {
  color: #f16eae;
}
.Income .active {
  color: #f16eae;
  text-align: right;
  margin-top: 10px;
}
.btn {
  width: 356px;
  height: 61px;
  background: #f16eae;
  box-shadow: 0px 1px 3px 0px rgba(255, 255, 255, 0.5);
  border-radius: 31px;
  margin: 20px auto;
  text-align: center;
  line-height: 61px;
  color: white;
}
.productmap .productionBg {
  background-color: #fff7fa;
  color: #f16eae;
}
.production-action {
  height: 100vh;
  transition: all 0.3s;
  max-height: 100vh;
  // top: 55px;
}
.isAndroid {
  .production-action {
    top: 55px;
  }
}
</style>
