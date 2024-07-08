'use strict';
const egg = require('egg');
module.exports = class AppController extends egg.Controller {
  async index() {
    const { ctx, config } = this
    const url = ctx.url;
    //加入contactId
    const { mode, monthKey, targetContactId, ImpersonatedContactID, accountType, isEmployee, loginName } = ctx.query;
    await ctx.renderClient('app/index.js', {
      env: config.env,
      monthKey,
      baseApi: config.baseApi,
      baseApiList: config.baseApiList,
      baseShareUrl: config.baseShareUrl,
      targetContactId: targetContactId,//支持按contactId查询数据
      ImpersonatedContactID: ImpersonatedContactID,//支持员工账号
      accountType: accountType,//标识当前登录账号为员工运营账号
      isEmployee: isEmployee,
      
      loginName: loginName, //视为登录账号名字
    });
  }

  async health(ctx) {
    ctx.body = "ok";
    ctx.status = 200
  }

};