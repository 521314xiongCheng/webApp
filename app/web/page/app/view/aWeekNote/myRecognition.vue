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
        :title="navTitle"
        :border="false"
        :safe-area-inset-top="true"
        @click-left="back"
      >
        <template #left>
          <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
        </template>
      </NavBar>
    </van-sticky>

    <!-- content -->
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      :head-height="100"
      :disabled="refreshDisable"
    >
      <template #pulling>
        <div class="refresh-icon">
          <img src="../../images/refresh-icon.gif" alt="" />
        </div>
        <p class="refresh-text">下拉刷新</p>
      </template>
      <template #loosing>
        <div class="refresh-icon">
          <img src="../../images/refresh-icon.gif" alt="" />
        </div>
        <p class="refresh-text">松开刷新</p>
      </template>
      <template #loading>
        <div class="refresh-icon">
          <img src="../../images/refresh-icon.gif" alt="" />
        </div>
        <p class="refresh-text">刷新中</p>
      </template>
      <List
        :finished="finished"
        v-model="loading"
        :finished-text="listData && listData.length ? '无更多内容' : ''"
        @load="getAllData"
        v-if="showTable"
      >
        <div class="content">
          <div
            class="item"
            v-for="(item, index) in listData"
            :key="item.approvalId"
          >
            <van-swipe-cell
              :disabled="
                !isSelf && impersonatedContactId != item.approvalContactId
              "
            >
              <div class="itemBox">
                <img
                  class="contactImg"
                  :src="`https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${item.approvalContactId}/avatar?size=60`"
                  alt=""
                />
                <div class="right">
                  <div class="top">
                    <div class="name">{{ item.approvalName }}</div>
                    <div class="time">{{ item.approvalTime }}</div>
                  </div>
                  <!-- 点赞 -->
                  <div class="msg" v-if="item.approvalType == 1">
                    <img
                      src="../../images/like2_icon.png"
                      alt=""
                    />点赞了你的一周摘要
                  </div>
                  <!-- 文本评论 -->
                  <div class="msg" v-if="item.resourceType == 0">
                    {{ item.content }}
                  </div>
                  <!-- 语音评论 -->
                  <div class="msg" v-if="item.resourceType == 1">
                    <div
                      :class="{ read: item.read != 0 || !isSelf }"
                      class="audioBox"
                      @click="onAudio(item.approvalId, index, item.read)"
                    >
                      <span v-show="audioShow == item.approvalId">
                        <img
                          v-show="audioOn == 1"
                          src="../../images/audio_on01.png"
                          alt=""
                        />
                        <img
                          v-show="audioOn == 2"
                          src="../../images/audio_on02.png"
                          alt=""
                        />
                        <img
                          v-show="audioOn == 3"
                          src="../../images/audio_on03.png"
                          alt=""
                        />
                      </span>
                      <span v-show="audioShow != item.approvalId">
                        <img src="../../images/audio_on03.png" alt="" />
                      </span>
                    </div>
                    <div class="duration">
                      {{ format(durationList[item.approvalId]) }}
                      <div
                        class="circle"
                        v-show="item.read == 0 && isSelf"
                      ></div>
                    </div>
                    <audio
                      controls
                      :src="item.content"
                      :ref="item.approvalId"
                      class="audio"
                      @canplay="getDuration(item.approvalId)"
                      @pause="audioEnd"
                    ></audio>
                  </div>
                </div>
              </div>
              <template #right>
                <van-button
                  square
                  text="删除"
                  type="danger"
                  class="delete-button"
                  @click="beforeClose(item)"
                />
              </template>
            </van-swipe-cell>
          </div>
        </div>
      </List>
      <div v-if="!showTable" class="nodata">
        <img src="../../images/nodata1.png" alt="" />
        <div>暂时没有数据</div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import {
  NavBar,
  Sticky,
  List,
  PullRefresh,
  Toast,
  Dialog,
  SwipeCell,
  Button,
} from "vant";
import { isIos, closeWebview } from "../../utils/index";

export default {
  components: {
    NavBar,
    "van-sticky": Sticky,
    List,
    "van-pull-refresh": PullRefresh,
    "van-swipe-cell": SwipeCell,
    "van-button": Button,
  },
  data() {
    return {
      navTitle: "我的认可",
      isIos: isIos(),
      popupTime: false,
      contactId: "",
      impersonatedContactId: "",
      isSelf: true,
      hasNextPage: false,
      refreshing: false,
      finished: false,
      showTable: true,
      loading: true,
      refreshDisable: false,
      pageNo: 1,
      listData: [],
      durationList: {},
      loop: 0,
      audioShow: "",
      audioOn: 1,
      timerInt: null,
    };
  },
  async created() {
    this.contactId = this.$route.query.targetContactId;
    this.impersonatedContactId =
      this.$route.query.ImpersonatedContactID ||
      this.$route.query.targetContactId;
    if (this.$route.query.isSelf !== undefined) {
      this.isSelf = JSON.parse(this.$route.query.isSelf);
    }
    if (this.$route.query.apiType == "unread") {
      this.getUnreadData();
    } else if (this.$route.query.apiType == "all") {
      this.getAllData();
    }
  },
  async mounted() {},
  methods: {
    // ios手动加载audio
    audioLoad() {
      setTimeout(() => {
        const audios = document.querySelectorAll(".audio");
        console.log(audios);
        for (var i = 0; i < audios.length; i++) {
          audios[i].load();
        }
      }, 0);
    },
    // 全部
    async getAllData() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      this.loading = true;
      let api = this.$ctx.baseApi;
      let params = {
        contactId: this.contactId,
        pageNo: this.pageNo,
        pageSize: 20,
      };
      const { data } = await this.$request.get(
        `${api}/weeksummary/approval/list`,
        {
          params,
        }
      );
      console.log(data);
      this.listData = this.listData.concat(data.pageList || []);
      this.pageNo = data.pageNo + 1;
      this.hasNextPage = data.hasNextPage;
      this.finished = !data.hasNextPage;
      this.refreshing = false;
      this.loading = false;
      if (this.listData && this.listData.length) {
        this.showTable = true;
      } else {
        this.showTable = false;
      }
      this.audioLoad();
      // table数据更新后会直接滚动到页面底部导致一直触发load事件
      window.scrollTo(0, scrollTop);
    },
    // 未读
    async getUnreadData() {
      let api = this.$ctx.baseApi;
      const { data } = await this.$request.get(
        `${api}/weeksummary/approval/unread/list?contactId=${this.contactId}`
      );
      console.log(data);
      this.listData = data;
      this.loading = false;
      this.finished = true;
      this.refreshDisable = true;
      if (this.listData && this.listData.length) {
        this.showTable = true;
      } else {
        this.showTable = false;
      }
      this.read();
      this.audioLoad();
    },
    async onRefresh() {
      this.finished = false;
      this.refreshing = true;
      this.pageNo = 1;
      this.listData = [];
      this.getAllData();
    },
    async onAudio(id, index, read) {
      console.log(id, index, read);
      const audios = this.$refs;
      // console.log(audios);
      const audio = audios[id][0];
      // 暂停播放
      if (!audio.paused) {
        audio.pause();
        return false;
      }
      // 暂停其他
      for (let item in audios) {
        audios[item][0].pause();
      }
      // 播放
      setTimeout(() => {
        audio.play();
        this.audioShow = id;
        this.timerInt = setInterval(() => {
          this.audioOn > 2 ? (this.audioOn = 1) : this.audioOn++;
        }, 500);
      }, 0);
      if (read == 0 && this.isSelf) {
        this.listData[index].read = 1;
        let api = this.$ctx.baseApi;
        const { data } = await this.$request.put(
          `${api}/weeksummary/approval?contactId=${this.contactId}`,
          [id]
        );
        console.log(data);
      }
    },
    audioEnd() {
      this.audioShow = "";
      clearInterval(this.timerInt);
      this.audioOn = 1;
    },
    getDuration(id) {
      const duration = this.$refs[id][0].duration;
      // console.log(id, duration);
      this.durationList[id] = duration;
      this.$set(this.durationList, this.durationList[id], duration);
    },
    format(data) {
      return data ? parseInt(data) + "″" : 0 + "″";
    },
    async read() {
      let arr = [];
      this.listData.forEach((item) => {
        if (item.resourceType != 1) {
          arr.push(item.approvalId);
        }
      });
      console.log("arr", arr);
      if (arr.length) {
        let api = this.$ctx.baseApi;
        const { data } = await this.$request.put(
          `${api}/weeksummary/approval?contactId=${this.contactId}`,
          arr
        );
        console.log(data);
      }
    },
    // 删除
    async deleteData(item) {
      let baseApi = this.$ctx.baseApi;
      let params = {
        approvalContactId: item.approvalContactId,
      };
      if (item.approvalType == 0) {
        console.log("评论");
        const { data } = await this.$request.delete(
          `${baseApi}/weeksummary/approval/${item.approvalId}`,
          { params }
        );
        if (data) {
          Toast.success("删除成功！");
          this.listData.forEach((e, index) => {
            if (e.approvalId == item.approvalId) {
              this.listData.splice(index, 1);
            }
          });
          // 删除完返回
          if (!this.listData.length) {
            this.back();
          }
        } else {
          Toast.fail("删除失败,请稍后再试！");
        }
      } else {
        console.log("点赞");
        params.summaryDate = item.approvalTime;
        params.contactId = this.contactId;
        const { data } = await this.$request.delete(
          `${baseApi}/weeksummary/approval/like`,
          { params }
        );
        if (data) {
          Toast.success("删除成功！");
          this.listData.forEach((e, index) => {
            if (e.approvalId == item.approvalId) {
              this.listData.splice(index, 1);
            }
          });
          // 删除完返回
          if (!this.listData.length) {
            this.back();
          }
        } else {
          Toast.fail("删除失败,请稍后再试！");
        }
      }
    },
    // 删除弹框
    beforeClose(item) {
      Dialog.confirm({
        title: "确认要删除该条认可评论吗？",
        confirmButtonText: "确定",
      })
        .then(() => {
          this.deleteData(item);
        })
        .catch(() => {
          console.log("catch");
        });
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
// content
.content {
  .item {
    .itemBox {
      display: flex;
      padding: 30px;
      border-bottom: 2px solid #ebebeb;
    }
    .contactImg {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
    .right {
      flex-grow: 1;
      margin-left: 24px;
      padding-top: 9px;
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name {
          font-size: 30px;
          font-weight: 700;
          color: #303133;
        }
        .time {
          font-size: 24px;
          color: #909399;
        }
      }
      .msg {
        margin-top: 10px;
        width: 468px;
        font-size: 26px;
        color: #909399;
        display: flex;
        align-items: center;
        word-break: break-all;
        .audio {
          display: none;
        }
        img {
          width: 28px;
          height: auto;
          margin-right: 6px;
        }
        .audioBox {
          width: 222px;
          height: 50px;
          padding-left: 29px;
          padding-top: 10px;
          background: url(../../images/audio_bg_un.png) no-repeat;
          background-size: 100% 100%;
          margin-left: -9px;
          img {
            width: 15px;
          }
        }
        .read {
          background: url(../../images/audio_bg.png) no-repeat;
          background-size: 100% 100%;
        }
        .duration {
          position: relative;
          margin-left: 10px;
          .circle {
            width: 10px;
            height: 10px;
            background: #f16eae;
            border-radius: 50%;
            position: absolute;
            top: -15px;
          }
        }
      }
    }
  }
  .delete-button {
    height: 100%;
  }
}
</style>
