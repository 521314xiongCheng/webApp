<template>
  <div
    class="listPage"
    :class="{
      isAndroid: !isIos,
    }"
  >
    <van-sticky>
      <NavBar
        left-text="返回"
        right-text="导出"
        :title="navTitle"
        :border="false"
        :safe-area-inset-top="true"
        @click-left="back"
        @click-right="report"
      >
        <template #left>
          <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
        </template>
        <template #title>
          {{ navTitle }}
          <img
            class="icon_q"
            @click="popupTime = !popupTime"
            src="../../images/icon_q.png"
            alt=""
          />
        </template>
      </NavBar>
    </van-sticky>

    <!-- table -->
    <common-table
      id="table-content"
      ref="table"
      :border="false"
      :tableData="tableData"
      v-if="showTable"
    >
    </common-table>

    <div v-if="!showTable" class="nodata">
      <img src="../../images/nodata1.png" alt="" />
      <div>暂时没有数据</div>
    </div>
    <!-- 规则 -->
    <van-popup
      v-model="popupTime"
      class="timePopup"
      position="center"
      round
      closeable
    >
      <div class="popupTime">
        <div class="msg">
          <span
            ><img
              src="../../images/mk_title_icon.png"
              alt=""
            />数据规则说明</span
          >
          <div class="box">
            <div class="title">事业</div>
            <p>1.新增顾客:首次在玫琳凯下单的RC顾客</p>
            <p>2.肌肤分析仪邀约:已经邀约完成的顾客</p>
            <p>3.三养健康邀约:已经邀约完成的顾客（不含本人和儿童测试</p>
          </div>
          <div class="box">
            <div class="title">玫粉E站</div>
            <p>1.完成课程:在玫粉E站中已经学习完成的课程次数</p>
            <p>2.正在学习课程:在玫粉E站中正在学习完成的课程数</p>
            <p>3.发帖:在玫粉社区中的发帖次数</p>
            <p>4.点赞:在玫粉E站中的点赞次数</p>
          </div>
          <div class="box">
            <div class="title">Intouch商城</div>
            <p>
              1.幸福小店素材下载:产品图片下载、销售素材海报下载、配方海报下载
            </p>
            <p>
              2.幸福小店素材转发:首页-小店物料
              幸福小店-销售物料、产品详情转发、配方转发
            </p>
          </div>
        </div>
        <div class="bottom">
          <img src="../../images/mk_bottom_icon.png" alt="" />
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { NavBar, Popup, Sticky } from "vant";
import { isIos, closeWebview, xxxxxx, createQuery } from "../../utils/index";
import commonTable from "./table.vue";

export default {
  components: {
    commonTable,
    NavBar,
    "van-popup": Popup,
    "van-sticky": Sticky,
  },
  data() {
    return {
      navTitle: "一周摘要表",
      isIos: isIos(),
      popupTime: false,
      showTable: true,
      tableData: [
        // {
        //   month_day: "20220101", //当前日期
        //   weekDay: "周一", //星期几
        //   orderRcCustomerAmt: "33310", //RC顾客订单
        //   orderBcAmt: "22220", //BC订单
        //   orderBcRcAmt: "4310", //BC的RC订单
        //   addHostessCount: "3", //女主人
        //   addCustomerCount: "3", //新增顾客
        //   shareCount: "4", //分享人数
        //   inviteSkinTestCount: "5", //肌肤邀约
        //   inviteCareHelthCount: "4", //三养邀约
        //   watchLiveShowDuration: "20", //观看直播时长
        //   watchCourseDuration: "30", //观看课程时长
        //   postArticlesCount: "3", //发帖数量
        //   likeCount: "2", //点赞数量
        //   downloadHappyShopTimes: "2", //下载幸福小店次数
        //   fowardHappyShopTimes: "2", //转发幸福小店次数
        // },
      ],
    };
  },
  async created() {
    this.contactId = this.$route.query.targetContactId;
    this.startDate = this.$route.query.startDate;
    this.endDate = this.$route.query.endDate;
    this.getData();
  },
  mounted() {},
  methods: {
    async getData() {
      let api = this.$ctx.baseApi;
      const params = {
        contactId: this.contactId,
        startDate: this.startDate,
        endDate: this.endDate,
      };
      const { data } = await this.$request.get(`${api}/weeksummary/report`, {
        params,
      });
      // console.log(data.summaryList);
      this.tableData = data.summaryList;
      if (this.tableData && this.tableData.length) {
        this.showTable = true;
      } else {
        this.showTable = false;
      }
    },
    async report() {
      let api = this.$ctx.baseApi;
      const params = {
        contactId: this.contactId,
        startDate: this.startDate,
        endDate: this.endDate,
      };
      params.ImpersonatedContactID = this.$route.query.ImpersonatedContactID;
      let accessToken = "";
      if (xxxxxx) {
        accessToken = await this.$jsBridge.getAccessToken();
      } else {
        const { data: atData } = await this.$request.get("/getAccessToken");
        accessToken = atData.access_token;
      }
      params.access_token = accessToken;
      const url = `${api}/export/weeksummary/report?${createQuery(params)}`;
      console.log("url", url, params);
      if (xxxxxx) {
        //overwrite 是否需要覆盖下载,true：覆盖原来的文件；false：直接返回已下载过的文件路径
        const data = await this.$jsBridge.downloadFile({
          url,
          overwrite: true,
        });
        if (data.result) {
          this.$jsBridge.shareLocalFile(data.filepath);
        } else {
          Toast("抱歉，导出失败，请重新导出");
          return;
        }
      } else {
        console.log(this.filterParams);
        location.href = url;
      }
    },
    back() {
      closeWebview();
    },
  },
};
</script>
<style lang="less" scoped>
.isAndroid {
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
/deep/.van-nav-bar {
  background-color: #f16eae;
  z-index: 4;
  .van-nav-bar__content {
    height: 80px;
    .van-nav-bar__left {
      .back_btn {
        width: 17px;
        height: 32px;
      }
    }
    .van-nav-bar__title {
      color: #fff;
      display: flex;
      align-items: center;
      .icon_q {
        width: 30px;
        height: 30px;
        margin-left: 10px;
      }
    }
    .van-nav-bar__text {
      color: #fff;
    }
  }
}
// 规则
.timePopup {
  background: none;
  /deep/ .van-popup__close-icon--top-right {
    top: 70px;
    right: 70px;
  }
}
.popupTime {
  padding: 50px;
  .msg {
    width: 600px;
    padding: 40px 45px 40px;
    text-align: center;
    background: url(../../images/aweeknote_bg.png) no-repeat;
    background-size: 100% 100%;
    span {
      font-size: 34px;
      font-weight: bold;
      color: #541b5a;
      text-align: center;
      position: relative;
      img {
        width: 36px;
        height: 31px;
        position: absolute;
        left: 0;
        top: 0;
        transform: translate(-60%, -60%);
      }
    }
    .box {
      text-align: left;
      margin-bottom: 20px;
      margin-top: 20px;
      .title {
        font-size: 26px;
        font-weight: 700;
        color: #595959;
      }
      p {
        font-size: 24px;
        color: #595959;
      }
    }
  }
  .bottom {
    position: relative;
    height: 99px;
    img {
      width: 128px;
      height: 99px;
      position: absolute;
      right: 0;
      bottom: 60%;
      transform: translateX(50px);
    }
  }
}
</style>
