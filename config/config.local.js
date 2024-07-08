const path = require('path');
const ip = require('ip');
module.exports = app => {
  const config = {
    env: 'qa'
  };
  config.baseApi = `https://mybiz-gateway-latest.${config.env}.pcf.mkc.io/intouch-coach-api/api/v1`
  config.baseShareUrl = `https://qa-mycoach.marykay.com.cn/home`
  config.baseApiList = {
    income: `https://mybiz-gateway-latest.${config.env}.pcf.mkc.io/reports/api/v1`,
    contact: `https://mybiz-gateway-latest.${config.env}.pcf.mkc.io/contacts/api/v3`,
    calc: `https://mybiz-gateway-latest.${config.env}.pcf.mkc.io/prodcalc/api/v7`,
    consultant: `https://mybiz-gateway-latest.${config.env}.pcf.mkc.io/consultant-basics/api/v2`,
  }

  config.view = {
    cache: false
  };

  config.static = {
    maxAge: 0 // maxAge 缓存，默认 1 年
  };

  config.development = {
    watchDirs: [], // 指定监视的目录（包括子目录），当目录下的文件变化的时候自动重载应用，路径从项目根目录开始写
    ignoreDirs: ['app/web', 'public', 'config/manifest.json'] // 指定过滤的目录（包括子目录）
  };

  config.logview = {
    dir: path.join(app.baseDir, 'logs')
  };

  config.webpack = {
    browser: true,
    // webpackConfigList: require('easywebpack-vue').getWebpackConfig()
  };

  const localIP = ip.address();
  const domainWhiteList = [];
  [7001, 9000, 9001].forEach(port => {
    domainWhiteList.push(`http://localhost:${port}`);
    domainWhiteList.push(`http://127.0.0.1:${port}`);
    domainWhiteList.push(`http://${localIP}:${port}`);
  });

  config.security = {
    domainWhiteList
  };

  return config;
};