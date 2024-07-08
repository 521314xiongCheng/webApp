'use strict';

import axios from 'axios'
import {
  isLocalhost,
  readCookie
} from '../../page/app/utils/index'
// import jsBridge from '../../page/app/utils/webviewJsBridge'
import jsBridge from 'mkc-webview-api'

axios.defaults.timeout = 20000;
axios.defaults.xsrfHeaderName = 'x-csrf-token';
axios.defaults.xsrfCookieName = 'csrfToken';

axios.interceptors.request.use(async (config) => {
  if (EASY_ENV_IS_NODE) {
    return config
  }

  if (!config.header) config.header = {}
  config.header['x-csrf-token'] = readCookie('csrfToken')

  if (config.url === '/getAccessToken') {
    config.baseURL = location.origin
    return config
  }

  let accessToken = ''
  if (EASY_ENV_IS_NODE) {


  } else {
    // 本地调试时，调用dev环境接
    if (isLocalhost()) {
      const {
        data: atData
      } = await axios.get('/getAccessToken')
      accessToken = atData.access_token
    } else {

      try {
        accessToken = await jsBridge.getAccessToken()
        //console.log('accessToken', accessToken)
      } catch (error) {
        // console.log('accessToken', error)
      }
    }
  }
  //console.log('window.__INITIAL_STATE__',window.__INITIAL_STATE__)
  const {
    targetContactId,
    ImpersonatedContactID,
    contactId
  } = window.__INITIAL_STATE__

  if (ImpersonatedContactID) {
    config.headers['Impersonated-Contact-ID'] = ImpersonatedContactID
    config.headers['impersonatedContactId'] = ImpersonatedContactID
  }
  if (config.method === 'get' || config.method === 'delete' || config.method === 'put') {
    if (!config.params) config.params = {}
    config.params.access_token = accessToken
    if (targetContactId && !config.params.contactId) {
      config.params.contactId = targetContactId
    }
    if (contactId) {
      config.params.contactId = contactId
    }

  } else {
    config.headers.AccessToken = accessToken;
  }

  return config
}, undefined)

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default axios