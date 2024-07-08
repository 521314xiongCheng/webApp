'use strict';
// px => vw
const postcssNormalize = require('postcss-normalize')
const postcssAspectRatioMini = require('postcss-aspect-ratio-mini')
const postcssPxToViewport = require('postcss-px-to-viewport-opt')

const postcssWriteSvg = require('postcss-write-svg')
// const postcssCssnext = require('postcss-cssnext');
const postcssViewportUnits = require('postcss-viewport-units')
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer')
module.exports = {
  plugins: [
    autoprefixer({
      overrideBrowserslist: ['iOS >= 7', 'Android >= 4.0']
    }),
    // px => vw
    postcssNormalize(),
    postcssAspectRatioMini({}),
    postcssWriteSvg({
      utf8: false,
    }),
    // postcssCssnext({}),
    postcssPxToViewport({
      viewportWidth: 750, // 视窗的宽度，对应我们设计稿的宽度，一般是750
      unitPrecision: 3, // 指定'px'转换为视窗单位值得小数位数（很多时候无法整除）
      viewportUnit: 'vmin', // 指定需要转换成的视窗单位,建议使用vw
      selectorBlackList: [
        '.ignore',
        '.hairliness',
        '.el-table__header-wrapper',
        '.el-table__body-wrapper',
        '.el-table__fixed',
        '.el-table__fixed-right',
        '.cell-class_name',
        '.el-table__fixed-header-wrapper',
        '.el-table__fixed-body-wrapper'
      ], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值。
      mediaQuery: false, // 允许在媒体查询中转换`px`
      exclude: /(\/|\\)(node_modules)(\/|\\)/
    }),
    postcssViewportUnits({}),
    cssnano({
      autoprefixer: false,
      'postcss-zindex': false,
    }),
  ]
};