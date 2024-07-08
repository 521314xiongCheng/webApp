'use strict';
import request from 'framework/network/request';
import {
  go,
  isLocalhost,
  getEnv
} from '../../page/app/utils/index.js'
// import jsBridge from '../../page/app/utils/webviewJsBridge'
import jsBridge from 'mkc-webview-api'
import querystring from 'qs'
import storage from 'good-storage';
import * as echarts from "echarts";
import {
  TitleComponent
} from "echarts/components";
import {
  PieChart
} from "echarts/charts";
import {
  LabelLayout
} from "echarts/features";
import {
  CanvasRenderer
} from "echarts/renderers";

function sendSplunkTrackRequest(href) {
  var el = document.getElementById('trackImg')
  if (el) {
    el.src = href
    return el
  }
  el = document.createElement('img')
  el.src = href
  el.id = "trackImg"
  el.style = "visibility: hidden; width: 0;"
  document.body.appendChild(el)
  return el
}


export default {
  install(Vue) {
    if (!Vue.prototype.hasOwnProperty('$request')) {
      Vue.prototype.$request = request;
    }
    if (!Vue.prototype.hasOwnProperty('$env')) {
      Vue.prototype.$env = getEnv();
    }
    if (!Vue.prototype.hasOwnProperty('$jsBridge')) {
      Vue.prototype.$jsBridge = jsBridge;
    }
    if (!Vue.prototype.hasOwnProperty('$go')) {
      Vue.prototype.$go = go
    }
    if (!Vue.prototype.hasOwnProperty('$ctx')) {
      Vue.prototype.$ctx = window.__INITIAL_STATE__;
    }
    if (!Vue.prototype.hasOwnProperty('$isLocalhost')) {
      Vue.prototype.$isLocalhost = isLocalhost()
    }
    echarts.use([TitleComponent, PieChart, CanvasRenderer, LabelLayout]);
    if (!Vue.prototype.hasOwnProperty('$echarts')) {
      Vue.prototype.$echarts = echarts
    }
    if (!Vue.prototype.hasOwnProperty('$track')) {
      // {
      //   "behavior": "eventName",
      //   "item_type": "xx",
      //   "item_id": "xx",
      //   "context": "pagename",
      //   "attributes": {}
      // }
      Vue.prototype.$track = async function track(params) {
        // AppId="" ENV="DEV" eventtype="pcf_track"
        // query 参数必须包含 AppId、LogLevel(info 或者 error)、ENV，其他参数自行添加。
        let contactId = storage.get('ContactId')
        if (!contactId) {
          let userProfile = await jsBridge.getUserProfile()
          userProfile = typeof userProfile === 'string' ? JSON.parse(userProfile) : userProfile
          contactId = userProfile.contact_id
          storage.set('ContactId', contactId)
          console.log('userProfile.contact_id1111111', userProfile)
        }
        console.log('track ContactId', contactId)

        const ENV = getEnv()
        const splunkParams = Object.assign({
          AppId: "",
          ENV,
          eventtype: "pcf_track",
          LogLevel: 'info',
          UserId: contactId
        }, params)
        const splunkTrackUrl = `https://xxxxxxx.com.cn?${querystring.stringify(splunkParams)}`
        console.log(splunkTrackUrl)
        sendSplunkTrackRequest(splunkTrackUrl)
        jsBridge.track(params)
      }
    }
    if (!Vue.hook) {
      Vue.hook = {
        render(context, options) {
          // const i18n = createI18n(context.state.locale);
          // options.i18n = i18n;
        }
      };
    }
  }
};