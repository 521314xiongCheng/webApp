<template>
  <div
    class="coach-home"
    :class="{ isfullscreen: isFullScreen, isAndroid: !isIos }"
  >
    <div class="coach-home-content">
      <van-sticky>
        <NavBar
          left-text="返回"
          :title="name"
          :border="false"
          :safe-area-inset-top="true"
          @click-left="back"
        >
          <template #left>
            <img
              class="back_btn"
              src="../../images/index/icon_back.png"
              alt=""
            />
          </template>
          <template #right>
            <img
              class="icon-search"
              src="../../images/index/icon_search.png"
              alt=""
              @click="goSearch()"
            />
          </template>
        </NavBar>
      </van-sticky>
      <div class="tabbar-container">
        <div class="tabbar">
          <div
            class="tabbar-box"
            v-for="(item, index) in this.tabdate"
            :key="index"
            @click="tabChange(index)"
            :class="{
              tabbaractive: tabActive == index,
              tabActiveLast: index == 2,
            }"
          >
            <div class="tabbar-box-label">{{ item.labelType }}</div>
            <div class="tabbar-box-notedate">{{ item.noteDate }}</div>
          </div>
        </div>
      </div>

      <List
        :finished="finished"
        :finished-text="finishedText"
        v-model="loading"
        @load="loadData"
        v-if="listShow"
      >
        <div class="list">
          <van-swipe-cell
            class="list-content-info"
            v-for="(item, index) in this.noteList"
            :key="index"
          >
            <template>
              <div class="list-content-m" @click.stop="goNoteinfo(item)">
                <div @click.stop="goNewNote(item, index)">
                  <span v-if="!item.isFinished">
                    <img src="../../images/un-chose.png" alt="" />
                  </span>
                  <span v-else>
                    <img src="../../images/chose.png" alt=""
                  /></span>
                </div>
                <div
                  class="list-content-m-mes"
                  :class="{ 'list-content-m-meslong': item.labelType == 1 }"
                >
                  {{ item.noteContent }}
                </div>
                <div class="list-content-m-date" v-if="item.labelType != '1'">
                  {{ item.noteDate }}
                </div>
              </div>
            </template>

            <!-- <van-cell :border="false" title="单元格" value="内容" /> -->
            <template #right>
              <van-button
                @click="goDelete(item.noteId)"
                square
                type="danger"
                text="删除"
                class="delete-button"
              />
            </template>
          </van-swipe-cell>
        </div>
      </List>
      <div class="nodate" v-if="!listShow">你尚未添加任何内容</div>
      <div class="addNote" @click="goNoteinfo()">
        <img src="../../images/addNote.png" alt="" />
      </div>
      <div class="loading" v-if="this.loadChange">
        <span>
          <img src="../../images/loading_back.gif" alt="" class="loadchange" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  NavBar,
  Popup,
  Sticky,
  List,
  SwipeCell,
  Button,
  Cell,
  Dialog,
} from "vant";

import {
  isIos,
  isIphoneX,
  closeWebview,
  xxxxxx,
  formatMoney,
  createQuery,
} from "../../utils/index";
import horizontalScreen from "../../mixin/horizontalScreen";

export default {
  mixins: [horizontalScreen],
  data() {
    return {
      isIos: isIos(),
      notecheck: false,
      finished: false,
      loading: true,
      loadChange: false,
      notechecklist: [],
      tabActive: 0,
      name: "",
      listLoading: " ",
      loadingText: " ",
      finishedText: "",
      listShow: true,
      noteList: [],
      filter: {
        pageSize: 20,
        pageNo: 1,
        labelType: 1,
        followContactId: "",
      },
      tabdate: [
        {
          noteDate: "",
          labelType: "今天",
        },
        {
          noteDate: "",
          labelType: "将来",
        },
        {
          noteDate: "",
          labelType: "过去",
        },
      ],
    };
  },

  created() {
    
    this.name = this.$route.query.name + "的教练笔记";
  },

  mounted() {
    const onFronted = () => {
      // 从搜索页返回时需要刷新数据

      this.onFronted();
    };
    this.$jsBridge.onFronted(onFronted);
    this.loadDate();
    // console.log("this.route", this.$route);
  },
  methods: {
    goNoteinfo(item) {
      let url = `${window.location.origin}/addNote`;
      var params = {
        opaque: false,
        name: this.$route.query.name,
        levelCode: this.$route.query.levelCode,
        followed: this.$route.query.followed,
      };
      if (item) {
        (params.noteId = item.noteId),
          (params.targetContactId = this.$route.query.targetContactId);
        // this.$go(url, params);
      } else {
        params.targetContactId = this.$route.query.targetContactId;
        params.fullscreen = true;
      }
      // this.$router.replace({ name: "addNote", query: params });
      this.$go(url, params);
    },
    back() {
      closeWebview();
    },
    goSearch() {
      let url = `${window.location.origin}/note_search`;
      let params = {
        targetContactId: this.$route.query.targetContactId,
        followed: this.$route.query.followed,
      };
      this.$go(url, params);
    },
    async onFronted() {
      this.filter.pageNo = 1;
      //this.filter.pageSize = this.noteList.length;
      this.noteList = [];
      this.loadDate();
    },
    async goNewNote(item, index) {
      //console.log(item, item);
      this.noteList[index].isFinished = !this.noteList[index].isFinished;
      this.loadChange = true;
      //console.log("this.noteList", this.noteList);
      let noteId = item.noteId;
      let baseApi = this.$ctx.baseApi;
      const res = await this.$request.put(
        `${baseApi}/notes/${noteId}?updateType=2&followContactId=${this.$route.query.targetContactId}&contactId=${this.$route.query.followed}`
      );
      this.noteList = [];
      this.filter.pageNo = 1;
      this.listShow = false;
      this.loading = true;
      this.loadData();
    },
    tabChange(index) {
      this.tabActive = index;
      this.filter.labelType = index + 1;
      this.filter.pageNo = 1;
      //this.filter.pageSize=20
      this.noteList = [];
      this.finishedText = "";
      this.loadData();
    },
    //列表数据
    async goDelete(noteId) {
      Dialog.confirm({
        title: "",
        message: "确认删除该条记录吗",
        className: "test",
        allowHtml: true,
      })
        .then(() => {
          this.Deletenote(noteId);
        })
        .catch(() => {
          // on cancel
        });
    },
    async Deletenote(noteId) {
      let baseApi = this.$ctx.baseApi;
      let params = {
        followContactId: this.$route.query.targetContactId,
        contactId: this.$route.query.followed,
      };
      const res = await this.$request.delete(`${baseApi}/notes/${noteId}`, {
        params,
      });
      // console.log(res);
      this.filter.pageNo = 1;
      this.noteList = this.noteList.filter((item) => {
        return item.noteId != noteId;
      });
      if (this.noteList.length > 0) {
        this.finishedText = "没有更多了";
        this.listShow = true;
      } else {
        this.finishedText = "";
        this.listShow = false;
      }
      //重新获取时间
      let data = await this.$request.get(`${baseApi}/notes/label`, {
        params,
      });
      let noteDate = data.data;
      //onsole.log("res", data.data);
      for (let i in noteDate) {
        if (noteDate[i]) {
          noteDate[i] = noteDate[i].replace(/-/g, "/");
        }
      }
      this.tabdate[1].noteDate = noteDate.futureDate;
      this.tabdate[2].noteDate = noteDate.pastDate;
    },
    async loadData() {
      //let baseApi = "https://mock.marykay.com.cn/mock/600/api/v1/notes";
      let baseApi = this.$ctx.baseApi;
      let params = this.filter;
      params.contactId = this.$route.query.followed;
      params.followContactId = this.$route.query.targetContactId;
      const { data } = await this.$request.get(`${baseApi}/notes`, {
        params,
      });

      if (!data.hasNextPage) {
        this.finished = true;
      } else {
        this.finished = false;
      }
      let list = data.notes;
      // console.log("list", list);
      this.noteList = this.noteList.concat(list);
      if (this.noteList.length > 0) {
        this.finishedText = "没有更多了";
        this.listShow = true;
      } else {
        this.finishedText = "";
        this.listShow = false;
      }
      //console.log("noteList", this.noteList);
      for (let i in this.noteList) {
        this.noteList[i].noteDate = this.noteList[i].noteDate
          .replace(/-/g, "/")
          .substring(this.noteList[i].noteDate.length - 5);
      }

      this.filter.pageNo = this.filter.pageNo + 1;
      this.loading = false;
      this.loadChange = false;
    },
    //tab日期
    async loadDate() {
      //let baseApi = "https://mock.marykay.com.cn/mock/600/api/v1/notes/label";
      let baseApi = this.$ctx.baseApi;
      let params = {
        followContactId: this.$route.query.targetContactId,
        contactId: this.$route.query.followed,
      };
      let res = await this.$request.get(`${baseApi}/notes/label`, {
        params,
      });
      let noteDate = res.data;
      // console.log("res", res.data);
      for (let i in noteDate) {
        if (noteDate[i]) {
          noteDate[i] = noteDate[i].replace(/-/g, "/");
        }
      }
      if (noteDate.futureDate && noteDate.todayDate) {
        this.tabActive = 0;
        this.filter.labelType = 1;
      } else if (noteDate.todayDate == null && noteDate.futureDate) {
        this.tabActive = 1;
        this.filter.labelType = 2;
      } else {
        this.tabActive = 0;
        this.filter.labelType = 1;
      }

      var getDate = new Date();
      var year = getDate.getFullYear();
      var month =
        getDate.getMonth() + 1 >= 10
          ? getDate.getMonth() + 1
          : "0" + (getDate.getMonth() + 1);
      var day =
        getDate.getDate() >= 10 ? getDate.getDate() : "0" + getDate.getDate();

      this.tabdate[0].noteDate = `${year}/${month}/${day}`;
      this.tabdate[1].noteDate = noteDate.futureDate;
      this.tabdate[2].noteDate = noteDate.pastDate;
      this.loadData();
    },
  },
  components: {
    NavBar,
    List,
    "van-cell": Cell,
    "van-swipe-cell": SwipeCell,
    "van-popup": Popup,
    "van-sticky": Sticky,
    "van-button": Button,
  },
};
</script>

<style lang="less" scoped>
.coach-home {
  &-content {
    // padding-top: env(safe-area-inset-top);
    // margin-top: 80px;

    position: relative;
  }
}
.tabbar-container {
  background-color: #ee4d9b;
  padding: 45px 0px 75px 0px;
  width: 100%;
}
.tabbar {
  width: 690px;
  display: flex;
  margin: 0 auto;

  text-align: center;
  justify-content: space-between;
  &-active {
    background-color: red;
  }
  &-box {
    width: 194px;
    height: 119px;
    background: #f98ac0;
    border-radius: 16px;
    //padding:15px 0px;
    box-sizing: border-box;

    // line-height: 55px;
    &-label {
      font-size: 34px;
      font-weight: bold;
      color: #ffffff;
      margin-top: 15px;
    }
    &-notedate {
      font-size: 26px;
      font-weight: 500;
      color: #ffffff;
      margin-bottom: 15px;
    }
  }
}

/deep/.van-nav-bar {
  background-color: #ee4d9b;
  z-index: 4;
  .van-nav-bar__content {
    height: 80px;
    .van-nav-bar__left {
      .back_btn {
        width: 17px;
        height: 32px;
      }
    }
  }
  .van-nav-bar__title {
    color: #fff;
  }
}
.icon-search {
  width: 48px;
  margin-right: 2px;
}
.tabbaractive {
  width: 224px !important;
  height: 128px !important;
  background: #ffffff !important;
  border-radius: 16px !important;
  color: #484848 !important;
  margin-top: -2px;
}
.tabbaractive > .tabbar-box-label {
  font-size: 40px !important;
  color: #484848 !important;
}
.tabbaractive > .tabbar-box-notedate {
  color: #484848 !important;
  font-size: 30px !important;
}
.tabbar .tabActiveLast > .tabbar-box-label {
  color: #d7d7d7 !important;
}
.tabbar .tabActiveLast > .tabbar-box-notedate {
  color: #d7d7d7 !important;
}
.list {
  width: 100%;
  margin-top: -52.5px;
  img {
    width: 46px;
    height: 46px;
    vertical-align: middle;
  }
  &-content {
    text-align: center;
    &-info {
      width: 690px;
      height: 105px;
      background: #ffffff;
      box-shadow: 0px 2px 12px 0px rgba(193, 193, 193, 0.5);
      border-radius: 16px;
      margin: 0 auto;
      display: flex;
    }
  }
}
.list-content-m {
  display: flex;
  line-height: 105px;
  padding-left: 18px;
  &-mes {
    padding-left: 20px;
    font-size: 28px;
    font-weight: 500;
    color: #484848;
    width: 75%;
    margin-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &-meslong {
    width: 85% !important;
  }
  &-date {
    font-size: 27px;
    font-weight: 500;
    color: #f16eae;
  }
}
.list > div:not(:first-child) {
  margin-top: 30px;
}
/deep/.van-swipe-cell__wrapper {
  width: 100%;
}
/deep/.van-swipe-cell__right > button {
  height: 100%;
}
.addNote {
  position: fixed;
  bottom: 36px;
  right: 20px;
}
.addNote > img {
  width: 132px;
}
.nodate {
  text-align: center;
  font-size: 30px;
  color: #969799;
  margin-top: 40px;
  font-weight: 700;
}
.loading {
  position: fixed;
  width: 100%;
  height: 100%;
  background: white;
  text-align: center;
  top: 0;
  left: 0;
  padding: 300px 0px;
}
.loading span {
  width: 140px;
  height: 140px;
  display: block;
  line-height: 140px;
  border-radius: 50%;
  background: #f7e1e5;
 // margin: 0 auto;
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translate(-50%,-50%);
}
.loading img {
  width: 86px;
  vertical-align: middle;
}
.isAndroid {
  // .unit-content {
  //   margin-top: 135px;
  // }
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
/deep/.van-nav-bar__right {
  padding: 0 20px;
}
/deep/.van-nav-bar__left {
  padding: 0 25px;
}
/deep/.van-list__loading {
  line-height: 220px;
}
/deep/.van-list__finished-text{
  line-height: 150px;
}
</style>
<style>
.van-dialog__message {
  font-size: 36px !important;
}
</style>