<template>
  <div
    class="addPage"
    :class="{
      isAndroid: !isIos,
    }"
  >
    <van-sticky>
      <NavBar
        left-text="取消"
        right-text="完成"
        :title="navTitle"
        :border="false"
        :safe-area-inset-top="true"
        @click-left="back"
        @click-right="upData"
      >
      </NavBar>
    </van-sticky>

    <div class="note">
      <van-dropdown-menu>
        <van-dropdown-item ref="dropdownMenu">
          <template #title>
            <div class="time">
              <img src="../../images/date.png" alt="" />
              {{ date }} {{ currentTime }}
            </div>
          </template>
          <div class="shadowBox">
            <van-calendar
              :show-title="false"
              :poppable="false"
              :show-confirm="false"
              @confirm="onConfirm"
              :min-date="minDate"
              :default-date="baseDate"
              color="#F06EAE"
              :style="{ height: '66.667vw' }"
            />
            <div class="clock">
              <div class="left">
                <img src="../../images/clock.png" alt="" />
                时间
              </div>
              <div class="right" @click="checkTime">
                {{ currentTime }} <van-icon name="arrow-down" color="#F16EAE" />
              </div>
            </div>
          </div>
        </van-dropdown-item>
      </van-dropdown-menu>
      <van-field
        v-model="message"
        rows="3"
        autosize
        type="textarea"
        placeholder="输入计划内容"
      />
      <!-- <div class="box">
        <van-uploader
          :after-read="afterRead"
          v-model="imageList"
          multiple
          :max-count="6"
        />
      </div> -->
      <div class="box">
        <div class="imgBox" v-for="(item, index) in imageList" :key="index">
          <img class="picture" :src="item" @click="lookItem(item)" alt="" />
          <img
            class="icon"
            @click="deleteImg(index)"
            src="../../images/imgDel_icon.png"
            alt=""
          />
        </div>
        <div class="imgBox" v-show="imageList.length < 6">
          <div @click="s3ImagePicker" class="img">
            <img src="../../images/addImg_icon.png" alt="" />
            <div>照片</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 提示 -->
    <transition name="van-fade">
      <div class="tipsBox" v-show="showTips">
        <span>{{ tipsMsg }}</span>
        <img src="../../images/tips.png" alt="" />
      </div>
    </transition>

    <van-dialog
      v-model="show"
      :title="null"
      show-cancel-button
      confirm-button-color="#ED8DC3"
    >
      <van-datetime-picker
        v-model="currentTime"
        type="time"
        :min-hour="0"
        :max-hour="23"
        :show-toolbar="false"
        item-height="10vw"
        visible-item-count="4"
      />
    </van-dialog>
  </div>
</template>
<script>
import {
  NavBar,
  Sticky,
  DropdownMenu,
  DropdownItem,
  Calendar,
  Field,
  // Uploader,
  DatetimePicker,
  Icon,
  Dialog,
  Toast,
  ImagePreview,
} from "vant";
import { isIos, closeWebview, formatDate } from "../../utils/index";

export default {
  components: {
    NavBar,
    "van-sticky": Sticky,
    "van-dropdown-menu": DropdownMenu,
    "van-dropdown-item": DropdownItem,
    "van-calendar": Calendar,
    "van-field": Field,
    // "van-uploader": Uploader,
    "van-datetime-picker": DatetimePicker,
    "van-icon": Icon,
    "van-dialog": Dialog.Component,
  },
  data() {
    return {
      navTitle: "添加计划",
      isIos: isIos(),
      minDate: new Date(2022, 3, 1),
      date: "2022-03-17",
      baseDate: null,
      currentTime: "09:00",
      show: false,
      message: "",
      baseApi: "",
      imageList: [],
      summaryId: "",
      showTips: false,
      tipsMsg: "随便记录点内容吧",
    };
  },
  async created() {
    this.baseApi = this.$ctx.baseApi;
    this.summaryId = this.$route.query.summaryId;
    if (this.summaryId) {
      this.navTitle = "编辑摘要";
      this.getData();
    }
    this.getNewDate();
  },
  mounted() {},
  methods: {
    back() {
      closeWebview();
    },
    // 初始日期
    getNewDate() {
      const newDate = new Date();
      // 添加默认选中今天
      if (!this.summaryId) {
        this.baseDate = newDate;
      }
      this.date = this.formatDate(newDate);
      this.currentTime = `${newDate.getHours()}:${
        newDate.getMinutes() < 10
          ? "0" + newDate.getMinutes()
          : newDate.getMinutes()
      }`;
    },
    async getData() {
      const { data } = await this.$request.get(
        `${this.baseApi}/weeksummary/${this.summaryId}/detail`
      );
      this.imageList = data.imageList || [];
      this.message = data.eventContent;
      const newDate = new Date(data.eventTime.replace(/-/g, "/"));
      this.baseDate = newDate;
      this.date = this.formatDate(newDate);
      this.currentTime = `${newDate.getHours()}:${newDate.getMinutes()}`;
    },
    onConfirm(date) {
      // this.baseDate = date
      console.log(this.formatDate(date));
      this.date = this.formatDate(date);
    },
    checkTime() {
      this.show = true;
    },
    // afterRead(file) {
    //   // 此时可以自行将文件上传至服务器
    //   console.log(file);
    //   console.log(this.imageList);
    // },
    async upData() {
      const msg = this.message.trim();
      if (!msg) {
        this.tipsMsg = "随便记录点内容吧";
        this.showTips = true;
        setTimeout(() => {
          this.showTips = false;
        }, 2000);
        return false;
      } else if (msg.length > 300) {
        this.tipsMsg = "不能超过300字";
        this.showTips = true;
        setTimeout(() => {
          this.showTips = false;
        }, 2000);
        return false;
      }
      console.log(msg.length);
      const params = {
        contactId: this.$route.query.targetContactId, // 新增一周摘要所属顾问的contactId
        eventTime: formatDate(`${this.date} ${this.currentTime}:00`), // 摘要时间yyyy-MM-dd HH:mm:ss
        eventContent: msg, // 摘要内容
        imageList: this.imageList, // 图片地址
      };
      if (this.summaryId) {
        params.summaryId = this.summaryId;
        const { data } = await this.$request.put(
          `${this.baseApi}/weeksummary`,
          params
        );
        // console.log(data);
        if (data) {
          Toast.success("修改成功！");
          this.back();
        } else {
          Toast.fail("修改失败,请稍后再试！");
        }
      } else {
        const { data } = await this.$request.post(
          `${this.baseApi}/weeksummary`,
          params
        );
        // console.log(data);
        if (data) {
          Toast.success("添加成功！");
          this.back();
        } else {
          Toast.fail("添加失败,请稍后再试！");
        }
      }
    },
    async s3ImagePicker() {
      const args = {
        takePhoto: true,
        photoBroswer: true,
        maxCount: 1,
        editPhoto: false,
      };
      let res = await this.$jsBridge.s3ImagePicker(args);
      if (res) {
        this.imageList.push(res[0]);
      }
    },
    lookItem(url) {
      const index = this.imageList.indexOf(url);
      ImagePreview({
        images: this.imageList,
        startPosition: index,
      });
    },
    deleteImg(index) {
      // console.log(index);
      this.imageList.splice(index, 1);
    },
    formatDate(date) {
      return formatDate(date, "YYYY-MM-DD");
    },
  },
};
</script>
<style lang="less" scoped>
.addPage {
  min-height: 100vh;
}
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

.note {
  .shadowBox {
    padding: 0 60px;
  }
  .time {
    display: flex;
    align-items: center;
    img {
      width: 30px;
      margin-right: 15px;
    }
  }
  .box {
    padding: 30px;
    display: flex;
    flex-wrap: wrap;
    .imgBox {
      width: 33.33%;
      height: auto;
      text-align: center;
      margin-bottom: 10px;
      position: relative;
      .picture {
        width: 214px;
        height: 214px;
      }
      .icon {
        width: 42px;
        height: 42px;
        position: absolute;
        top: 10px;
        right: 20px;
      }
    }
    .img {
      width: 214px;
      height: 214px;
      background: #f3f4f8;
      border-radius: 10px;
      margin: 0 auto;
      img {
        width: 87px;
        height: 76px;
        margin-top: 42px;
      }
      div {
        font-size: 24px;
        font-weight: bold;
        color: #7f7f7f;
        margin-top: 18px;
      }
    }
  }
  /deep/.van-dropdown-item__content {
    padding: 0 22px 12px;
  }
  /deep/.van-dropdown-menu__bar {
    box-shadow: none;
  }
  /deep/.van-cell:after {
    content: none;
  }
  /deep/.van-uploader__upload {
    width: 214px;
    height: 214px;
  }
  /deep/.van-uploader__preview-image {
    width: 214px;
    height: 214px;
  }
  /deep/.van-calendar__header-subtitle {
    color: #7f7f7f;
    font-size: 20px;
    height: 50px;
    line-height: 50px;
  }
  /deep/.van-calendar__weekday {
    color: #f26899;
    font-size: 28px;
  }
  /deep/.van-calendar__day {
    color: #7f7f7f;
    font-size: 28px;
  }

  /deep/.van-calendar__footer {
    padding: 0 !important;
  }
  /deep/.van-calendar__day--start,
  /deep/.van-calendar__day--end {
    color: #fff;
  }
  /deep/.van-calendar__header {
    box-shadow: none;
    display: flex;
    flex-direction: column-reverse;
  }
  /deep/.van-calendar__day {
    height: 68px;
  }
  /deep/.van-dropdown-menu__title--active {
    color: #484848;
  }
  /deep/.van-calendar__month-mark {
    color: #fff1f8;
    font-size: 200px;
  }
  /deep/.van-calendar__selected-day {
    width: 54px;
    height: 54px;
  }
  .clock {
    margin: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 30px;
    color: #484848;
    .left {
      display: flex;
      align-items: center;
      img {
        width: 28px;
        height: 28px;
        margin-right: 12px;
      }
    }
  }
}

.tipsBox {
  width: 379px;
  height: 130px;
  line-height: 130px;
  font-size: 30px;
  color: #f16eae;
  background-color: #fff4fd;
  border-radius: 15px;
  font-weight: 700;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  img {
    width: 45px;
    vertical-align: middle;
  }
}

/deep/.van-dialog {
  width: 550px;
}
/deep/.van-picker-column__item--selected {
  background-color: #ffe0ef;
  width: 183px;
  margin: 0 auto;
  border-radius: 13px;
}
</style>
