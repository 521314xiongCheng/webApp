exports.ids=[13],exports.modules={115:function(t,e,a){var i=a(119);i.__esModule&&(i=i.default),"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var n=a(57).default;t.exports.__inject__=function(t){n("ca7aef08",i,!0,t)}},116:function(t,e,a){"use strict";var i={name:"table-list",props:{tableData:Object,border:{type:Boolean,default:!0},isFullScreen:{type:Boolean,default:!1},setClassName:Function},data:()=>({loadingText:"拼命加载中"}),mounted(){},methods:{sortChange(t){this.$emit("sortChange",t)},headerClick(t,e){this.$emit("headerClick",t,e)},rowClickchange(t){this.$emit("rowClickchange",t)},cellClick(t,e,a,i){this.$emit("cellClick",{row:t,column:e,event:a,cell:i})}}},n=a(10);var o=Object(n.a)(i,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"common-table"},[a("el-table",{ref:"commonTable",attrs:{data:t.tableData.data,stripe:!0,"element-loading-text":t.loadingText,"show-header":t.tableData.showHeader,height:t.tableData.height,"header-cell-class-name":"common-table-header","cell-class-name":t.setClassName,border:t.border},on:{"sort-change":t.sortChange,"header-click":t.headerClick,"row-click":t.rowClickchange,"cell-click":t.cellClick}},[t._t("between"),t._v(" "),t._l(t.tableData.header,(function(e){return a("el-table-column",{key:e.prop,attrs:{prop:e.prop,label:e.label,width:e.width,fixed:e.fixed,"min-width":e.minWidth,"max-width":e.maxWidth,sortable:e.sortable,"sort-orders":["descending","ascending",null],align:"center"},scopedSlots:t._u([{key:"default",fn:function(i){return[a("span",[t._v(t._s(e.formatter?e.formatter(i.row,i.$index):i.row[e.prop]))])]}}],null,!0)})})),t._v(" "),t._t("default")],2)],1)}),[],!1,(function(t){var e=a(118);e.__inject__&&e.__inject__(t)}),"797892fe","3e91d5e2");e.a=o.exports},118:function(t,e,a){"use strict";a.r(e);var i=a(115);for(var n in i)"default"!==n&&function(t){a.d(e,t,(function(){return i[t]}))}(n)},119:function(t,e,a){(e=a(56)(!1)).push([t.i,'[data-v-797892fe] .el-table,[data-v-797892fe] .el-table thead{color:#333}[data-v-797892fe] .el-table thead tr th{background-color:#fafafa}.common-table[data-v-797892fe] .cell-class_avatar .cell{overflow:unset}.common-table[data-v-797892fe] .cell-class_avatar .cell .avatar-wrap{position:relative;width:10.667vmin;height:10.667vmin;margin:0 auto;content:"viewport-units-buggyfill; width: 10.667vmin; height: 10.667vmin"}.common-table[data-v-797892fe] .cell-class_avatar .cell .avatar-wrap .avatar{width:10.667vmin;height:10.667vmin;border-radius:50%;object-fit:cover;vertical-align:middle;content:"viewport-units-buggyfill; width: 10.667vmin; height: 10.667vmin"}.common-table[data-v-797892fe] .cell-class_avatar .cell .avatar-wrap .icon_crown{position:absolute;width:5.333vmin;height:5.2vmin;right:-2vmin;top:-2vmin;-webkit-transform:rotate(4deg);transform:rotate(4deg);content:"viewport-units-buggyfill; width: 5.333vmin; height: 5.2vmin; right: -2vmin; top: -2vmin"}.common-table[data-v-797892fe] .user{white-space:nowrap}.common-table[data-v-797892fe] .user-info .user_name{position:relative;display:inline-block;color:#333;white-space:normal;font-weight:700}.common-table[data-v-797892fe] .user-info .user_name .icon{position:absolute;width:2.667vmin;height:2.667vmin;right:-3.2vmin;top:1.333vmin;content:"viewport-units-buggyfill; width: 2.667vmin; height: 2.667vmin; right: -3.2vmin; top: 1.333vmin"}.common-table[data-v-797892fe] .user .tags{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center}.common-table[data-v-797892fe] .user .tags span{padding:0 .8vmin;line-height:3.467vmin;display:inline-block;text-align:center;font-size:2.667vmin;content:"viewport-units-buggyfill; padding: 0 0.8vmin; line-height: 3.467vmin; font-size: 2.667vmin"}.common-table[data-v-797892fe] .user .tags .level{background-color:rgba(241,110,159,.15);color:#f16e9f}.common-table[data-v-797892fe] .user .tags .status{background-color:rgba(110,116,241,.15);color:#8288f5;margin-left:.4vmin;content:"viewport-units-buggyfill; margin-left: 0.4vmin"}.common-table[data-v-797892fe] .user .tags .self{background-color:rgba(255,107,40,.15);color:#ff783c;margin-left:.4vmin;content:"viewport-units-buggyfill; margin-left: 0.4vmin"}.common-table[data-v-797892fe] .user .no-self{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center}.common-table[data-v-797892fe] .user .no-self span{line-height:2.667vmin;display:inline-block;text-align:center;font-size:2.667vmin;content:"viewport-units-buggyfill; line-height: 2.667vmin; font-size: 2.667vmin"}.common-table[data-v-797892fe] .user .no-self .level,.common-table[data-v-797892fe] .user .no-self .status{color:#898989;background-color:#fff}.common-table[data-v-797892fe] .user .no-self .line{width:1px;height:2.4vmin;background:#b1b6c0;margin:0 .933vmin 0 1.333vmin;content:"viewport-units-buggyfill; height: 2.4vmin; margin: 0 0.933vmin 0 1.333vmin"}.common-table[data-v-797892fe] .el-table .descending .sort-caret.descending{border-top-color:#f16eae}.common-table[data-v-797892fe] .el-table .ascending .sort-caret.ascending{border-bottom-color:#f16eae}.common-table[data-v-797892fe] .el-table .cell{padding:0}.common-table[data-v-797892fe] .cell-class_estimateProductionAmt .cell{padding:1.6vmin 0;content:"viewport-units-buggyfill; padding: 1.6vmin 0"}.common-table[data-v-797892fe] .el-table th.el-table__cell>.cell{padding:0;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;white-space:pre-wrap}',""]),t.exports=e},120:function(t,e,a){t.exports=a.p+"img/search_back.40a06b97.png"},121:function(t,e,a){t.exports=a.p+"img/crown.25c5a039.png"},122:function(t,e,a){t.exports=a.p+"img/icon_input_search.8351fb55.png"},123:function(t,e,a){t.exports=a.p+"img/nodata.ab62307b.png"},126:function(t,e,a){"use strict";var i=a(3),n=a(1);const o=[{name:"设为关注",prop:"follow"},{name:"个人详情",prop:"profile"},{name:"新人行动",prop:"nbcAction"},{name:"添加笔记",prop:"addNote"},{name:"邀请设置收入目标",prop:"setTarget"},{name:"查看目标评估",prop:"assess"},{name:"拨打电话",prop:"call"}];var s={data:()=>({show:!1,actions:[],safeareainsetBottom:!0,lockScroll:!0}),props:{pageName:{type:String,default:"UnitDetailsPage"},profileClickEventName:{type:String,default:"UnitDetailsClick"},focusEventName:{type:String,default:"UnitDetailsSetFocusClick"},unfocusEventName:{type:String,default:"UnitDetailsUnfocusClick"},setTargetEventName:{type:String,default:"UnitDetailsSetIncomeTargetClick"},callEventName:{type:String,default:"UnitDetailsPhoneCallClick"},cancelEventName:{type:String,default:"UnitDetailsCancelClick"},evaluationEventName:{type:String,default:"OffspringDetailsHeadPortraitTargetEvaluationClick"},accountType:{type:String,default:""},isFullScreen:{type:Boolean,default:!1},selectInfo:{type:String,default:""},info:{type:Object,default:()=>({})},targetContactId:null},methods:{onSelect(t){console.log(t.prop);let e="UnitDetailsClick";switch(t.prop){case"follow":e=this.info.isFocus?this.unfocusEventName:this.focusEventName;break;case"profile":e=this.profileClickEventName;break;case"setTarget":e=this.setTargetEventName;break;case"call":e=this.callEventName;break;case"assess":e=this.evaluationEventName;break;case"nbcAction":e="nbcAction",this.toActionPlan();break;case"addNote":e="addNote",this.goAddNote()}console.log(this.pageName,e),this.$track({context:this.pageName,behavior:e,item_type:this.pageName,item_id:e}),this.$emit("onSelect",t)},toActionPlan(){let t=window.location.origin+"/nbcActionPlan";const e={opaque:!1,targetContactId:this.info.contactId};this.$go(t,e)},async goAddNote(){const{data:t}=await this.$request.get(`${this.$ctx.baseApi}/notes/check?followContactId=${this.info.contactId}&contactId=${this.targetContactId}`);let e=window.location.origin+"/note",a={opaque:!1,targetContactId:this.info.contactId,name:this.info.name,levelCode:this.info.careerLevelCode,followed:this.targetContactId};t.hasNote||(e=window.location.origin+"/addNote",a={targetContactId:this.info.contactId,name:this.info.name,opaque:!1,levelCode:this.info.careerLevelCode,from:"addNote_none",followed:this.targetContactId}),console.log("params",a),this.$go(e,a)},onCancel(){this.$track({context:this.pageName,behavior:this.cancelEventName,item_type:this.pageName,item_id:this.cancelEventName})},async showActions(){if(console.log(this.$route.path),this.isFullScreen)return void this.$toast("请返回竖屏下操作～");let t=this.$ctx.baseApi;const{data:{isNew:e}}=await this.$request.get(`${t}/goldenweek/newconsultant?contactId=${this.info.contactId}`);let a=Object(n.d)(o);this.info.isFocus?a[0].name="移除关注":a[0].name="设为关注",this.info.setTargetIncomeAmt?a[4].name="邀请修改收入目标":a[4].name="邀请设置收入目标","50"===this.info.careerLevelCode&&a.forEach((t,e,a)=>{"follow"===t.prop&&a.splice(e,1)}),"note"==this.selectInfo&&(a.forEach((t,e,a)=>{"follow"!==t.prop&&"setTarget"!==t.prop&&"assess"!==t.prop||a.splice(e,1)}),a.splice(1,0,{name:"查看笔记",prop:"goNote"})),this.info.contactId.toString()===this.targetContactId&&a.forEach((t,e,a)=>{"follow"!==t.prop&&"setTarget"!==t.prop&&"call"!==t.prop||a.splice(e,1)}),"operation"!==this.accountType||this.$route.path.includes("operation")||(a.forEach((t,e,a)=>{"follow"!==t.prop&&"setTarget"!==t.prop&&"nbcAction"!==t.prop||a.splice(e,1)}),Number(this.info.careerLevelCode)<50&&a.forEach((t,e,a)=>{"call"===t.prop&&a.splice(e,1)})),"operation"!==this.accountType&&a.forEach((t,e,a)=>{"assess"===t.prop&&a.splice(e,1)}),e||a.forEach((t,e,a)=>{"nbcAction"===t.prop&&a.splice(e,1)}),this.actions=a,this.show=!0}},components:{"van-action-sheet":i.ActionSheet}},r=a(10);var c=Object(r.a)(s,(function(){var t=this,e=t.$createElement;return(t._self._c||e)("van-action-sheet",{attrs:{actions:t.actions,"cancel-text":"取消","safe-area-inset-bottom":t.safeareainsetBottom,"lock-scroll":t.lockScroll},on:{select:t.onSelect,cancel:t.onCancel},model:{value:t.show,callback:function(e){t.show=e},expression:"show"}})}),[],!1,(function(t){}),"533543d6","774680dc");e.a=c.exports},134:function(t,e,a){"use strict";e.a={mounted(){let t=document.querySelector(".search-bar"),e=document.querySelector(".el-table__header-wrapper"),a=document.querySelector(".el-table__body-wrapper");window.addEventListener("scroll",i=>{let n=document.querySelector(".el-table__fixed-header-wrapper");(document.documentElement.scrollTop||document.body.scrollTop)>=t.clientHeight?(n.style.cssText="position: fixed;top: 0;width: 130px;z-index: 4;overflow: hidden;",e.style.cssText="position: fixed;top: 0;z-index: 4;",a.style.cssText=`padding-top: ${e.clientHeight}px`):(n.style.cssText="position: absolute;top: 0",e.style.cssText="position: unset;",a.style.cssText="padding-top: 0;")})}}},157:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAeCAYAAABNChwpAAAAAXNSR0IArs4c6QAAA3ZJREFUSA21V01IVFEUvufOqKMzDy1CyRCCoFUtArMWhhAGtYgIDIogKOc5M5r9I1IuZpMF/aj4O46mGQYR1iJrUYGLCMFatCgKpFoElYESzhvxZ2ZO50684TndN85fb/PuPd93v/vNeffceweY4UHP6DqNBVuR4RHGQOPA2uzFaid4IWKgZbUJutpC/Z2yEIZeMsSteky8AdiAo6euDgDQGM9WmwuhhfN3N4UiKxPxkwsMkTm1hv7Lov0/nqiB8OLSMIlvMZ0AmTd4erDcFM8A4CRciojViTQoC9ZIKHQ9ESddjAOGypIbDHsD7pHi5LjJszi35M4lQ6fKgBwIOZLhpsLheevZN1rpoTUHAbyx9Z76siYvRQIH78lFKrbXicZRCX7PteKxRJx0sWgVUAbGTQUAgrQZVNs6XZ9NORkAfw3k4igwWJbp0E41qfSoH2VYNmJRA/Z21w/a5u7LBKlEd6LXVyDDshGLGhBCwPgt+hSyPb9Q+8WasjGZTCNmQOlzvieCT0ZiyK7M1/sqpViGwZgBoeOwWVooFbPxmmInBIQH2ll/STyWaX+VAWhzznHgF2SitBZKI0uRcWwaVGR4urFVBoSIo0cdobK7ZyJYrgXCT9A7ZDPBUw7/Y0AoKHabh8rvk0yNMlEVmFl+nC0TUgNw80SQWaCGMvFbZoIW5X5tZvkZXhqxS/EUgrEbkWzMvMe/BxCf00FklvJJnscPOzrUGdn4gHtgG0J4N21y044S9ZXsapfQgBCdb/AfgjCOkQmLbBJxTli4paagu3bSiGue/laqnmZxioo48T4wwEalxzVh5K1pQJC1+v7j9O2HRTkaB+ttEllBgA6rLa89vzAyq/1caaeJXTquv6MbHfJrSp/aEovpjbXeQU//gTBjD+mSmPC7U7rDZtnS5yCOT+mrc4t+UhnQBy40DlSEV8JP6dzYoMfSfZOJGjIxJq0CM9GCTueU1coryPeUGSeF+FHBTcmAGJDfpX5VdmAlrarbop/uQ1nUxNiUPkH8ZFqDf18kgl2y/xPxXGNfLEZuse6yd9W+TTkDRiFHt/pCKSnaTtlopp8S/UVG3KxNR/9FMbnAM8qAcQI8N1QUWFx2k+AZSu9GI2Zs02HX5OhVb+ixrBnQBdHnywm+gyoEPEjXm0pksJmwHGA4zTi/Ste7R9SPPX8Ax+EUaawvzqcAAAAASUVORK5CYII="},193:function(t,e,a){var i=a(275);i.__esModule&&(i=i.default),"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var n=a(57).default;t.exports.__inject__=function(t){n("54ff55bb",i,!0,t)}},274:function(t,e,a){"use strict";a.r(e);var i=a(193);for(var n in i)"default"!==n&&function(t){a.d(e,t,(function(){return i[t]}))}(n)},275:function(t,e,a){(e=a(56)(!1)).push([t.i,'.search-wrap .search-bar[data-v-2a69ddb8]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;width:100%}.search-wrap .search-bar .back_btn[data-v-2a69ddb8]{width:2.667vmin;height:4.8vmin;margin-left:5.6vmin;content:"viewport-units-buggyfill; width: 2.667vmin; height: 4.8vmin; margin-left: 5.6vmin"}.search-wrap .search-bar .van-search__content[data-v-2a69ddb8]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;height:9.333vmin;width:75.733vmin;background-color:#f5f5f5;border-radius:4.667vmin;content:"viewport-units-buggyfill; height: 9.333vmin; width: 75.733vmin; border-radius: 4.667vmin"}.search-wrap .search-bar .van-search__content[data-v-2a69ddb8] .van-field__control{font-size:4vmin;content:"viewport-units-buggyfill; font-size: 4vmin"}.search-wrap .search-bar .search-bar__btn[data-v-2a69ddb8]{width:15.47vw;text-align:center;content:"viewport-units-buggyfill; width: 15.47vw"}.search-wrap .is_active[data-v-2a69ddb8]{color:#fe88a0!important}.search-wrap .no_data[data-v-2a69ddb8]{padding:10vw;text-align:center;color:#909399;content:"viewport-units-buggyfill; padding: 10vw"}.search-wrap .no_data .table-empty__bg[data-v-2a69ddb8]{width:53vw;height:32vw;background-repeat:round;background-size:cover;content:"viewport-units-buggyfill; width: 53vw; height: 32vw"}.search-wrap .assess-performance[data-v-2a69ddb8]{position:relative;display:inline-block}.search-wrap .assess-performance-btn[data-v-2a69ddb8]{color:#f99e79}.search-wrap .assess-performance-tip[data-v-2a69ddb8]{position:absolute;width:3.2vmin;height:3.2vmin;right:-1.333vmin;top:0;content:"viewport-units-buggyfill; width: 3.2vmin; height: 3.2vmin; right: -1.333vmin"}',""]),t.exports=e},427:function(t,e,a){"use strict";a.r(e);var i=a(3),n=a(1),o=a(116),s=a(134),r=a(126),c={data:()=>({isFullScreen:!1,isIos:Object(n.l)(),loading:!0,finished:!1,tableData:{header:[{label:"当月绩效",minWidth:"90px",sortable:"custom",prop:"productionAmtCurrentMonth",formatter:t=>Object(n.f)(t.productionAmtCurrentMonth,2)}],data:[]},filterConfig:[{prop:"dirTags",label:"分类",options:[]},{prop:"activityStatuses",label:"状态",options:[]},{prop:"careerLevels",label:"职级",options:[]},{prop:"incomeTargetStatusIds",label:"收入目标",multiple:!1,options:[{name:"已设置",value:1},{name:"未设置",value:0}]}],filter:{pageSize:50,pageNo:1,businessType:"AREA_ONE",sortEnum:"INCOME_TARGET",orderEnum:"DESC"},currentData:{},total:1,monthKey:"",isNoData:!1,keyword:"",accountType:"",pageName:"OffspringDetailsPage",sheetType:"",showDirectorActions:!1,directorActions:[{name:"个人详情",prop:"profile"},{name:"拨打电话",prop:"call"}]}),mixins:[s.a],components:{commonTable:o.a,List:i.List,"van-search":i.Search,"van-button":i.Button,"van-icon":i.Icon,clickAvatarActionSheet:r.a,"van-action-sheet":i.ActionSheet},created(){const{monthKey:t,businessType:e,targetContactId:a,accountType:i,levelCode:o}=this.$route.query;this.monthKey=t,this.filter.businessType=e,this.targetContactId=a,this.accountType=i,this.levelCode=o,console.log(t);let s=new Date(t.substr(0,4),t.substr(4,6));s.setMonth(s.getMonth()-1,1);for(let t=1;t<=12;t++){s.setMonth(s.getMonth()-1);let e=`${s.getFullYear()}/${this.addZero(s.getMonth()+1)}`;this.tableData.header.push({label:""+e,minWidth:"90px",sortable:"custom",prop:"productionAmtM"+t,formatter:e=>Object(n.f)(e.productionAmtHistoryMonth["productionAmtM"+t],2)})}},methods:{addZero:t=>t<10?"0"+t:t,back(){Object(n.b)()},onCancel(){this.$track({context:this.pageName,behavior:"OffspringDetailsSearchCancelClick",item_type:this.pageName,item_id:"OffspringDetailsSearchCancelClick"}),Object(n.b)()},onSearch(t){console.log(t),this.$track({context:this.pageName,behavior:"OffspringDetailsSearchIconClick",item_type:this.pageName,item_id:"OffspringDetailsSearchIconClick",attributes:{search_content:t}}),this.filter.keywords=t,this.filter.pageNo=1,this.tableData.data=[],this.loadData()},async loadData(){let t=document.documentElement.scrollTop||document.body.scrollTop;this.loading=!0;const{pageNo:e,pageSize:a,keywords:i,businessType:n,sortEnum:o,orderEnum:s}=this.filter,r={pageNo:e,pageSize:a,keywords:i,businessType:n,sortEnum:o,orderEnum:s};let c=this.$ctx.baseApi;const{data:l}=await this.$request.get(c+"/reports/area",{params:r});this.loading=!1,l.hasNextPage?this.finished=!1:this.finished=!0;const d=new Map;let p=this.tableData.data.concat(l.members);this.tableData.data=p.filter(t=>!d.has(t.contactId)&&d.set(t.contactId,1)),window.scrollTo(0,t),this.tableData.data&&this.tableData.data.length?this.isNoData=!1:(this.isNoData=!0,this.keyword=this.filter.keywords),this.filter.pageNo=this.filter.pageNo+1},async onRefresh(){this.finished=!1,this.filter.pageNo=1,this.tableData.data=[],this.loadData()},async setTargetIncome(t){"operation"!==this.accountType?this.targetContactId.toString()===t.contactId.toString()?(this.$track({context:this.pageName,behavior:"OffspringSetTargetClick",item_type:this.pageName,item_id:"OffspringSetTargetClick"}),this.currentData=t,this.$refs.setTarget.setTargetIncome()):(this.$track({context:this.pageName,behavior:"OffspringRemindToSetClick",item_type:this.pageName,item_id:"OffspringRemindToSetClick"}),i.Dialog.confirm({message:"是否邀请设置收入目标"}).then(()=>{this.share()}).catch(()=>{})):this.$toast("抱歉，暂时不支持对她进行操作～")},handleClickAvatar(t){this.currentData=t,this.sheetType="",this.$nextTick(()=>{this.$refs.clickAvatarActionSheet.showActions()})},handleClickName(t){this.showDirectorActions=!0,this.currentData=t,this.sheetType="director"},async share(){let t=this.$ctx.baseApi;const e=await this.$request.post(t+"/invite/link");console.log(e);const a={kind:"media",title:"写下你的收入愿望，我们一起实现她",description:"愿望无论大小，说不定就实现了呢？",thumbnail:"https://dev-community-s3.marykay.com.cn/DEV/MyBizIntouch_Content_Cms/LibraryResource/20210917102605_661.png",mediatype:"webpage",scene:"WXSceneSession",url:`${this.$ctx.baseShareUrl}?linkKey=${e.data.linkKey}`};this.$jsBridge.shareToWechat(a)},async onSelect(t){let e=this.$ctx.baseApi;switch(t.prop){case"follow":const{data:t}=await this.$request.post(e+"/focus",{focusContactId:this.currentData.contactId.toString()});this.currentData.isFocus=!this.currentData.isFocus,console.log(this.currentData.isFocus);break;case"profile":let a=window.location.origin+"/profile";const n={opaque:!1,targetContactId:"director"==this.sheetType?this.currentData.directorContactId:this.currentData.contactId,levelCode:"director"==this.sheetType?this.currentData.directorCareerLevelCode:this.currentData.careerLevelCode,followed:this.$route.query.targetContactId};this.$go(a,n);break;case"setTarget":let{setTargetIncomeAmt:o}=this.currentData,s=o?"是否邀请修改收入目标":"是否邀请设置收入目标";i.Dialog.confirm({message:s}).then(()=>{this.share()}).catch(()=>{});break;case"assess":let r="team";Number(this.currentData.careerLevelCode)>=60&&(r="unit");let c=`${window.location.origin}/${r}`;const l={opaque:!1,isSelf:!1,targetContactId:this.currentData.contactId,levelCode:this.currentData.careerLevelCode,monthKey:this.monthKey,navTitle:"收入目标评估"};this.$go(c,l);break;case"call":window.location.href="director"==this.sheetType?"tel:"+this.currentData.directorMobile:"tel:"+this.currentData.mobile}this.showDirectorActions=!1,this.$refs.clickAvatarActionSheet.show=!1},sortMap:t=>({incomeTarget:"INCOME_TARGET",productionAmtCurrentMonth:"PRODUCTION_AMT_CURRENT_MONTH",offspringLineNumber:"LINE_NUMBER",productionAmtM1:"PRODUCTION_AMT_M1",productionAmtM2:"PRODUCTION_AMT_M2",productionAmtM3:"PRODUCTION_AMT_M3",productionAmtM4:"PRODUCTION_AMT_M4",productionAmtM5:"PRODUCTION_AMT_M5",productionAmtM6:"PRODUCTION_AMT_M6",productionAmtM7:"PRODUCTION_AMT_M7",productionAmtM8:"PRODUCTION_AMT_M8",productionAmtM9:"PRODUCTION_AMT_M9",productionAmtM10:"PRODUCTION_AMT_M10",productionAmtM11:"PRODUCTION_AMT_M11",productionAmtM12:"PRODUCTION_AMT_M12"}[t]),sortChange({column:t,prop:e,order:a}){a?("descending"===a?a="desc":"ascending"===a&&(a="asc"),this.filter.sortEnum=this.sortMap(e),this.filter.orderEnum=a.toLocaleUpperCase()):(this.filter.sortEnum=null,this.filter.orderEnum=null),this.tableData.data=[],this.filter.pageNo=1,this.loadData()},setClassName:({row:t,column:e})=>"name"===e.property?"cell-class_name":"avatar"===e.property?"cell-class_avatar":"estimateProductionAmt"===e.property?"cell-class_estimateProductionAmt":void 0}},l=a(10);var d=Object(l.a)(c,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"search-wrap"},[t._ssrNode('<div class="search-bar" data-v-2a69ddb8>',"</div>",[t._ssrNode("<img"+t._ssrAttr("src",a(120))+' alt class="back_btn" data-v-2a69ddb8> '),i("van-search",{staticClass:"table-search",attrs:{"show-action":"",placeholder:"请输入姓名/手机号搜索"},on:{search:t.onSearch,cancel:t.onCancel},scopedSlots:t._u([{key:"left-icon",fn:function(){return[i("img",{staticClass:"icon-input-search",attrs:{src:a(122),alt:""}})]},proxy:!0}]),model:{value:t.filter.keywords,callback:function(e){t.$set(t.filter,"keywords","string"==typeof e?e.trim():e)},expression:"filter.keywords"}})],2),t._ssrNode(" "),t._ssrNode('<div class="search-result"'+t._ssrStyle(null,null,{display:t.tableData.data.length?"":"none"})+" data-v-2a69ddb8>","</div>",[i("List",{attrs:{finished:t.finished,"finished-text":t.tableData.data&&t.tableData.data.length?"没有更多了":""},on:{load:t.loadData},model:{value:t.loading,callback:function(e){t.loading=e},expression:"loading"}},[i("common-table",{ref:"gemPointTable",attrs:{id:"table-content",border:!1,tableData:t.tableData,isFullScreen:t.isFullScreen,setClassName:t.setClassName},on:{sortChange:t.sortChange}},[i("el-table-column",{attrs:{fixed:"left",width:"60px",label:"头像",prop:"avatar",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.row;return[i("div",{staticClass:"avatar-wrap"},[i("img",{staticClass:"avatar",attrs:{src:"https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/"+n.contactId+"/avatar?size=60",alt:""},on:{click:function(e){return t.handleClickAvatar(n)}}}),t._v(" "),i("img",{directives:[{name:"show",rawName:"v-show",value:n.incomeTarget,expression:"row.incomeTarget"}],staticClass:"icon_crown",attrs:{src:a(121),alt:""}})])]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"姓名",fixed:"left",width:"70px",align:"center","header-align":"center"},scopedSlots:t._u([{key:"default",fn:function(e){var a=e.row;return[i("div",{staticClass:"user"},[i("div",{staticClass:"user-info"},[i("div",{staticClass:"user_name"},[i("span",{staticClass:"climp"},[t._v(t._s(a.name))])])]),t._v(" "),t.targetContactId===a.contactId.toString()?i("div",{staticClass:"tags"},[i("span",{staticClass:"level"},[t._v(t._s(a.careerLevelCode))]),t._v(" "),i("span",{staticClass:"status"},[t._v(t._s(a.activityStatusCode))]),t._v(" "),i("span",{staticClass:"self"},[t._v("本人")])]):i("div",{staticClass:"no-self"},[i("span",{staticClass:"level"},[t._v(t._s(a.careerLevelCode))]),t._v(" "),i("span",{staticClass:"line"}),t._v(" "),i("span",{staticClass:"status"},[t._v(t._s(a.activityStatusCode))])])])]}}])}),t._v(" "),"AREA_ONE_TO_THREE"===t.filter.businessType?i("el-table-column",{attrs:{slot:"between",label:"管理类别",minWidth:"90px",sortable:"custom",align:"center","header-align":"center"},slot:"between",scopedSlots:t._u([{key:"default",fn:function(e){var a=e.row;return[i("span",[t._v(t._s(a.offspringLineNumber))])]}}],null,!1,3461816887)}):t._e(),t._v(" "),i("el-table-column",{attrs:{slot:"between",label:"收入目标",minWidth:"90px",align:"center",sortable:"custom",prop:"incomeTarget","header-align":"center"},slot:"between",scopedSlots:t._u([{key:"default",fn:function(e){var a=e.row;return[i("div",{staticClass:"assess-performance"},[a.incomeTarget?i("span",[t._v(t._s(t._f("formatMoney")(a.incomeTarget)))]):i("span",{staticClass:"assess-performance-btn",on:{click:function(e){return t.setTargetIncome(a)}}},[t._v("提醒设置")])])]}}])}),t._v(" "),i("el-table-column",{attrs:{width:"70px",align:"center","header-align":"center","scoped-slot":""},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.row;return[n.directorContactId?i("div",{staticClass:"user",on:{click:function(e){return t.handleClickName(n)}}},[i("div",{staticClass:"user-info"},[i("div",{staticClass:"user_name"},[i("span",{staticClass:"climp"},[t._v(t._s(n.directorName))]),t._v(" "),i("img",{staticClass:"icon",attrs:{src:a(157)}})])]),t._v(" "),t.targetContactId===n.directorContactId.toString()?i("div",{staticClass:"tags"},[i("span",{staticClass:"level"},[t._v(t._s(n.directorCareerLevelCode))]),t._v(" "),i("span",{staticClass:"status"},[t._v(t._s(n.directorActivityStatusCode))]),t._v(" "),i("span",{staticClass:"self"},[t._v("本人")])]):i("div",{staticClass:"no-self"},[i("span",{staticClass:"level"},[t._v(t._s(n.directorCareerLevelCode))]),t._v(" "),i("span",{staticClass:"line"}),t._v(" "),i("span",{staticClass:"status"},[t._v(t._s(n.directorActivityStatusCode))])])]):i("div",[t._v("--")])]}}])},[i("template",{slot:"header"},[i("div",[i("span",[t._v("资深")]),i("br"),i("span",[t._v("经销商")])])])],2)],1)],1)],1),t._ssrNode(" "+(t.isNoData?'<div class="no_data" data-v-2a69ddb8><div data-v-2a69ddb8><img'+t._ssrAttr("src",a(123))+' alt class="table-empty__bg" data-v-2a69ddb8></div>\n    未查询到<span class="is_active" data-v-2a69ddb8>'+t._ssrEscape("“"+t._s(t.keyword)+"”")+"</span>的数据\n  </div>":"\x3c!----\x3e")+" "),i("click-avatar-action-sheet",{ref:"clickAvatarActionSheet",attrs:{pageName:t.pageName,profileClickEventName:"OffspringDetailsClick",focusEventName:"OffspringDetailsSetFocusClick",unfocusEventName:"OffspringDetailsUnfocusClick",setTargetEventName:"OffspringSetIncomeTargetClick",callEventName:"OffspringPhoneCallClick",cancelEventName:"OffspringDetailsCancelClick",info:t.currentData,isFullScreen:t.isFullScreen,accountType:t.accountType,targetContactId:t.targetContactId},on:{onSelect:t.onSelect}}),t._ssrNode(" "),i("van-action-sheet",{attrs:{actions:t.directorActions,"cancel-text":"取消"},on:{select:t.onSelect},model:{value:t.showDirectorActions,callback:function(e){t.showDirectorActions=e},expression:"showDirectorActions"}})],2)}),[],!1,(function(t){var e=a(274);e.__inject__&&e.__inject__(t)}),"2a69ddb8","04868690");e.default=d.exports}};