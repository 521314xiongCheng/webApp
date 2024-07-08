<template>
  <div class="coach-home" :class="{ isAndroid: !isIos }">
    <div class="coach-home-content">
      <van-sticky>
        <NavBar
          left-text="返回"
          title="内容"
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
          <template #right v-if="this.linkNote">
            <span @click="gopush()" :class="{ goPush: goPush }">保存</span>
          </template>
        </NavBar>
      </van-sticky>
      <div class="note">
        <p class="note-date" @click="goshowCalendar()">
          <img src="../../images/date.png" alt="" />
          {{ this.note.noteDate }}
        </p>
        <textarea
          class="note-input"
          maxlength="256"
          ref="textarea"
          :disabled="!this.linkNote"
          placeholder="请输入需要备注的内容～"
          v-model="note.noteContent"
          id="noteinput"
        ></textarea>
      </div>
      <div class="infopush" v-if="this.note.showPush">
        <div class="push-text" :class="{ pushActive: note.needPush }">
          <img src="../../images/info.png" alt="" v-if="!note.needPush" />
          <img src="../../images/choseinfo.png" alt="" v-else />
          <span>需要推送提醒吗</span>
        </div>
        <div>
          <van-switch
            :disabled="!this.linkNote"
            v-model="note.needPush"
            active-color="#F16EAE"
            inactive-color="#dcdee0"
            size="24px"
          />
        </div>
      </div>

      <div class="loading" v-if="this.loadChange">
        <img src="../../images/loading.gif" alt="" />
      </div>
    </div>

    <van-calendar
      v-model="showCalendar"
      @confirm="onConfirm"
      :min-date="minDate"
      color="#F16EAE"
    />
  </div>
</template>

<script>
import {
  isIos,
  isIphoneX,
  closeWebview,
  xxxxxx,
  formatMoney,
  createQuery,
} from "../../utils/index";
import horizontalScreen from "../../mixin/horizontalScreen";
import storage from "good-storage";
import {
  NavBar,
  Popup,
  Sticky,
  List,
  SwipeCell,
  Button,
  Cell,
  Dialog,
  Calendar,
  Switch,
} from "vant";
export default {
  mixins: [horizontalScreen],
  data() {
    return {
      isIos: isIos(),
      showCalendar: false,
      linkNote: true,
      auto: true,
      choseDate: "",
      goPush: false,
      minDate: new Date(2010, 0, 1),
      loadChange: false,
      from: "",
      note: {
        needPush: false,
        noteContent: "",
        noteDate: "",
        needPushShow: "",
        showPush: false,
      },
    };
  },
  created() {
    if (this.$route.query.linkNote) {
      this.linkNote = !this.$route.query.linkNote;
    } else {
      this.linkNote = true;
    }
  },

  mounted() {
    var getDate = new Date();
    var year = getDate.getFullYear();
    var month =
      getDate.getMonth() + 1 >= 10
        ? getDate.getMonth() + 1
        : "0" + (getDate.getMonth() + 1);
    var day =
      getDate.getDate() >= 10 ? getDate.getDate() : "0" + getDate.getDate();
    this.note.noteDate = `${year}-${month}-${day}`;
    this.choseDate = `${year}${month}${day}`;
    if (this.$route.query.noteId) {
      this.getNoteInfo();
      this.auto = false;
    } else {
      this.auto = true;
    }
    console.log("auto", this.auto);
  },
  methods: {
    goshowCalendar() {
      if (this.linkNote) {
        this.showCalendar = true;
      } else {
        this.showCalendar = false;
      }
    },
    async getNoteInfo() {
      var followed = this.$route.query.followed;
      if (!followed) {
        let userProfile = await this.$jsBridge.getUserProfile();
        userProfile =
          typeof userProfile === "string"
            ? JSON.parse(userProfile)
            : userProfile;
        console.log(userProfile);

        followed = userProfile.contact_id;
      }
      let params={
        contactId:followed
      }
      console.log("查看");
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(
        `${baseApi}/notes/${this.$route.query.noteId}`,{params}
      );
      if (!data) {
        Dialog.alert({
          message: "当前事件已被删除，请知晓。",
        }).then(() => {
          let params = {
            opaque: false,
            noteId: this.$route.query.noteId,
            targetContactId: this.$route.query.targetContactId,
            name: this.$route.query.name,
            levelCode: this.$route.query.levelCode,
            from: this.from,
            followed: followed,
          };
          let url = `${window.location.origin}/note`;
          this.$go(url, params);
        });
      }
      this.note = data;
      this.note.showPush = data.needPush;
      //将来默认开启
      if (data.labelType == 2) {
        this.note.showPush = true;
      }
      //
      console.log("data", data);
    },
    async gopush() {
      if (this.note.noteContent) {
        if (this.$route.query.noteId) {
          let baseApi = this.$ctx.baseApi;
          let noteId = this.$route.query.noteId;
          const res = await this.$request.put(
            `${baseApi}/notes/${noteId}?updateType=1&followContactId=${this.$route.query.targetContactId}&noteDate=${this.note.noteDate}&noteContent=${this.note.noteContent}&needPush=${this.note.needPush}&contactId=${this.$route.query.followed}`
          );
          if (res) {
            this.loadChange = true;
          }
        } else {
          let baseApi = this.$ctx.baseApi;
          let params = this.note;
          params.followContactId = Number(this.$route.query.targetContactId);
          console.log("params", params);
          const res = await this.$request.post(
            `${baseApi}/notes?followContactId=${this.$route.query.targetContactId}&noteDate=${this.note.noteDate}&noteContent=${this.note.noteContent}&needPush=${this.note.needPush}&contactId=${this.$route.query.followed}`,
            params
          );
          console.log("res", res);
          if (res) {
            this.loadChange = true;
          }
        }
        this.linkNote = false;
        let gourl = `${window.location.origin}/note`;
        const params2 = {
          targetContactId: this.$route.query.targetContactId,
          name: this.$route.query.name,
          levelCode: this.$route.query.levelCode,
          opaque: false,
          followed: this.$route.query.followed,
          fullscreen: true,
        };

        if (this.$route.query.from == "addNote_none") {
          this.$router.replace({ name: "note", query: params2 });
        } else {
          closeWebview();
        }
      }
    },
    back() {
      closeWebview();
    },
    formatDate(date) {
      let month =
        date.getMonth() + 1 >= 10
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1);
      let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
      var choseDate = `${date.getFullYear()}${month}${day}`;
      if (choseDate > this.choseDate) {
        this.note.showPush = true;
        this.note.needPush = true;
      } else {
        this.note.showPush = false;
        this.note.needPush = false;
      }
      return `${date.getFullYear()}-${month}-${day}`;
    },
    onConfirm(date) {
      console.log("date", date);
      this.showCalendar = false;
      this.note.noteDate = this.formatDate(date);
      console.log(" this.choseDate", this.choseDate);
    },
  },
  watch: {
    note: {
      handler(val, oldVal) {
        if (val.noteContent != "") {
          this.goPush = true;
        } else {
          this.goPush = false;
        }
      },
      deep: true, //true 深度监听
    },
  },
  components: {
    NavBar,
    List,
    "van-switch": Switch,
    "van-calendar": Calendar,
    "van-cell": Cell,
    "van-swipe-cell": SwipeCell,
    "van-popup": Popup,
    "van-sticky": Sticky,
    "van-button": Button,
  },
};
</script>

<style lang="less" scoped>
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
.coach-home {
  &-content {
    // padding-top: env(safe-area-inset-top);
    // margin-top: 80px;

    position: relative;
  }
}
.note {
  margin-top: 20px;

  &-date {
    text-align: center;
    font-size: 30px;

    font-weight: 500;
    color: #484848;
    img {
      width: 30px;
      margin-right: 10px;
    }
  }
  &-input {
    margin-top: 40px;
    width: 100%;
    border: 0px;
    padding: 0px 30px;
    font-size: 30px;
    font-weight: 400;
    color: #484848;
    height: 300px;
    line-height: 40px;
  }
}
/deep/ .van-calendar__weekdays {
  color: #f16eae;
  font-weight: 500;
}
.infopush {
  display: flex;
  justify-content: space-between;
  padding: 0px 30px;
  margin-top: 10px;
}
.push-text img {
  width: 42px;
  vertical-align: middle;
}
.push-text span {
  font-size: 28px;
  font-weight: 500;
  color: #7f7f7f;
}
.pushActive span {
  font-size: 28px;
  font-weight: 500;
  color: #f16eae !important;
}
.van-nav-bar__right span {
  color: #ff90c6;
}
.van-nav-bar__right .goPush {
  color: white;
}
input:disabled,
textarea:disabled {
  background: none;
  -webkit-text-fill-color: #484848;
  color: #484848;
  opacity: 1;
}
.isAndroid {
  // .unit-content {
  //   margin-top: 135px;
  // }
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
.loading {
  position: fixed;
  width: 100%;
  height: 100%;
  background: white;
  text-align: center;

  top: 0;
  left: 0;
  padding: 120px 0px;
}
</style>
