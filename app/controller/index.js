"use strict";
const egg = require("egg");
const axios = require("axios");

module.exports = class AppController extends egg.Controller {
  async getToken(ctx) {
    const {
      config
    } = this
    let url = 'https://oauth.xxxxxxx.com.cn/OAuthServer/OAuth/Token'
    let params = {
      grant_type: 'password',
      client_id: '',
      client_secret: '',
      username: '',
      password: ''
    }
    if (config.env !== 'prod') {
      if (config.env === 'local') config.env = 'dev'
      url = `https://${config.env}-oauth.xxxxxxx.cn/OAuthServer/OAuth/Token`
      params.username = ''
      params.password = ''
      if (config.env === 'dev') {
        params.client_id = ''
        params.client_secret = ''
      }
    }
    console.log(params)
    try {
      const data = await axios({
        method: 'POST',
        url: url,
        data: params
      })
      ctx.body = data.data;
      ctx.status = 200;
    } catch (error) {
      console.log(error)
      ctx.status = 500
    }
  }
};