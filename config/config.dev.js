module.exports = app => {
  const config = {
    baseApi: 'https://mybiz-gateway-latest.dev.pcf.mkc.io/intouch-coach-api/api/v1',

    baseShareUrl: 'https://dev-mycoach.marykay.com.cn/home',
    baseApiList: {
      income: 'https://mybiz-gateway-latest.dev.pcf.mkc.io/reports/api/v1',
      contact: 'https://mybiz-gateway-latest.dev.pcf.mkc.io/contacts/api/v3',
      calc: 'https://mybiz-gateway-latest.dev.pcf.mkc.io/prodcalc/api/v7',
      consultant: `https://mybiz-gateway-latest.dev.pcf.mkc.io/consultant-basics/api/v2`,
    },
  };

  return config;
};