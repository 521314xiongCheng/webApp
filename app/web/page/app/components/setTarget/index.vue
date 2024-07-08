<template>
  <div>
    <van-dialog
      v-model="setTargetDialog"
      title=""
      :close-on-click-overlay="true"
      :show-confirm-button="false"
      class="target_dialog"
    >
      <div class="target_content">
        <div class="target_content-title">{{ setTargetTitle }}</div>
        <div class="target_content-input">
          <van-field
            v-model="targetIncomeAmt"
            :maxlength="9"
            :formatter="formatter"
            type="number"
            @click="targetBoxClick"
          />
        </div>
        <div class="target_content-tip">
          <span>
            <img src="../../images/index/icon_tip.png" alt="" />
          </span>

          <div>
            <span>{{ setTargetTip }}</span>
          </div>
        </div>
        <div class="target_content-btn">
          <van-button class="btn" @click="setTargetIncomeConfirm"
            >保存</van-button
          >
        </div>
      </div>
      <div class="cer_close" @click="setTargetDialog = false">
        <img src="../../images/index/icon_close.png" alt="" />
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { Dialog, Field, Button } from "vant";
import { formatMoney } from "../../utils/index";
export default {
  data() {
    return {
      setTargetDialog: false,
      targetIncomeAmt: null, //设置目标收入
    };
  },
  props: {
    isSettingTarget: {
      type: Boolean,
      default: true,
    },
    levelCode: {
      type: Number,
      default: 97,
    },
    incomeTargetIncomeAmt: {
      type: Number,
      default: 0,
    },
    pageName: {
      type: String,
      default: "UnitDetailsPage",
    },
  },
  computed: {
    setTargetTitle() {
      console.log("this.levelCode", this.levelCode);
      return this.isSettingTarget ? "请修改收入目标" : "请输入收入目标";
    },
    setTargetTip() {
      if (this.levelCode < 60) {
        return "当月的收入需要和美容顾问一起达成，一起来评估她们当月的零售绩效吧。";
      } else if (this.levelCode === 60) {
        return "当月的收入需要和沙龙成员一起达成，一起来评估她们当月的零售绩效吧。";
      } else {
        return "当月的收入需要和督导一起达成，一起来评估她们当月的零售绩效吧。";
      }
    },
  },

  // mounted() {
  //   console.log(this.levelCode);
  //   if (this.levelCode < 60) {
  //     this.setTargetTip =
  //       "当月的收入需要和美容顾问一起达成，一起来评估她们当月的零售绩效吧。";
  //   } else if (this.levelCode === 60) {
  //     this.setTargetTip =
  //       "当月的收入需要和沙龙成员一起达成，一起来评估她们当月的零售绩效吧。";
  //   } else {
  //     this.setTargetTip =
  //       "当月的收入需要和督导一起达成，一起来评估她们当月的零售绩效吧。";
  //   }
  // },
  methods: {
    targetBoxClick() {
      this.$track({
        context: this.pageName,
        behavior: "UnitDetailsFillInTargetClick",
        item_type: this.pageName,
        item_id: "UnitDetailsFillInTargetClick",
      });
    },
    formatter(value) {
      if (!value) return "";
      return formatMoney(value);
    },
    setTargetIncome() {
      this.setTargetDialog = true;
      if (this.incomeTargetIncomeAmt) {
        this.targetIncomeAmt = this.incomeTargetIncomeAmt;
      }
    },
    async setTargetIncomeConfirm() {
      this.$track({
        context: this.pageName,
        behavior: "UnitDetailsTargetSaveClick",
        item_type: this.pageName,
        item_id: "UnitDetailsTargetSaveClick",
      });
      if (!this.targetIncomeAmt) return;
      let targetIncomeAmt = parseInt(this.targetIncomeAmt.split(",").join(""));
      if (targetIncomeAmt === this.incomeTargetIncomeAmt) {
        this.setTargetDialog = false;
        return;
      }
      const { data } = await this.$request.post(
        `${this.$ctx.baseApi}/target/income`,
        {
          targetAmt: targetIncomeAmt,
          sourceType: "app",
        }
      );
      this.setTargetDialog = false;
      this.$emit("setTargetIncomeConfirm");
    },
  },
  components: {
    "van-button": Button,
    "van-dialog": Dialog.Component,
    "van-field": Field,
  },
};
</script>
<style lang="less" scoped>
.target_dialog {
  background-color: transparent;
  .target_content {
    position: relative;
    top: 0;
    width: 542px;
    height: 662px;
    background-image: url("../../images/index/target_bg.png");
    background-size: 100% 100%;
    text-align: center;
    margin: 0 auto;
    &-title {
      width: 100%;
      position: absolute;
      font-size: 45px;
      top: 190px;
      font-weight: bold;
      color: #181818;
      padding: 0 80px;
    }
    &-input {
      position: absolute;
      top: 278px;
      width: 213px;
      left: 170px;
      border-bottom: 3px solid #f16eae;
      .van-field {
        background-color: transparent;
        font-size: 40px;
        line-height: 56px;
        padding: 0;
        /deep/.van-field__control {
          text-align: center;
          color: #f16eae;
        }
      }
    }
    &-tip {
      width: 100%;
      position: absolute;
      top: 382px;
      text-align: left;
      display: flex;
      align-items: flex-start;
      img {
        width: 30px;
        height: 30px;
        margin-left: 28px;
        margin-right: 8px;
        display: inline-block;

        box-sizing: content-box;
      }
      font-size: 24px;
      line-height: 28px;
      color: #181818;
    }
    &-btn {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .btn {
        background: linear-gradient(180deg, #f9a7d7 0%, #f16eae 100%);
        border-radius: 53px;
        height: 76px;
        width: 417px;
        font-size: 30px;
        color: #fff;
      }
    }
  }
  .cer_close {
    margin: 50/7.5vw auto 0;
    width: 58/7.5vw;
    height: 58/7.5vw;
    img {
      width: 100%;
    }
  }
}
</style>
