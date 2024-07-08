'use strict';
const path = require('path');
const fs = require('fs');
const read = require('read-yaml')

module.exports = app => {
  if (app.env === 'local') {
    const { env } = read.sync('./manifest_config/manifest.yml').applications[0]
    Object.keys(env).forEach(i => {
      process.env[i] = env[i]
    })
  }

  const config = {};

  config.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(app.baseDir, 'app/web/asset/images/favicon.ico'))
  };
  // config.proxy = [
  //   {
  //     host: process.env.QR_CODE_API, // target host that matched path will be proxy to
  //     match: /^\/proxygetqrcode/, // path pattern.
  //     map(path) {
  //       return path.replace(/^\/proxygetqrcode/, '')
  //     }
  //   },
   
  // ];

  config.vuessr = {
    layout: path.join(app.baseDir, 'app/web/view/layout.html'),
    renderOptions: {
      basedir: path.join(app.baseDir, 'app/view')
    },
    injectRes:[
    ]
  };

  config.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(app.baseDir, 'logs')
  };

  config.static = {
    prefix: '/public/',
    dir: path.join(app.baseDir, 'public')
  };

  config.keys = '123456';

  config.middleware = [
    'locals',
    'access'
  ];

  config.security = {
    // csrf: {
    //   ignoreJSON: false,
    //   cookieName: 'csrfToken',
    //   sessionName: 'csrfToken',
    //   headerName: 'x-csrf-token'
    // },
    csrf: false,
    xframe: {
      enable: false,
    },
  };

  return config;
};