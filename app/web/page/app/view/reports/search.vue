<template>
  <div class="page-wrap" :class="{ isAndroid: !isIos }">
    <NavBar
      left-text="返回"
      fixed
      title="竞赛报表搜索"
      :border="false"
      :safe-area-inset-top="true"
      @click-left="back"
    >
      <template #left>
        <img class="back_btn" src="../../images/index/icon_back.png" alt="" />
      </template>
    </NavBar>
    <div class="page-wrap-content">
      <van-search
        v-model="filter.searchStr"
        placeholder="请输入12位编号或姓名查找"
        @click="handleClick"
        @search="onSearch"
      >
      </van-search>
      <van-skeleton title :row="3" :loading="loading && !consultantList.length">
        <List
          :finished="finished"
          v-model="loading"
          :finished-text="
            consultantList && consultantList.length ? '没有更多了' : ''
          "
          @load="loadData"
        >
          <div class="members" v-show="consultantList.length">
            <!-- <div class="members-group-title">80级以上顾问名单</div> -->
            <div
              v-for="(row, index) in consultantList"
              :key="`member_${index}`"
              class="members-item"
              @click="toNextPage(row)"
            >
              <van-image
                class="avatar"
                fit="cover"
                :src="
                  `https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${row.contactId}/avatar?size=60`
                "
              />
              <div class="members-item-right">
                <div>
                  <span class="name"
                    >{{ row.lastName }}{{ row.firstName }}</span
                  >
                  <span class="level">{{ row.currentCareerLevelCode }}</span>
                </div>
                <span class="area"
                  >{{ row.nsdLastName }}{{ row.nsdFirstName }}</span
                >
              </div>
            </div>
          </div>
        </List>
      </van-skeleton>
      <div class="no_data" v-show="isNoData">
        <div>
          <img class="table-empty__bg" src="../../images/nodata.png" alt="" />
        </div>
        未查询到<span class="is_active">“{{ searchStr }}”</span>的数据
      </div>
    </div>
  </div>
</template>
<script>
import { NavBar, Search, Image, Skeleton, List } from "vant";
import { isIos, closeWebview, xxxxxx } from "../../utils/index";
export default {
  data() {
    return {
      isIos: isIos(),
      members: [],
      consultantList: [],
      filter: {
        pageNo: 1,
        pageSize: 20,
        searchStr: "",
      },
      finished: false,
      loading: true,
      monthKey: null,
      searchStr: "",
      isNoData: false,
    };
  },
  components: {
    NavBar,
    List,
    "van-search": Search,
    "van-image": Image,
    "van-skeleton": Skeleton,
  },
  async created() {
    let api = this.$ctx.baseApi;
    const { data } = await this.$request.get(`${api}/monthkey`);
    this.monthKey = data;
    // this.initPage()
    this.getEmployeeAccounts();
  },
  methods: {
    back() {
      this.$track({
        context: "StaffHomePage",
        behavior: "ContestReportCancelSearchClick",
        item_type: "StaffHomePage",
        item_id: "ContestReportCancelSearchClick",
      });
      closeWebview();
    },
    // async initPage() {
    //   let api = this.$ctx.baseApi
    //   try {
    //     const { data } = await this.$request.get(`${api}/employees/role`)
    //     console.log('employees/role', data)
    //     const { isAdmin, isEmployee } = data
    //     if(isAdmin){
    //       this.getEmployeeAccounts()
    //     } else if (isEmployee) {
    //       this.$router.push({
    //         path: '/operation',
    //         query: {
    //           monthKey: this.monthKey
    //         }
    //       })
    //     } else {
    //       this.loading = false
    //       this.$toast("您没有查看权限!")
    //       // closeWebview()
    //     }
    //   } catch (error){
    //     this.getEmployeeAccounts()
    //   }
    // },
    async getEmployeeAccounts() {
      let api = this.$ctx.baseApi;
      const params = this.filter;
      const {
        data,
      } = await this.$request.get(
        `${api}/employees/${this.$route.query.targetContactId}/consultants`,
        { params }
      );
      this.loading = false;
      this.consultantList = data.data.consultantList;

      if (!this.consultantList.length) {
        this.searchStr = this.filter.searchStr;
        this.isNoData = true;
      } else {
        this.isNoData = false;
      }
    },
    async loadData() {
      let api = this.$ctx.baseApi;
      const params = this.filter;
      const {
        data,
      } = await this.$request.get(
        `${api}/employees/${this.$route.query.targetContactId}/consultants`,
        { params }
      );
      this.total = data.data.totalCount;
      this.loading = false;
      if (!data.data.hasNextPage) {
        this.finished = true;
      } else {
        this.finished = false;
      }
      this.consultantList = this.consultantList.concat(
        data.data.consultantList
      );
      this.filter.pageNo = this.filter.pageNo + 1;
    },
    handleClick() {
      this.$track({
        context: "StaffHomePage",
        behavior: "ContestReportSearchIconClick",
        item_type: "StaffHomePage",
        item_id: "ContestReportSearchIconClick",
      });
    },
    onSearch() {
      this.$track({
        context: "StaffHomePage",
        behavior: "ContestReportSearchIconClick",
        item_type: "StaffHomePage",
        item_id: "ContestReportSearchIconClick",
        attributes: {
          search_content: this.filter.searchStr,
        },
      });
      this.filter.pageNo = 1;
      this.consultantList = [];
      this.getEmployeeAccounts();
    },
    toNextPage(row) {
      this.$track({
        context: "StaffHomePage",
        behavior: "ContestReportHeadPortraitClick",
        item_type: "StaffHomePage",
        item_id: "ContestReportHeadPortraitClick",
      });
      this.$jsBridge.openSchema(
        `mk:///Intouch?appId=MyReport&pageId=index&title=报表&contactId=${row.contactId}`
      );
    },
  },
};
</script>
<style lang="less" scoped>
.page-wrap {
  // background-color: #F5F5F5;
  min-height: 100vh;
  &-content {
    padding-top: env(safe-area-inset-top);
    margin-top: 80px;
    .members {
      // padding: 30px;
      // padding-top: 0;
      &-item {
        display: flex;
        align-items: center;
        padding: 10px 0;
        font-size: 32px;
        color: #333;
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 18px 0 30px;
        }
        &-right {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-grow: 1;
          border-bottom: 1px solid #e7e7e7;
          height: 100px;
          .level {
            font-size: 28px;
            color: #9f9f9f;
            margin-left: 20px;
          }
          .area {
            font-size: 28px;
            color: #9f9f9f;
            margin-right: 48px;
          }
        }
      }
    }
    .members-group-title {
      font-size: 32px;
      line-height: 70px;
      color: #333;
      background-color: #f5f5f5;
      padding: 0 30px;
    }
  }
  .no_data {
    padding: 10vw;
    text-align: center;
    color: #909399;
  }
  .no_data .table-empty__bg {
    width: 53vw;
    height: 32vw;
    background-repeat: round;
    background-size: cover;
  }
}
.isAndroid {
  .page-wrap-content {
    margin-top: 135px;
  }
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
/deep/ .van-search {
  // padding: 0;
  .van-search__content {
    color: #7f7f7f;
    background-color: #f5f5f5;
    border-radius: 35px;
    padding: 0 26px;
    .van-icon {
      color: #b0b0b4;
    }
    .van-icon-search {
      font-size: 28px;
      color: #b0b0b4;
    }
  }
}
/deep/ .van-nav-bar {
  background-color: #ee4d9b;
  .van-nav-bar__content {
    height: 80px;
  }
  .van-nav-bar__left {
    .back_btn {
      width: 17px;
      height: 32px;
    }
  }
  .van-nav-bar__title {
    color: #fff;
    font-size: 30px;
  }
}
</style>
