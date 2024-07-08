'use strict';

const S3Plugin = require('webpack-s3-plugin');
const webpack = require('webpack')
const AWS = require('aws-sdk');
const path = require('path');

function formatDate() {
  const date = new Date();
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${year}${month}${day}`
}

const plugins = [
  {
    imagemini: false,
  },
  // new CompressionPlugin({
  //   test: /\.(js|css)$/
  // })
]
// Document：https://www.yuque.com/easy-team/easywebpack 和 https://www.yuque.com/easy-team/egg-vue 
module.exports = {
  dll: [
    {
      name: 'dll1',
      lib: ['vue', 'vuex', 'axios', 'vuex-router-sync']
    }
  ],
  resolve: {
    alias: {
      'vendor': path.join(__dirname, 'app/web/page/app/components/vendor'),
    },
  },
  plugins,
  productionSourceMap: false,
  cdn: `https://xxxxxxxx/${formatDate()}`,
  customize: webpackConfig => {
    if (process.env.NODE_ENV === 'production') {
      webpackConfig.plugins.push(
        new S3Plugin({
          // directory: path.resolve(__dirname, 'public'),
          basePath: `/xxxxxxx/${formatDate()}/public`,
          exclude: /.*\.html$/,
          s3Options: {
            credentials: new AWS.EC2MetadataCredentials({
              httpOptions: { timeout: 5000 },
              maxRetries: 10,
              retryDelayOptions: { base: 200 }
            }),
            region: 'cn-north-1'
          },
          s3UploadOptions: {
            Bucket: 'xxxxxx-mobile-resources',
            /*
            * Images cache-control: 1 day
            * Other resources cache-control: 1 week
            * Data resources cache-control: 1 month with revalidation
            * Scripts and styles cache-control: 1 year
            */
            CacheControl: 'max-age=315360000, no-transform, public',
            // ContentEncoding(fileName) {
            //   if (/\.(js|css|map)$/.test(fileName)) {
            //       return 'gzip';
            //   }
            // }
          },
          cdnizerOptions: {
            defaultCDNBase: 'https://xxxxxx.com.cn'
          }
        })
      )
    }
  }
};