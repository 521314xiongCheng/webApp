
> base on egg-vue-webpack-boilerplate
> Hybrid app
> Bridge interation with native

## PCF URL


## node version : 12.14.1

## reference

- [easywebpack](https://github.com/easy-team/easywebpack) ^4.x.x
- [easywebpack-vue](https://github.com/easy-team/easywebpack) ^4.x.x
- [egg-view-vue-ssr](https://github.com/easy-team/egg-view-vue-ssr) ^3.x.x
- [egg-webpack](https://github.com/easy-team/egg-webpack) ^4.x.x
- [egg-webpack-vue](https://github.com/easy-team/egg-webpack-vue) ^2.x.x

## run in local

```bash
npm install
```

```bash
npm run dev
```

http://127.0.0.1:7001

![npm start启动](https://github.com/hubcarl/egg-vue-webpack-boilerplate/blob/master/docs/images/webpack-build.png)

## delploy

upload static file to s3 while jenkins combile

## JSBridge

项目基于 native webview 环境，所以项目中涉及到 AT 获取，下载视频、图片，分享，获取 userInfo 等操作都是通过 JSBrigde 调用 native 实现


## 本地开发

AccessToken：开发环境通过 Eggjs 调用后端 mockApi 拿 AT （/getAccessToken）

Vue 原型链方法：  
 $go: 路由跳转  
   $request: 请求库  
 $env: 环境变量  
   $track: log

## 移动端适配

使用 css `vw` 单位进行适配 参考 https://www.w3cplus.com/css/vw-for-layout.html

## SplunkTrack

## 项目

route.query:页面链接参数定义

ImpersonatedContactID：测试账号登录选中任意账号查看页面时，此 ID 作为登录账号 ID，添加到 axios.headers
targetContactId：查看他人页面、报表数据时，此 ID 作为目标 ID，添加到请求接口的 query.contactId
businessType：查看区域报表是，90 级以上 AREA_ONE_TO_THREE 90 级以下 AREA_ONE
accountType：operation 员工账号登录专有，用于页面操作权限
levelCode：职级，部分页面按职级显示不同的类目
monthKey：当前服务器时间 用于部分报表表头渲染
isSelf：是否是本人，用于部分页面设置收入目标、报表渲染‘本人’标签
