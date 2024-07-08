import md5 from 'js-md5'
// import jsBridge from '../utils/webviewJsBridge.js'
import jsBridge from 'mkc-webview-api'
import { getEnv, createQuery } from './index'

export const getICSH5Url = async function(sourceId = 301,appId = "IntouchApp-301"){
  let timestamp = new Date().getTime();
  let string = `${sourceId}${appId}${timestamp}`;
  let signature = md5(string);
  let server = "https://ics-robot.xxxxxx.com.cn/meiLinKai/chatVerify";
  if(getEnv() !== 'prod') {
    server = "https://ics-robot-test.xxxxxx.com.cn/meiLinKai/chatVerify"
  }
  let accesstoken = await jsBridge.getAccessToken()
  console.log(accesstoken)
  let params = {
    sourceid: sourceId,
    timestamp: timestamp,
    signature: signature,
    accesstoken: accesstoken
  }
  let url = `${server}?${createQuery(params)}`
  console.log('url', url)
  return url
}