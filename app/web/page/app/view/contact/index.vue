<template>
  <div class="search-wrap" :class="{ isAndroid: !isIos }">
    <van-sticky>
      <NavBar
        left-text="返回"
        title="联系人"
        :border="false"
        :safe-area-inset-top="true"
        @click-left="back"
      >
        <template #left>
          <img class="back_btn" src="../../images/search_back.png" alt="" />
        </template>
        <template #right>
          <img
            class="icon-search"
            @click="toSearch"
            src="../../images/icon_input_search.png"
            alt=""
          />
        </template>
      </NavBar>
    </van-sticky>
    <div style="width: 100%; height: 10px; background-color: #f5f5f5"></div>
    <!--  -->
    <van-collapse v-model="activeNames" v-if="isData" @change="collapseChange">
      <van-collapse-item name="ContactsFollowMembersClick">
        <template #title>
          <div>
            关注 <span>（{{ list.followCount }}）</span>
          </div>
        </template>
        <div class="contact-box">
          <div
            class="contact"
            v-for="(item, index) in list.follow"
            :key="index"
            @click="goProfile(item.contactId, item.careerLevelCode)"
          >
            <div class="contact-icon">
              <img
                class="avatar"
                :src="
                  `https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${item.contactId}/avatar?size=60`
                "
                alt=""
                width="100%"
              />
            </div>
            <div class="contact-peo">
              <div class="contact-peo-name">{{ item.name }}</div>
              <div class="contact-peo-list">
                <span>{{ item.careerLevelCode }}</span>
                <span class="line"></span>
                <span>{{ item.activityStatusCode }}</span>
                <span class="line"></span>
                <span>绩效 ¥{{ item.currentMonthProduction }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item name="ContactsAreaMembersClick">
        <template #title>
          <div>
            管理区域成员 <span>（{{ list.areaCount }}）</span>
          </div>
        </template>
        <!--  -->
        <div class="contact-box">
          <div
            class="contact"
            v-for="(item, index) in list.area"
            :key="index"
            @click="goProfile(item.contactId, item.careerLevelCode)"
          >
            <div class="contact-icon">
              <img
                class="avatar"
                :src="
                  `https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${item.contactId}/avatar?size=60`
                "
                alt=""
                width="100%"
              />
            </div>
            <div class="contact-peo">
              <div class="contact-peo-name">{{ item.name }}</div>
              <div class="contact-peo-list">
                <span>{{ item.careerLevelCode }}</span>
                <span class="line"></span>
                <span>{{ item.activityStatusCode }}</span>
                <span class="line"></span>
                <span>绩效 ¥{{ item.currentMonthProduction }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item name="ContactsDIQDetailsContactsClick">
        <template #title>
          <div>
            DIQ <span>（{{ list.diqCount }}）</span>
          </div>
        </template>
        <div class="contact-box">
          <div
            class="contact"
            v-for="(item, index) in list.diq"
            :key="index"
            @click="goProfile(item.contactId, item.careerLevelCode)"
          >
            <div class="contact-icon">
              <img
                class="avatar"
                :src="
                  `https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${item.contactId}/avatar?size=60`
                "
                alt=""
                width="100%"
              />
            </div>
            <div class="contact-peo">
              <div class="contact-peo-name">{{ item.name }}</div>
              <div class="contact-peo-list">
                <span>{{ item.careerLevelCode }}</span>
                <span class="line"></span>
                <span>{{ item.activityStatusCode }}</span>
                <span class="line"></span>
                <span>绩效 ¥{{ item.currentMonthProduction }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item name="ContactsUnitMembersClick">
        <template #title>
          <div>
            沙龙成员 <span>（{{ list.unitCount }}）</span>
          </div>
        </template>
        <div class="contact-box">
          <div
            class="contact"
            v-for="(item, index) in list.unit"
            :key="index"
            @click="goProfile(item.contactId, item.careerLevelCode)"
          >
            <div class="contact-icon">
              <img
                class="avatar"
                :src="
                  `https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${item.contactId}/avatar?size=60`
                "
                alt=""
                width="100%"
              />
            </div>
            <div class="contact-peo">
              <div class="contact-peo-name">{{ item.name }}</div>
              <div class="contact-peo-list">
                <span>{{ item.careerLevelCode }}</span>
                <span class="line"></span>
                <span>{{ item.activityStatusCode }}</span>
                <span class="line"></span>
                <span>绩效 ¥{{ item.currentMonthProduction }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item name="ContactsConsultantClick">
        <template #title>
          <div>
            美容顾问 <span>（{{ list.teamCount }}）</span>
          </div>
        </template>
        <div class="contact-box">
          <div
            class="contact"
            v-for="(item, index) in list.team"
            :key="index"
            @click="goProfile(item.contactId, item.careerLevelCode)"
          >
            <div class="contact-icon">
              <img
                class="avatar"
                :src="
                  `https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${item.contactId}/avatar?size=60`
                "
                alt=""
                width="100%"
              />
            </div>
            <div class="contact-peo">
              <div class="contact-peo-name">{{ item.name }}</div>
              <div class="contact-peo-list">
                <span>{{ item.careerLevelCode }}</span>
                <span class="line"></span>
                <span>{{ item.activityStatusCode }}</span>
                <span class="line"></span>
                <span>绩效 ¥{{ item.currentMonthProduction }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>

    <div class="no-data" v-else>暂无联系人数据</div>
  </div>
</template>
<script>
import {
  Search,
  Button,
  Icon,
  ActionSheet,
  NavBar,
  Dialog,
  Collapse,
  CollapseItem,
  Sticky,
} from "vant";
import {
  isIos,
  closeWebview,
  xxxxxx,
  formatMoney,
  deepCopy,
  isIphoneX,
} from "../../utils/index";

export default {
  data() {
    return {
      list: {},
      isIphoneX: isIphoneX(),
      isIos: isIos(),
      filter: {
        search: "",
      },
      activeNames: [""],
      isData: true,
      impersonatedContactId: "",
    };
  },
  mounted() {
    this.loadAll();
  },
  methods: {
    toSearch() {
      // contact_search
      let url = `${window.location.origin}/contact_search`;
      const params = {
        opaque: false,
        targetContactId: this.$ctx.targetContactId,
      };
      this.$go(url, params);
    },
    collapseChange(activeNames) {
      let name = deepCopy(activeNames).pop();
      this.$track({
        context: "ButtonTab",
        behavior: name,
        item_type: "ButtonTab",
        item_id: name,
      });
    },
    onSearch() {
      console.log(this.filter);
      this.loadAll();
    },
    goBir() {
      this.$jsBridge.openSchema(
        `mk:///Intouch?appId=MyContacts&pageId=myContactsBirth`
      );
    },

    back() {
      closeWebview();
    },
    goProfile(id, levelCode) {
      let url = `${window.location.origin}/profile`;
      const params = {
        opaque: false,
        targetContactId: id,
        levelCode: levelCode,
          //跟进人
            followed:this.$route.query.targetContactId
      };

      this.$go(url, params);
    },
    async loadAll() {
      let baseApi = this.$ctx.baseApiList.contact;
      this.impersonatedContactId = this.$ctx.targetContactId;
      const params = {
        search: this.filter.search,
      };

      const res = await this.$request.get(`${baseApi}/members`, {
        headers: {
          impersonatedContactId: this.impersonatedContactId,
        },
        params,
      });
      console.log("res", res.data);
      this.list = res.data;
      this.list.followCount = res.data.follow.length;
      this.list.areaCount = res.data.area.length;
      this.list.diqCount = res.data.diq.length;
      this.list.unitCount = res.data.unit.length;
      this.list.diqUnitCount = res.data.diqUnit.length;
      this.list.teamCount = res.data.team.length;
      if (
        this.list.followCount +
          this.list.areaCount +
          this.list.diqCount +
          this.list.unitCount +
          this.list.teamCount >
        0
      ) {
        this.isData = true;
      } else {
        this.isData = false;
      }
    },
  },
  components: {
    "van-search": Search,
    "van-collapse": Collapse,
    "van-collapse-item": CollapseItem,
    NavBar,
    "van-sticky": Sticky,
  },
};
</script>
<style lang="less" scoped>
/deep/.van-collapse-item__content {
  padding: 8px 30px;
}
/deep/ .van-cell__title {
  font-size: 30px;
}
/deep/.van-cell__title span {
  font-size: 30px;
  color: #7f7f7f;
}
/deep/.van-cell {
  padding: 29px 30px;
}
/deep/.van-collapse-item--border:after {
  right: 0px;
  left: 0px;
}
/deep/.van-cell:after {
  border: 0px;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-top: 5px;
}
.contact {
  display: flex;
  margin-top: 5px;
  margin-bottom: 10px;
  &-icon {
    width: 80px;

    margin-right: 30px;
  }
  &-peo {
    width: 100%;
    border-bottom: 1px solid #e1e1e1;
    padding-bottom: 10px;
    &-name {
      color: black;
      font-size: 30px;
      padding-top: 5px;
    }
    &-list {
      margin-top: 5px;
      font-size: 26px;
    }
  }
}
.line {
  width: 1px;
  height: 20px;
  background: #ccc;
  margin: 0px 10px;
  display: inline-block;
}
.no-data {
  text-align: center;
  font-size: 30px;
  margin-top: 100px;
  color: #909399;
}
.isIphoneX {
  margin-top: 80px;
}
.goBir img {
  width: 69px;
  height: 70px;
}
.contact-box > .contact:last-child > .contact-peo {
  border-bottom: 0px;
}
.van-cell__right-icon {
  margin-right: 15px;
}
.isAndroid {
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
/deep/.van-nav-bar {
  // background-color: #EE4D9B;
  z-index: 4;
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
      }
    }
  }
  .van-nav-bar__title {
    // color: #fff;
    // font-size: 30px;
  }
}
</style>
