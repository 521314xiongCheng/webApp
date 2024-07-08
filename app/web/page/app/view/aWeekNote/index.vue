<template>
  <div
    class="indexPage"
    :class="{
      isAndroid: !isIos,
      isIphoneX: isIphoneX,
    }"
  >
    <van-sticky>
      <NavBar
        left-text="返回"
        right-text="一周摘要"
        :title="navTitle"
        :border="false"
        :safe-area-inset-top="true"
        @click-left="back"
        @click-right="toList"
      >
        <template #left>
          <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
        </template>
      </NavBar>
    </van-sticky>
    <!-- 消息提醒 -->
    <div
      class="message"
      @click="toMyRecognition('unread')"
      v-if="messageNum && isSelf"
    >
      <img src="../../images/notice.png" alt="" />
      <span class="msg">{{ messageTitle }}</span>
      <span class="tips">{{ messageNum }}</span>
    </div>
    <!-- 筛选 -->
    <div class="checkList">
      <div class="checkBox">
        <span class="label">时间选择：</span>
        <van-dropdown-menu>
          <van-dropdown-item ref="dropdownMenu">
            <template #title>
              <span class="time">{{ date }}</span>
            </template>
            <div class="shadowBox">
              <van-calendar
                :show-title="false"
                type="range"
                :poppable="false"
                @confirm="onConfirm"
                :min-date="minDate"
                :max-range="7"
                :default-date="[startDate, endDate]"
                :allow-same-day="true"
                color="#F06EAE"
                :formatter="formatter"
                :style="{ height: '80vw' }"
              />
            </div>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      <div class="checkBox">
        <img src="../../images/select.png" />
        <el-select
          v-model="filter"
          placeholder="请选择"
          @change="changeHandler"
          :popper-append-to-body="false"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="系统摘要" value="0"></el-option>
          <el-option label="个人摘要" value="1"></el-option>
        </el-select>
      </div>
    </div>
    <div class="outList">
      <div class="weekList">
        <div
          class="box"
          :class="{ active: item.localeDate == localeDate }"
          v-for="item in weekDays"
          :key="item.date"
          @click="changeDay(item.localeDate)"
        >
          <div class="top">{{ item.month }}/{{ item.date }}</div>
          <div class="bottom">{{ formateDay(item.day) }}</div>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div class="dataList">
      <div
        class="itemBox"
        v-for="item in abstractList"
        :key="item.title"
        v-show="item.list.length"
      >
        <div class="title">
          <span class="left">{{ item.title }}</span>
        </div>
        <div class="content">
          <div class="item" v-for="item2 in item.list" :key="item2.summaryId">
            <div class="time">{{ formateTime(item2.eventTime) }}</div>
            <div class="right">
              <div class="msg">
                <div
                  class="center"
                  :class="{ selfMsg: item2.summaryType }"
                  @click="item2.summaryType && toAddNote(item2.summaryId)"
                  v-html="item2.eventContent"
                >
                  {{ item2.eventContent }}
                </div>
                <img
                  src="../../images/delete_icon.png"
                  alt=""
                  v-if="item2.summaryType && isSelf"
                  @click="deleteItem(item2.summaryId)"
                />
              </div>
              <div class="line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="abstractListMsg"
      v-show="
        !abstractList.morning.list.length &&
        !abstractList.noon.list.length &&
        !abstractList.evening.list.length
      "
    >
      <img src="../../images/tipsBg_icon.png" alt="" />
      <p>当日没有计划<span v-if="isSelf">，您可以点击右下角添加~</span></p>
    </div>
    <!-- 底部固定 -->
    <div
      class="fixedBottomPart"
      v-show="(listData && listData.length) || !isSelf"
    >
      <!-- 认可 -->
      <div class="recognition" v-show="listData && listData.length">
        <div class="title">
          <div class="left">认可</div>
          <div class="right" @click="toMyRecognition('all')">
            更多 <img src="../../images/right_icon.png" alt="" />
          </div>
        </div>
        <div class="outContent">
          <div class="content" @scroll="scrollEvent($event)">
            <ul ref="scroll">
              <li
                class="item"
                v-for="(item, index) in listData"
                :key="item.approvalId"
                :class="{ active: index == 0 }"
              >
                <div class="top">
                  <div class="name">
                    <img
                      class="contactImg"
                      :src="`https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${item.approvalContactId}/avatar?size=60`"
                      alt=""
                    />
                    {{ item.approvalName }}
                  </div>
                  <div class="time">{{ item.approvalTime }}</div>
                </div>
                <!-- 点赞 -->
                <div class="bottom" v-if="item.approvalType == 1">
                  <div class="recongnition">
                    <img
                      src="../../images/like2_icon.png"
                      alt=""
                    />点赞了你的一周摘要
                  </div>
                </div>
                <!-- 文本评论 -->
                <div class="bottom" v-if="item.resourceType == 0">
                  <p class="recText">{{ item.content }}</p>
                </div>
                <!-- 语音评论 -->
                <div class="bottom" v-if="item.resourceType == 1">
                  <div class="recongnition">
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
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 点赞评论 -->
      <div class="bottomPart" v-if="!isSelf">
        <div class="top">
          <div class="inp">
            <van-form @submit="onSubmit(inpValue, 0, 0)">
              <van-field
                v-model="inpValue"
                placeholder="认可她的摘要~"
                name="content"
                right-icon=""
                @focus="showAudioBox = false"
                ref="fieldInp"
              >
                <template #button>
                  <img
                    @click="showAudioBox = !showAudioBox"
                    v-show="!showAudioBox"
                    class="audioImg"
                    src="../../images/audio_icon.png"
                    alt=""
                  />
                  <img
                    @click="showAudioBox = !showAudioBox"
                    v-show="showAudioBox"
                    class="audioImg"
                    src="../../images/audio_on_icon.png"
                    alt=""
                  />
                </template>
              </van-field>
            </van-form>
          </div>
          <div class="like" @click="likeClick">
            <img
              v-show="currentIsLike"
              src="../../images/like_icon.png"
              alt=""
            />
            <img
              v-show="!currentIsLike"
              src="../../images/noLike_icon.png"
              alt=""
            />
            {{ likeQuantity }}
          </div>
          <div class="msg">
            <img src="../../images/pinglun_icon.png" alt="" />
            {{ commentQuantity }}
          </div>
        </div>
        <div
          class="bottom"
          v-show="showAudioBox"
          @touchstart.prevent="upStart"
          @touchend.prevent="upStop"
        >
          <div class="audioLine" v-show="audioFlag">
            <div class="lineBox">
              <div class="line" :class="{ active: audioTime >= 60 }"></div>
              <div class="line" :class="{ active: audioTime >= 50 }"></div>
              <div class="line" :class="{ active: audioTime >= 40 }"></div>
              <div class="line" :class="{ active: audioTime >= 30 }"></div>
              <div class="line" :class="{ active: audioTime >= 20 }"></div>
              <div class="line" :class="{ active: audioTime >= 10 }"></div>
            </div>
            <div class="time">{{ `0:${audioTime}` }}</div>
            <div class="lineBox">
              <div class="line" :class="{ active: audioTime >= 10 }"></div>
              <div class="line" :class="{ active: audioTime >= 20 }"></div>
              <div class="line" :class="{ active: audioTime >= 30 }"></div>
              <div class="line" :class="{ active: audioTime >= 40 }"></div>
              <div class="line" :class="{ active: audioTime >= 50 }"></div>
              <div class="line" :class="{ active: audioTime >= 60 }"></div>
            </div>
          </div>
          <div>按住说话</div>
          <img v-show="audioFlag" src="../../images/upAudio_on.png" alt="" />
          <img v-show="!audioFlag" src="../../images/upAudio.png" alt="" />
        </div>
      </div>
    </div>
    <!-- 新增认可 -->
    <div class="addBtn" @click="toAddNote()" v-if="isSelf">
      <img src="../../images/add_icon.png" alt="" />
    </div>
    <!-- 提示 -->
    <transition name="van-fade">
      <div class="tipsBox" v-show="showTips">
        <span>不能超过200字</span>
        <img src="../../images/tips.png" alt="" />
      </div>
    </transition>
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
  Form,
  Toast,
  Dialog,
} from "vant";
import {
  isIos,
  isIphoneX,
  closeWebview,
  formatDate,
  xxxxxx,
} from "../../utils/index";

export default {
  components: {
    NavBar,
    "van-sticky": Sticky,
    "van-dropdown-menu": DropdownMenu,
    "van-dropdown-item": DropdownItem,
    "van-calendar": Calendar,
    "van-field": Field,
    "van-form": Form,
  },
  data() {
    return {
      navTitle: "一周计划表",
      isIos: isIos(),
      isIphoneX: isIphoneX(),
      selectLabel: "全部",
      filter: "",
      baseApi: "",
      contactId: "",
      showTips: false,
      onDate: "",
      // 未读消息
      messageTitle: "",
      messageNum: "",
      // 日期选择
      startDate: null,
      endDate: null,
      date: "04/01 - 04/07",
      minDate: new Date(2022, 3, 1),
      localeDate: "2022/3/8",
      weekDays: [
        {
          month: 3,
          date: 7,
          day: 1,
          localeDate: "2022/3/7",
        },
      ],
      // 列表数据
      abstractList: {
        morning: {
          title: "上午",
          list: [],
        },
        noon: {
          title: "下午",
          list: [],
        },
        evening: {
          title: "晚上",
          list: [],
        },
      },
      // 认可
      listData: [],
      durationList: {},
      audioShow: "",
      audioOn: 1,
      timerInt: null,
      // 点赞评论
      likeQuantity: 0, //点赞数量
      currentIsLike: false, //当前天是否点赞
      commentQuantity: 0, //评论数量
      inpValue: "",
      audioFlag: false, //语音状态
      audioTime: 0,
      setTime: null,
      showAudioBox: false,
      isSelf: false,
    };
  },
  watch: {
    audioTime(val) {
      if (val > 59) {
        this.upStop();
      }
    },
  },
  async created() {
    this.baseApi = this.$ctx.baseApi;
    this.contactId = this.$route.query.targetContactId;
    if (
      this.$route.query.ImpersonatedContactID &&
      this.$route.query.loginName
    ) {
      this.ImpersonatedContactID = this.$route.query.ImpersonatedContactID;
      this.loginName = this.$route.query.loginName;
    } else {
      if (xxxxxx) {
        let userProfile = await this.$jsBridge.getUserProfile();
        userProfile =
          typeof userProfile === "string"
            ? JSON.parse(userProfile)
            : userProfile;
        console.log("userProfile", userProfile);
        // 姓名账号用于一周摘要
        this.loginName = `${userProfile.last_name}${userProfile.first_name}`;
        this.ImpersonatedContactID = userProfile.contact_id;
      }
    }
    this.isSelf = this.contactId == this.ImpersonatedContactID;
    this.getNewDate();
    this.getDataList();
    this.getData();
    this.getLikeData();
    this.getMyRecognition();
  },
  async mounted() {
    // 返回刷新数据
    const onFronted = (data) => {
      this.getData();
      this.getDataList();
      this.getLikeData();
      this.getMyRecognition();
    };
    this.$jsBridge.onFronted(onFronted);
  },
  methods: {
    audioLoad() {
      setTimeout(() => {
        const audios = document.querySelectorAll(".audio");
        console.log(audios);
        for (var i = 0; i < audios.length; i++) {
          audios[i].load();
        }
      }, 0);
    },
    back() {
      closeWebview();
    },
    // 消息提醒
    async getData() {
      const { data } = await this.$request.get(
        `${this.baseApi}/weeksummary/approval/unread/count`,
        {
          contactId: this.contactId,
        }
      );
      this.messageTitle = data.title;
      this.messageNum = data.unreadQuantity;
    },
    // 初始日期
    getNewDate() {
      const newDate = new Date();
      this.onDate = this.formatDate(newDate);
      this.localeDate = this.formatDate(newDate);
      let getDay = newDate.getDay();
      getDay = getDay || 7;
      // console.log(getDay);
      const firstDate = new Date(newDate.getTime() - (getDay - 1) * 86400000);
      const lastDate = new Date(newDate.getTime() + (7 - getDay) * 86400000);
      this.startDate = firstDate;
      this.endDate = lastDate;
      this.date =
        formatDate(firstDate, "MM/DD") + "-" + formatDate(lastDate, "MM/DD");
      this.getWeekDays(firstDate, lastDate);
    },
    // 列表数据
    async getDataList() {
      const params = {
        contactId: this.contactId,
        date: this.localeDate,
        summaryType: this.filter,
      };
      const { data } = await this.$request.get(
        `${this.baseApi}/weeksummary/list`,
        { params }
      );
      console.log(data);
      const morningTime = new Date(
        `${this.localeDate.replace(/-/g, "/")} 12:00:00`
      ).getTime();
      const noonTime = new Date(
        `${this.localeDate.replace(/-/g, "/")} 18:00:00`
      ).getTime();
      let morningDate = [];
      let noonDate = [];
      let eveningDate = [];
      // console.log(morningTime, noonTime);
      data.forEach((e) => {
        // console.log(e.eventTime);
        let eTime = new Date(e.eventTime.replace(/-/g, "/")).getTime();
        // console.log(eTime);
        if (eTime <= morningTime) {
          morningDate.push(e);
        } else if (eTime <= noonTime) {
          noonDate.push(e);
        } else {
          eveningDate.push(e);
        }
      });
      this.abstractList.morning.list = morningDate;
      this.abstractList.noon.list = noonDate;
      this.abstractList.evening.list = eveningDate;
    },
    // 点赞评论
    async getLikeData() {
      const params = {
        approvalContactId: this.ImpersonatedContactID,
        contactId: this.contactId,
        date: this.onDate,
      };
      const { data } = await this.$request.get(
        `${this.baseApi}/weeksummary/approval/count`,
        { params }
      );
      console.log("点赞评论", data);
      this.commentQuantity = data.commentQuantity || 0;
      this.currentIsLike = data.currentIsLike;
      this.likeQuantity = data.likeQuantity || 0;
    },
    // 认可
    async getMyRecognition() {
      let params = {
        contactId: this.contactId,
        pageNo: 1,
        pageSize: 5,
      };
      const { data } = await this.$request.get(
        `${this.baseApi}/weeksummary/approval/list`,
        {
          params,
        }
      );
      console.log("认可", data);
      this.listData = data.pageList;
      this.audioLoad();
    },
    formatDate(date, type = "YYYY-MM-DD") {
      return formatDate(date, type);
    },
    formateDay(day) {
      switch (day) {
        case 1:
          return "一";
        case 2:
          return "二";
        case 3:
          return "三";
        case 4:
          return "四";
        case 5:
          return "五";
        case 6:
          return "六";
        case 0:
          return "日";
      }
    },
    formateTime(time) {
      time = time.replace(/-/g, "/");
      let hours = new Date(time).getHours();
      let minutes = new Date(time).getMinutes();
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return `${hours}:${minutes}`;
    },
    onConfirm(date) {
      // console.log(date);
      const [start, end] = date;
      this.startDate = start;
      this.endDate = end;
      this.getWeekDays(start, end);
      this.date = formatDate(start, "MM/DD") + "-" + formatDate(end, "MM/DD");
      this.$refs.dropdownMenu.toggle();
      //自动获取第一个数据
      this.localeDate = this.formatDate(start);
      this.getDataList();
    },
    changeDay(localeDate) {
      // console.log(localeDate);
      this.localeDate = localeDate;
      this.getDataList();
    },
    getWeekDays(firstDate, lastDate) {
      firstDate = firstDate.getTime();
      lastDate = lastDate.getTime();
      this.weekDays = [];
      for (let i = firstDate; i <= lastDate; i += 86400000) {
        const item = new Date(i);
        this.weekDays.push({
          month: item.getMonth() + 1,
          date: item.getDate(),
          day: item.getDay(),
          localeDate: this.formatDate(item),
        });
      }
    },
    changeHandler() {
      this.getDataList();
    },
    deleteItem(id) {
      Dialog.confirm({
        title: "确认要删除该条摘要吗?",
        confirmButtonColor: "#ED8DC3",
        confirmButtonText: "确定",
      })
        .then(() => {
          this.deleteData(id);
        })
        .catch(() => {
          // on cancel
        });
    },
    async deleteData(id) {
      const params = {
        contactId: this.contactId,
      };
      const { data } = await this.$request.delete(
        `${this.baseApi}/weeksummary/${id}`,
        { params }
      );
      if (data) {
        Toast.success("删除成功！");
      } else {
        Toast.fail("删除失败,请稍后再试！");
      }
      this.getDataList();
    },
    // 语音评论点赞
    async onSubmit(values, approvalType = 0, resourceType = null) {
      // console.log("submit", values, approvalType, resourceType);
      values = values ? values.trim() : values;
      if (values && values.length > 200) {
        this.showTips = true;
        setTimeout(() => {
          this.showTips = false;
        }, 2000);
        return false;
      }
      const params = {
        approvalContactId: this.ImpersonatedContactID, //认可人的顾问id(员工账号登录:员工账号选择的顾问的contactId; 非员工账号登录:登录人的contactId)
        approvalName: this.loginName, //认可人姓名
        approvalType: approvalType, //认可类型: 0:评论 1:点赞
        resourceType: resourceType, //评论类型: 0（文本）,  1 语音
        targetContactId: this.contactId,
        summaryDate: this.onDate,
        content: values,
      };
      const { data } = await this.$request.post(
        `${this.baseApi}/weeksummary/approval`,
        params
      );
      if (data) {
        Toast.success("认可成功！");
        this.getMyRecognition();
        this.getLikeData();
        this.inpValue = "";
        this.$refs.fieldInp.blur(); //关闭键盘
      } else {
        Toast.fail("认可失败,请稍后再试！");
      }
    },
    async upStart() {
      this.audioTime = 0;
      this.audioFlag = true;
      this.setTime = setInterval(() => {
        this.audioTime++;
      }, 1000);
      let res = await this.$jsBridge.audioRecorder("start");
      console.log("upStart", res);
    },
    async upStop() {
      this.audioFlag = false;
      clearInterval(this.setTime);
      this.audioTime = 0;
      let res = await this.$jsBridge.audioRecorder("stop");
      console.log("upStop", res);
      if (res.result) {
        this.onSubmit(res.url, 0, 1);
      } else {
        Toast.fail("语音发送失败,请重试！");
      }
      this.showAudioBox = false;
    },
    async likeClick() {
      if (this.currentIsLike) {
        const params = {
          approvalContactId: this.ImpersonatedContactID,
          contactId: this.contactId,
          summaryDate: this.onDate,
        };
        const { data } = await this.$request.delete(
          `${this.baseApi}/weeksummary/approval/like`,
          { params }
        );
        // console.log(data);
        if (data) {
          Toast.success("已取消点赞！");
          this.getMyRecognition();
        } else {
          Toast.fail("取消失败,请稍后再试！");
        }
        this.getLikeData();
      } else {
        this.onSubmit(null, 1);
      }
      // setTimeout(() => {
      //   this.getLikeData();
      // }, 0);
    },
    toList() {
      this.pauseAudio();
      let url = `${window.location.origin}/a_week_note_list`;
      const params = {
        opaque: false,
        targetContactId: this.contactId,
        startDate: this.formatDate(this.startDate).replace(/-/g, ""),
        endDate: this.formatDate(this.endDate).replace(/-/g, ""),
      };
      this.$go(url, params);
    },
    toMyRecognition(apiType) {
      this.pauseAudio();
      let url = `${window.location.origin}/a_week_note_myRecognition`;
      const params = {
        apiType: apiType,
        opaque: false,
        targetContactId: this.contactId,
        ImpersonatedContactID: this.ImpersonatedContactID,
        isSelf: this.isSelf,
      };
      this.$go(url, params);
    },
    toAddNote(id) {
      if (!this.isSelf) {
        return false;
      }
      this.pauseAudio();
      let url = `${window.location.origin}/a_week_note_addNote`;
      const params = {
        opaque: false,
        targetContactId: this.contactId,
      };
      if (id) {
        params.summaryId = id;
      }
      this.$go(url, params);
    },
    formatter(day) {
      day.bottomInfo = "";
      return day;
    },
    async onAudio(id, index, read) {
      console.log(id, index, read);
      const audio = this.$refs[id][0];
      // 暂停播放
      if (!audio.paused) {
        audio.pause();
        return false;
      }
      // 暂停所有
      this.pauseAudio();
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
    // 停止语音
    pauseAudio() {
      const audios = document.querySelectorAll(".audio");
      for (var i = 0; i < audios.length; i++) {
        audios[i].pause();
      }
    },
    audioEnd() {
      this.audioShow = "";
      clearInterval(this.timerInt);
      this.audioOn = 1;
    },
    getDuration(id) {
      const duration = this.$refs[id][0].duration;
      // console.log("getDuration", id, duration);
      this.durationList[id] = duration;
      this.$set(this.durationList, this.durationList[id], duration);
    },
    format(data) {
      return parseInt(data) + "″";
    },
    scrollEvent(e) {
      let index = Math.round(
        this.$refs.scroll.getBoundingClientRect().right /
          this.$refs.scroll.children[0].offsetWidth
      );
      const arr = Array.from(this.$refs.scroll.children);
      switch (index) {
        case arr.length:
          index = 0;
          break;
        case arr.length - 1:
          index = 1;
          break;
        case arr.length - 2:
          index = 2;
          break;
        case arr.length - 3:
          index = 3;
          break;
        case arr.length - 4:
          index = 4;
          break;
        default:
          index = 0;
          return false;
      }
      arr.forEach((e, i) => {
        if (i == index) {
          e.className = "item active";
        } else {
          e.className = "item";
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.indexPage {
  min-height: 100vh;
  padding-bottom: 450px;
}
.isAndroid {
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
.isIphoneX {
  .fixedBottomPart {
    padding-bottom: 60px;
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
.message {
  width: 568px;
  padding: 20px 0;
  box-shadow: 0px 2px 10px 0px #e7e7e7;
  border-radius: 16px;
  margin: 30px auto;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  img {
    width: 32px;
    height: 32px;
  }
  .msg {
    line-height: 32px;
    margin: 0 17px 0 23px;
  }
  .tips {
    display: inline-block;
    min-width: 32px;
    line-height: 32px;
    padding: 0 8px;
    background-color: #f45858;
    border-radius: 16px;
    color: #fff;
    font-weight: 400;
    text-align: center;
    font-size: 23px;
  }
}
.checkList {
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .checkBox {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 28px;
    font-weight: 700;
    .label {
      color: #484848;
      border-left: 7px solid #f16eae;
      padding-left: 12px;
      margin-left: 15px;
      line-height: 28px;
    }
    img {
      width: 4vw;
      height: 4.5vw;
    }
    .select-label {
      color: #f16eae;
    }
    /deep/.van-dropdown-menu__bar {
      box-shadow: none;
      .van-dropdown-menu__title {
        font-size: 28px;
        font-weight: bold;
        color: #f16eae;
        // &::after {
        //   content: none;
        // }
      }
    }
    /deep/.el-input__inner {
      width: 125px;
      border: none;
      padding: 0;
      font-size: 28px;
      line-height: 2;
      height: auto;
      text-align: center;
      color: #f26899;
    }
    /deep/.el-input--suffix {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    /deep/.el-input__suffix {
      position: initial;
    }
    /deep/.el-input__icon {
      width: auto;
    }
    /deep/.el-select .el-input .el-select__caret {
      color: #f26899;
    }
    /deep/.van-dropdown-menu__title {
      padding-left: 0;
    }
  }
  .shadowBox {
    padding: 0 60px;
  }
}
.el-select-dropdown__item.selected {
  color: #f26899;
  font-weight: 500;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #fff;
}
/deep/.van-dropdown-item__content {
  padding: 0 22px;
}
/deep/.van-calendar__header-subtitle,
/deep/.van-calendar__month-title {
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
  height: 75px;
}
/deep/.van-calendar__footer {
  padding-bottom: 15px !important;
}
/deep/.van-calendar__day--start,
/deep/.van-calendar__day--end,
/deep/.van-calendar__day--start-end {
  color: #fff;
}
/deep/.van-calendar__header {
  box-shadow: none;
  display: flex;
  flex-direction: column-reverse;
}
/deep/.van-calendar__month-mark {
  color: #fff1f8;
  font-size: 200px;
}
/deep/.el-popper {
  margin-top: 0;
  box-shadow: none;
}
// 日期选择
.outList {
  overflow: hidden;
  height: 142px;
}
.weekList {
  padding-left: 30px;
  padding-bottom: 30px;
  display: flex;
  overflow-x: scroll;
  // -ms-overflow-style: none !important;
  // scrollbar-width: none !important;
  // overflow: -moz-scrollbars-none;
  // &::-webkit-scrollbar {
  //   width: 0 !important;
  //   height: 0 !important;
  // }
  .box {
    width: 130px;
    height: 130px;
    border-radius: 16px;
    box-shadow: 0px 2px 12px 0px #e7e7e7;
    text-align: center;
    // overflow: hidden;
    margin-right: 21px;
    flex-shrink: 0;
    .top {
      height: 50px;
      line-height: 50px;
      color: #fff;
      background-color: #ffa0ce;
      font-size: 26px;
      border-radius: 15px 15px 0 0;
    }
    .bottom {
      height: 80px;
      line-height: 80px;
      font-weight: 700;
      font-size: 40px;
    }
  }
  .active {
    border: 3px solid #f16eae;
    .top {
      background-color: #f16eae;
      margin-top: -3px;
      margin-right: -1px;
      margin-left: -1px;
    }
    .bottom {
      color: #f16eae;
    }
  }
}
// 列表
.dataList {
  margin-top: 50px;
  margin-left: 15px;
  padding: 0 30px;
  .itemBox {
    margin-top: 50px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      .left {
        font-size: 28px;
        font-weight: 700;
        border-left: 7px solid #f16eae;
        padding-left: 12px;
        line-height: 28px;
      }
      .checkBox {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 28px;
        font-weight: 700;
        img {
          width: 4vw;
          height: 4.5vw;
          margin-right: 1.5vw;
        }
        /deep/.el-input__inner {
          width: 60px;
          border: none;
          padding: 0;
          font-size: 28px;
          line-height: 2;
          height: auto;
          text-align: center;
          color: #f16eae;
        }
        /deep/.el-input__suffix {
          position: initial;
        }
        /deep/.el-input__icon {
          width: auto;
          line-height: 100%;
        }
        /deep/.el-select .el-input .el-select__caret {
          color: #f16eae;
        }
      }
    }
    .content {
      .item {
        display: flex;
        margin-left: 12px;
        color: #484848;
        margin-bottom: 30px;
        .time {
          width: 104px;
          font-size: 24px;
          height: 40px;
          line-height: 40px;
        }
        .right {
          flex-grow: 1;
          .msg {
            display: flex;
            margin-right: 25px;
            .center {
              font-size: 28px;
              // height: 40px;
              // line-height: 40px;
              flex-grow: 1;
              width: 450px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            img {
              width: 40px;
              height: 40px;
            }
            .selfMsg {
              color: #f16eae;
            }
          }
        }
        .line {
          margin-top: 30px;
          border-bottom: 1px solid #ededed;
        }
      }
    }
  }
}
.abstractListMsg {
  margin-top: 90px;
  text-align: center;
  color: #ccc;
  img {
    width: 213px;
    height: 242px;
  }
  p {
    margin-top: 45px;
  }
}
.fixedBottomPart {
  width: 100%;
  padding-bottom: 30px;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  box-shadow: 0px 2px 23px 0px rgba(233, 233, 233, 0.5);
}
// 认可
.recognition {
  margin-top: 30px;
  // padding-bottom: 24px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28px;
    margin-bottom: 20px;
    margin-left: 15px;
    padding: 0 30px;
    .left {
      font-weight: 700;
      border-left: 7px solid #f16eae;
      padding-left: 12px;
      line-height: 28px;
    }
    .right {
      color: #f16eae;
      display: flex;
      align-items: center;
      img {
        width: 10px;
        height: 19px;
        margin-left: 16px;
      }
    }
  }
  .outContent {
    overflow: hidden;
    height: 200px;
  }
  .content {
    display: flex;
    overflow-x: scroll;
    padding-bottom: 30px;
    // -ms-overflow-style: none;
    // overflow: -moz-scrollbars-none;
    // &::-webkit-scrollbar {
    //   width: 0 !important;
    // }
    ul {
      display: flex;
      padding-left: 30px;
    }
    .item {
      flex-shrink: 0;
      width: 457px;
      height: 181px;
      background: #ffffff;
      border-radius: 25px;
      border: 2px solid #e5e5e5;
      padding: 25px;
      margin-right: 40px;
      margin-top: 6px;
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 700;
        color: #484848;
        .name {
          font-size: 28px;
          img {
            width: 60px;
            height: 60px;
            vertical-align: middle;
            border-radius: 50%;
            margin-right: 18px;
          }
        }
        .time {
          font-size: 22px;
        }
      }
      .bottom {
        color: #484848;
        font-size: 20px;
        line-height: 26px;
        .recongnition {
          line-height: 30px;
          font-size: 24px;
          display: flex;
          align-items: center;
          margin-top: 16px;
          text-align: left !important;
          img {
            width: 28px;
            margin-right: 5px;
          }
        }
        .recText {
          line-height: 30px;
          font-size: 24px;
          margin-top: 16px;
          text-align: left !important;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .audio {
          display: none;
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
    .active {
      margin-top: 0;
      // width: 457px;
      height: 193px;
      background: url(../../images/myRe_bg.png) no-repeat;
      background-size: 100% 100%;
      border: none;
      transform: scale(1, 1.05);
      transition: all 0.5s;
      // transition: width 0.5s, height 0.5s;
      transform-origin: center center;
    }
  }
}
// 点赞评论
.bottomPart {
  // position: fixed;
  // bottom: 0;
  // padding: 30px;
  margin-top: 30px;
  width: 100%;
  background-color: #fff;
  font-size: 26px;
  color: #7f7f7f;
  .top {
    display: flex;
    align-items: center;
    // justify-content: space-evenly;
    .inp {
      margin-left: 31px;
      width: 385px;
      /deep/.van-field__control {
        height: 50px;
        line-height: 50px;
      }
      /deep/.van-cell {
        height: 70px;
        border-radius: 35px;
        background-color: #f4f4f4;
        padding: 10px 18px 10px 25px;
      }
      /deep/.van-field__button {
        height: 50px;
      }
      .audioImg {
        width: 50px;
        line-height: 70px;
      }
    }
    .like {
      margin-left: 71px;
      img {
        width: 41px;
        height: 38px;
        vertical-align: middle;
        margin-right: 15px;
      }
    }
    .msg {
      margin-left: 38px;
      img {
        width: 46px;
        height: 48px;
        vertical-align: middle;
        margin-right: 15px;
      }
    }
  }
  .bottom {
    text-align: center;
    font-size: 30px;
    color: #7f7f7f;
    margin-top: 30px;
    img {
      width: 165px;
      height: 165px;
      margin-top: 30px;
    }
  }
  .audioLine {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    .time {
      margin: 0 20px;
    }
    .lineBox {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .line {
        width: 7px;
        height: 36px;
        background: #f0f0f0;
        border-radius: 4px;
        margin-right: 10px;
      }
      .active {
        background: #f16eae;
      }
    }
  }
}
// 新增认可
.addBtn {
  width: 108px;
  height: 108px;
  position: fixed;
  right: 29px;
  bottom: 425px;
  background: url(../../images/addBg_icon.png) no-repeat;
  background-size: 100%;
  text-align: center;
  img {
    width: 60px;
    height: 60px;
    margin-top: 24px;
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
</style>
