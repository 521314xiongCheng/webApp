<!-- 点击头像控制面板封装（diq、areaDiq特殊需求，不引用组件） -->
<template>
  <van-action-sheet
    v-model="show"
    :actions="actions"
    cancel-text="取消"
    @select="onSelect"
    @cancel="onCancel"
    :safe-area-inset-bottom="safeareainsetBottom"
    :lock-scroll="lockScroll"
  />
</template>
<script>
import { ActionSheet } from "vant";
import { deepCopy } from "../../utils/index";
const actions = [
  {
    name: "设为关注",
    prop: "follow",
  },
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
  {
    name: "查看目标评估",
    prop: "assess",
  },
  {
    name: "拨打电话",
    prop: "call",
  },
];
export default {
  data() {
    return {
      show: false,
      actions: [],
      safeareainsetBottom: true,
      lockScroll: true,
    };
  },
  props: {
    pageName: {
      type: String,
      default: "UnitDetailsPage",
    },
    profileClickEventName: {
      type: String,
      default: "UnitDetailsClick",
    },
    focusEventName: {
      type: String,
      default: "UnitDetailsSetFocusClick",
    },
    unfocusEventName: {
      type: String,
      default: "UnitDetailsUnfocusClick",
    },
    setTargetEventName: {
      type: String,
      default: "UnitDetailsSetIncomeTargetClick",
    },
    callEventName: {
      type: String,
      default: "UnitDetailsPhoneCallClick",
    },
    cancelEventName: {
      type: String,
      default: "UnitDetailsCancelClick",
    },
    evaluationEventName: {
      type: String,
      default: "OffspringDetailsHeadPortraitTargetEvaluationClick",
    },
    accountType: {
      type: String,
      default: "",
    },
    isFullScreen: {
      type: Boolean,
      default: false,
    },
    selectInfo: {
      type: String,
      default: "",
    },
    info: {
      type: Object,
      default() {
        return {};
      },
    },
    targetContactId: null,
  },
  methods: {
    onSelect(item) {
      console.log(item);
      let eventType = "UnitDetailsClick";
      switch (item.prop) {
        case "follow":
          if (this.info.isFocus) {
            eventType = this.unfocusEventName;
          } else {
            eventType = this.focusEventName;
          }
          break;
        case "profile":
          eventType = this.profileClickEventName;
          break;
        case "setTarget":
          eventType = this.setTargetEventName;
          break;
        case "call":
          eventType = this.callEventName;
          break;
        case "assess":
          eventType = this.evaluationEventName;
          break;
      }
      console.log(this.pageName, eventType);
      this.$track({
        context: this.pageName,
        behavior: eventType,
        item_type: this.pageName,
        item_id: eventType,
      });
      this.$emit("onSelect", item);
    },
    onCancel() {
      this.$track({
        context: this.pageName,
        behavior: this.cancelEventName,
        item_type: this.pageName,
        item_id: this.cancelEventName,
      });
    },
    async showActions() {
      console.log(this.$route.path);
      if (this.isFullScreen) {
        this.$toast("请返回竖屏下操作～");
        return;
      }
      // 新人行动
      let baseApi = this.$ctx.baseApi;
      const {
        data: { isNew },
      } = await this.$request.get(`${baseApi}/goldenweek/newconsultant?contactId=${this.info.contactId}`);
      let copyActions = deepCopy(actions);
      if (this.info.isFocus) {
        copyActions[0].name = "移除关注";
      } else {
        copyActions[0].name = "设为关注";
      }
      if (this.info.setTargetIncomeAmt) {
        copyActions[2].name = "邀请修改收入目标";
      } else {
        copyActions[2].name = "邀请设置收入目标";
      }
      if (this.info.careerLevelCode === "50") {
        copyActions.forEach((item, index, arr) => {
          if (item.prop === "follow") {
            arr.splice(index, 1);
          }
        });
      }
      if (this.selectInfo == "note") {
        copyActions.forEach((item, index, arr) => {
          if (
            item.prop === "follow" ||
            item.prop === "setTarget" ||
            item.prop === "assess"
          ) {
            arr.splice(index, 1);
          }
        });
        copyActions.splice(1, 0, {
          name: "查看笔记",
          prop: "goNote",
        });
      }
      if (this.info.contactId.toString() === this.targetContactId) {
        copyActions.forEach((item, index, arr) => {
          if (
            item.prop === "follow" ||
            item.prop === "setTarget" ||
            item.prop === "call"
          ) {
            arr.splice(index, 1);
          }
        });
      }
      if (
        this.accountType === "operation" &&
        !this.$route.path.includes("operation")
      ) {
        copyActions.forEach((item, index, arr) => {
          if (item.prop === "follow" || item.prop === "setTarget") {
            arr.splice(index, 1);
          }
        });
        if (Number(this.info.careerLevelCode) < 50) {
          copyActions.forEach((item, index, arr) => {
            if (item.prop === "call") {
              arr.splice(index, 1);
            }
          });
        }
      }
      if (this.accountType !== "operation") {
        copyActions.forEach((item, index, arr) => {
          if (item.prop === "assess") {
            arr.splice(index, 1);
          }
        });
      }
      // if (!isNew || this.accountType === "operation") {
      //   copyActions.forEach((item, index, arr) => {
      //     if (item.prop === "nbcAction") {
      //       arr.splice(index, 1);
      //     }
      //   });
      // }
      this.actions = copyActions;
      this.show = true;
    },
  },
  components: {
    "van-action-sheet": ActionSheet,
  },
};
</script>
<style lang="less" scoped></style>
