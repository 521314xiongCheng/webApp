<template>
  <div>
    <van-tabbar
      v-model="active"
      placeholder
      active-color="#FF69B1"
      @change="tabChange"
      :safe-area-inset-bottom="true"
    >
      <van-tabbar-item>
        <span>首页</span>
        <template #icon="props">
          <img
            :src="
              props.active
                ? require('../images/index/icon_tab_1_selected.png')
                : require('../images/index/icon_tab_1.png')
            "
            alt=""
          />
        </template>
      </van-tabbar-item>
      <van-tabbar-item name="MyContacts">
        <span>联系人</span>
        <template #icon="props">
          <img
            :src="
              props.active
                ? require('../images/index/icon_tab_2.png')
                : require('../images/index/icon_tab_2.png')
            "
            alt=""
          />
        </template>
      </van-tabbar-item>
      <van-tabbar-item name="MyReport">
        <span>竞赛报表</span>
        <template #icon="props">
          <img
            :src="
              props.active
                ? require('../images/index/icon_tab_3.png')
                : require('../images/index/icon_tab_3.png')
            "
            alt=""
          />
        </template>
      </van-tabbar-item>
      <van-tabbar-item name="calc">
        <span>绩效计算器</span>
        <template #icon="props">
          <img
            :src="
              props.active
                ? require('../images/index/icon_tab_4.png')
                : require('../images/index/icon_tab_4.png')
            "
            alt=""
          />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, Button } from "vant";
export default {
  props: ["targetContactId", "levelCode"],

  data() {
    return {
      active: 0,
    };
  },
  mounted() {
    const onFronted = () => {
      // 从搜索页返回时需要刷新数据
      this.onFronted();
    };
    this.$jsBridge.onFronted(onFronted);
    console.log("登记", this.targetContactId, this.levelCode);
  },
  created() {},
  methods: {
    onFronted() {
      this.active = 0;
    },
    goHome() {
      let url = `${window.location.origin}/home`;
      const params = {
        targetContactId: this.targetContactId,
        levelCode: this.levelCode,
        opaque: false,
      };
      this.$go(url, params);
    },
    goContact() {
      let url = `${window.location.origin}/contact`;
      const params = {
        targetContactId: this.targetContactId,
        levelCode: this.levelCode,
        opaque: false,
        impersonatedContactId: this.targetContactId,
      };
      this.$go(url, params);
      this.active = 0;
    },
    goCalc() {
      let url = `${window.location.origin}/calculate`;
      const params = {
        targetContactId: this.targetContactId,
        levelCode: this.levelCode,
        opaque: false,
      };
      this.$go(url, params);
      this.active = 0;
    },
    tabChange(appId) {
      console.log(appId);
      switch (appId) {
        case "home":
          this.goHome();
          break;
        case "MyContacts":
          this.$track({
            context: "ButtonTab",
            behavior: "TabContactsClick",
            item_type: "ButtonTab",
            item_id: "TabContactsClick",
          });
          this.goContact();
          break;
        case "MyReport":
          this.$track({
            context: "ButtonTab",
            behavior: "TabContestClick",
            item_type: "ButtonTab",
            item_id: "TabContestClick",
          });
          // let url = `${window.location.origin}/reports`;
          // const params = {
          //   targetContactId: this.$route.query.targetContactId,
          // };
          // this.$go(url, params);
          // this.$jsBridge.openSchema(`mk:///Intouch?appId=MyReport&pageId=SDList`)

          this.$jsBridge.openSchema(
            `mk:///Intouch?appId=MyReport&pageId=index&title=报表&contactId=${this.targetContactId}`
          );
          this.active = 0;
          break;
        case "calc":
          this.$track({
            context: "ButtonTab",
            behavior: "TabProdCalculatorClick",
            item_type: "ButtonTab",
            item_id: "TabProdCalculatorClick",
          });
          this.goCalc();
          break;
      }
    },
  },

  components: {
    "van-tabbar": Tabbar,
    "van-tabbar-item": TabbarItem,
    "van-button": Button,
  },
};
</script>

<style></style>
