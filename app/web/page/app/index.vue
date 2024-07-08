<template>
  <AppLayout :title="title">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </AppLayout>
</template>
<script type="text/babel">
import Vue from "vue";
import "./css/common.less";
import "./css/1px.less";

import store from "./store";
import router from "./router";
import AppLayout from "component/layout/app";
import { getEnv } from "./utils/index.js";
import Vconsole from "vconsole";
import jsBridge from "mkc-webview-api";
const env = getEnv();

jsBridge.getSettings().then((res) => {
  console.log("getSettings", res);
  if (res) {
    if (res.debug && res.multi) {
      let vConsole = new Vconsole();
      Vue.use(vConsole);
    }
  }
});

import { Toast } from "vant";
Vue.use(Toast);

import { thumbImage, formatMoney, formatDate } from "./utils/index.js";
Vue.filter("thumbImage", function(url, width, height) {
  return thumbImage(url, width, height);
});

Vue.filter("formatMoney", function(val = 0, digits = 0) {
  return formatMoney(val, digits);
});

Vue.filter("formatDate", function(date, fmt = "YYYY-MM-DD HH:mm:ss") {
  return formatDate(date, fmt);
});

Vue.prototype.$BaseUrl = `https://xxxxxxx-latest.${env}.pcf.mkc.io`;

export default {
  router,
  store,
  components: {
    AppLayout,
  },
  computed: {
    title() {
      return this.$store.state.title;
    },
  },
  hook: {
    render(context, options) {
      // const i18n = createI18n(context.state.locale);
      // options.i18n = i18n;
    },
  },
};
</script>
