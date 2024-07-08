import router from '../router'
// import jsBridge from '../utils/webviewJsBridge.js'
import jsBridge from 'mkc-webview-api'
import Vue from 'vue'
export const isLocalhost = () => {
  return location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname.indexOf('192.168') > -1
}
// 时间格式化
export const formatDate = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) {
    return ''
  }
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'))
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }
  var o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }
  var week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1 ?
        RegExp.$1.length > 2 ?
        '\u661f\u671f' :
        '\u5468' :
        '') + week[date.getDay() + '']
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

// 金钱格式化
export const formatMoney = (num, digits) => { //金额格式化
  if (!num) return '0'
  num = parseInt(num).toString()
  let x = num.split(".");
  let x1 = x[0];
  let x2 = x.length > 1 ? "." + x[1] : "";
  let rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}

function getMultiple(len) {
  let multiple = '1'
  for (let i = 0; i < len; i++) {
    multiple += '0'
  }
  return Number(multiple)
}

export const formatMoneyKeepDecimals = (num, digits = 0) => { //金额格式化
  if (!num) return '0.00'
  let multiple = getMultiple(digits)
  // 保留digits位小数，不四舍五入，整数补.00……
  num = (Math.floor(num * multiple) / multiple).toFixed(digits).toString()
  let x = num.split(".");
  let x1 = x[0];
  let x2 = x.length > 1 ? "." + x[1] : "";
  let rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}

export const readCookie = name => {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length)
    }
  }
  return null
}
// 缩略图
export const thumbImage = (url, width, height) => {
  if (!url || (url.indexOf('s3.marykay.com.cn') < 0 && url.indexOf('s3-website.marykay.com.cn') < 0)) {
    return url
  }
  let thumbPrex = `_@_thumb_center_${width}x${height}`
  url = url.replace('s3.marykay.com.cn', 's3-website.marykay.com.cn')
  let fileName = url.substring(
    0,
    url.lastIndexOf('.')
  )
  let suffix = url.substring(
    url.lastIndexOf('.')
  )
  return `${fileName}${thumbPrex}${suffix}`
}

export const getEnv = () => {
  return window.__INITIAL_STATE__.env
}

export const createQuery = params => {
  let query = ''
  for (let v in params) {
    if (params[v]) {
      query = query + `&${v}=${params[v]}`
    }
  }
  return query.substring(1)
}

export const buildQuery = params => {
  let query = ''
  for (let v in params) {
    query = query + `&${v}=${params[v]}`
  }
  return query.substring(1)
}

export const go = (url, params) => {
  const {
    ImpersonatedContactID,
    accountType,
    monthKey,
    isEmployee,
    loginName,
    //添加contactId

  } = window.__INITIAL_STATE__
  const webviewParams = {
    fullscreen: true,
    title: '',
    opaque: true,
    progress_hidden: true,
    busy_hidden: false
  }
  if (ImpersonatedContactID) {
    webviewParams.ImpersonatedContactID = ImpersonatedContactID
  }
  if (accountType) {
    webviewParams.accountType = accountType
  }
  if (monthKey) {
    webviewParams.monthKey = monthKey
  }
  if (isEmployee) {
    webviewParams.isEmployee = isEmployee
  }
  if (loginName) {
    webviewParams.loginName = loginName
  }
  params = Object.assign(webviewParams, params)
  params.title = encodeURIComponent(params.title)
  let fullurl = `${url}?${buildQuery(params)}`
  if (xxxxxx) {
    jsBridge.openSchema(fullurl)
  } else {
    window.location.href = fullurl
  }
}

export function getUrlParameter(url, name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  if (url.indexOf('?') > -1) {
    let str = url.substring(url.indexOf("?") + 1)
    let r = str.match(reg);
    if (r != null) return r[2];
    return null;
  } else {
    return null
  }
}

export function debounce(fn, wait = 1000) {
  var timeout = null
  return function () {
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(fn, wait)
  }
}

export function findParentElement(el, parentClassName) {
  if (el.className && el.className.indexOf(parentClassName) > -1) {
    console.log("el", el)
    return el
  }
  return findParentElement(el.parentElement, parentClassName)
}

export const deepCopy = function (obj, cache = []) {
  // typeof [] => 'object'
  // typeof {} => 'object'
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
  /**
   * 类似下面这种
   * var a = {b:1}
   * a.c = a
   * 资料: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
   */
  const hit = cache.filter(c => c.original === obj)[0]
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
  cache.push({
    original: obj,
    copy
  })
  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

export function unique(arr) {
  let arr1 = []; // 新建一个数组来存放arr中的值
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr1.indexOf(arr[i]) === -1) {
      arr1.push(arr[i]);
    }
  }
  return arr1;
}

export const getMaxZIndex = () => {
  let arr = Array.from(document.querySelectorAll("*")).map(e => +window.getComputedStyle(e).zIndex || 0);
  return arr.length ? Math.max(...arr) + 1 : 0
}

export const isIos = () => {
  const {
    userAgent
  } = window.navigator;
  return userAgent.includes('iPhone') || userAgent.includes('iOS') || userAgent.includes('iPad') || userAgent.includes('iPod');
};

export const isIphoneX = () => {
  return isIos() && (screen.height === 812 && screen.width === 375);
};
// export const isIos = () => {
//   const { userAgent } = window.navigator;
//   return userAgent.includes('iPhone') || userAgent.includes('iOS') || userAgent.includes('iPad') || userAgent.includes('iPod');
// };

export function closeWebview() {
  if (xxxxxx) {
    jsBridge.resetToPortraitScreen()
    jsBridge.closeNativeWebview();
  } else {
    history.back()
  }
}

export const xxxxxx = () => {
  if (navigator.userAgent.indexOf('MaryKay') > 0 || navigator.userAgent.indexOf('(null)') > 0) {
    return true
  }
  return false
}

// 判断参数是否是其中之一
export const oneOf = function (value, validList) {
  //console.log(validList)
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

function addZero(m) {
  return m < 10 ? `0${m}` : m;
}
export const getMonthMap = function (startMonth, endMonth, props) {
  startMonth = startMonth.toString()
  endMonth = endMonth.toString()
  let date = new Date(
    endMonth.toString().substr(0, 4),
    endMonth.toString().substr(4, 6)
  );
  // date.setMonth(date.getMonth(), 1);
  let monthMap = []
  let monthKey
  let count = 0; //设置最大次数100，防止参数错误导致while循环崩溃
  while (monthKey !== startMonth && count < 100) {
    date.setMonth(date.getMonth() - 1);
    monthKey = `${date.getFullYear()}${addZero(date.getMonth() + 1)}`;
    monthMap.push({
      [props.valueLabel]: monthKey,
      [props.keyLabel]: `${date.getFullYear()}/${addZero(date.getMonth() + 1)}`,
    });
    count++
  }
  return monthMap
}


//加减乘除四个方法，能确保浮点数运算不丢失精度
function isInteger(obj) {
  return Math.floor(obj) === obj
}

function toInteger(floatNum) {
  var ret = {
    times: 1,
    num: 0
  }
  var isNegative = floatNum < 0
  if (isInteger(floatNum)) {
    ret.num = floatNum
    return ret
  }
  var strfi = floatNum + ''
  var dotPos = strfi.indexOf('.')
  var len = strfi.substr(dotPos + 1).length
  var times = Math.pow(10, len)
  var intNum = parseInt(Math.abs(floatNum) * times + 0.5, 10)
  ret.times = times
  if (isNegative) {
    intNum = -intNum
  }
  ret.num = intNum
  return ret
}

function operation(a, b, digits = 2, op) {
  var o1 = toInteger(a)
  var o2 = toInteger(b)
  var n1 = o1.num
  var n2 = o2.num
  var t1 = o1.times
  var t2 = o2.times
  var max = t1 > t2 ? t1 : t2
  var result = null
  switch (op) {
    case 'add':
      if (t1 === t2) { // 两个小数位数相同
        result = n1 + n2
      } else if (t1 > t2) { // o1 小数位 大于 o2
        result = n1 + n2 * (t1 / t2)
      } else { // o1 小数位 小于 o2
        result = n1 * (t2 / t1) + n2
      }
      return (result / max).toFixed(digits)
    case 'subtract':
      if (t1 === t2) {
        result = n1 - n2
      } else if (t1 > t2) {
        result = n1 - n2 * (t1 / t2)
      } else {
        result = n1 * (t2 / t1) - n2
      }
      return (result / max).toFixed(digits)
    case 'multiply':
      result = (n1 * n2) / (t1 * t2)
      return result.toFixed(digits)
    case 'divide':
      result = (n1 / n2) * (t2 / t1)
      return result.toFixed(digits)
  }
}

// 加减乘除的四个接口
export const add = function (a, b, digits) {
  return operation(a, b, digits, 'add')
}
export const subtract = function (a, b, digits) {
  return operation(a, b, digits, 'subtract')
}
export const multiply = function (a, b, digits) {
  return operation(a, b, digits, 'multiply')
}
export const divide = function (a, b, digits) {
  return operation(a, b, digits, 'divide')
}
export const accMul = function (arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) {}
  try {
    m += s2.split(".")[1].length
  } catch (e) {}
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}