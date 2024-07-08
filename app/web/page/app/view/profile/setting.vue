<!-- 沙龙详情 -->
<template>
  <div class="wrap" :class="{ isAndroid: !isIos }">
    <NavBar
      left-text="返回"
      fixed
      title="详情"
      :border="false"
      :safe-area-inset-top="true"
      @click-left="back"
    >
      <template #left>
        <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
      </template>
    </NavBar>
    <div class="content">
      <van-cell-group>
        <van-cell title="头像">
          <img
            class="avatar"
            :src="
              `https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${userInfo.contactId}/avatar?size=60`
            "
            alt=""
          />
        </van-cell>
        <van-cell title="姓名" :value="userInfo.name" />
        <van-cell title="账号" :value="userInfo.directSellerId" />
        <van-cell title="手机号码" :value="userInfo.mobile" v-if="showMobile" />
        <van-cell title="设为关注" class="follow" v-if="showFollow">
          <van-switch
            @change="changeFocus"
            v-model="userInfo.isFocus"
            active-color="#F16EAE"
          />
        </van-cell>
        <!-- <div class="follow">
                <span>设为关注</span>
                <van-switch v-model="checked" active-color="#F16EAE"/>
            </div> -->
        <van-cell
          title="生日"
          :value="userInfo.birthDate | formatDate('YYYY.MM.DD')"
        />
        <!-- <van-cell title="性别" value="女" /> -->
        <van-cell
          v-if="userInfo.recruiterName"
          title="辅导老师"
          :value="userInfo.recruiterName"
        />
        <van-cell
          title="加入日期"
          :value="userInfo.joinDate | formatDate('YYYY.MM.DD')"
        />
        <van-cell
          title="最近订单日期"
          :value="userInfo.lastOrderDate | formatDate('YYYY.MM.DD')"
        />
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import { NavBar, Button, Icon, Cell, CellGroup, Switch } from "vant";
import {
  isIos,
  closeWebview,
  formatDate,
  xxxxxx,
  formatMoney,
} from "../../utils/index";
import commonTable from "../../components/commonTable.vue";
export default {
  components: {
    commonTable,
    NavBar,
    "van-button": Button,
    "van-icon": Icon,
    "van-cell": Cell,
    "van-cell-group": CellGroup,
    "van-switch": Switch,
  },
  data() {
    return {
      isFullScreen: false,
      isIos: isIos(),
      userInfo: {
        contactId: "20018733722",
        careerLevelCode: 50,
      },
      targetContactId: "",
      isSelf: false,
      accountType: "operation",
    };
  },
  computed: {
    showFollow() {
      return (
        !this.isSelf &&
        this.userInfo.careerLevelCode !== "50" &&
        !(
          this.accountType === "operation" && this.userInfo.careerLevelCode < 60
        )
      );
    },
    showMobile() {
      return !(
        this.accountType === "operation" && this.userInfo.careerLevelCode < 50
      );
    },
  },
  created() {
    const { targetContactId, isSelf, accountType } = this.$route.query;
    this.targetContactId = targetContactId;
    this.isSelf = JSON.parse(isSelf);
    this.accountType = accountType;
    this.getUserInfo();
  },
  methods: {
    back() {
      closeWebview();
    },
    async getUserInfo() {
      const params = {
        contactId: this.targetContactId,
      };
      const { data } = await this.$request.get(`${this.$ctx.baseApi}/profile`, {
        params,
      });
      console.log(data);
      if (data) {
        if (data.birthDate) {
          data.birthDate = this.utc2gmt(data.birthDate);
        }
        if (data.joinDate) {
          data.joinDate = this.utc2gmt(data.joinDate);
        }
        if (data.lastOrderDate) {
          data.lastOrderDate = this.utc2gmt(data.lastOrderDate);
        }
        this.userInfo = data;
      }
    },
    utc2gmt(date) {
      let dateStr = `${date.split("T")[0]} ${date.split("T")[1].split(".")[0]}`;
      date = new Date(dateStr.replace(/-/g, "/"));
      date.setHours(date.getHours() + 8);
      return date;
    },
    async changeFocus() {
      let eventType = "PersonalSetFocusClick";
      if (this.userInfo.isFocus) {
        eventType = "PersonalUnfocusClick";
      }
      this.$track({
        context: "PersonalProfilePage",
        behavior: eventType,
        item_type: "PersonalProfilePage",
        item_id: eventType,
        attributes: {
          isEmployee: this.accountType === "operation",
        },
      });
      const { data } = await this.$request.post(`${this.$ctx.baseApi}/focus`, {
        focusContactId: this.targetContactId,
      });
      this.getUserInfo();
    },
  },
};
</script>
<style lang="less" scoped>
.wrap {
  font-size: 30px;
  color: #484848;
  .content {
    padding-top: env(safe-area-inset-top);
    margin-top: 80px;
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: block;
      object-fit: cover;
    }
    .van-cell {
      align-items: center;
    }
    .van-cell__value {
      font-size: 26px;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .follow {
      display: flex;
      align-items: center;
      .van-switch {
        width: 84px;
        height: 42px;
        /deep/.van-switch__node {
          width: 40px;
          height: 40px;
        }
      }
      /deep/.van-switch--on .van-switch__node {
        transform: translateX(44px);
      }
    }
  }
}
.isAndroid {
  .content {
    margin-top: 135px;
  }
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
/deep/.van-nav-bar__placeholder {
  // height: 75px!important;
  background-color: #ee4d9b;
}
/deep/.van-nav-bar {
  background-color: #ee4d9b;
  .van-nav-bar__content {
    height: 80px;
    .van-nav-bar__left {
      .back_btn {
        width: 17px;
        height: 32px;
      }
    }
    .van-nav-bar__right {
      .icon-search {
        width: 46px;
        margin-right: 25px;
      }
      .icon-more {
        width: 42px;
      }
    }
  }
  .van-nav-bar__title {
    color: #fff;
    font-size: 30px;
  }
}
</style>
