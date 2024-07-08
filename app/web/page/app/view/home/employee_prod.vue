<template>
  <div class="page-wrap" :class="{ isAndroid: !isIos }">
    <NavBar
      left-text="返回"
      fixed
      title="我的教练业务查询"
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
        placeholder="请输入姓名/12位编号搜索"
        @search="onSearch"
        class="table-search"
      >
        <template #left-icon>
          <img
            class="icon-input-search"
            src="../../images/icon_input_search.png"
            alt=""
          />
        </template>
      </van-search>
      <van-skeleton
        title
        :row="3"
        :loading="loading && !employeeList.length && !consultantList.length"
      >
        <div></div>
        <div class="members" v-if="employeeList.length">
          <div class="members-group-title">员工账号名单</div>
          <div
            v-for="(row, index) in employeeList"
            :key="`member_${index}`"
            class="members-item"
            @click="toNextPage(row, 'employee')"
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
                  >{{ row.consultantLastName
                  }}{{ row.consultantFirstName }}</span
                >
                <span class="level">{{ row.careerLevelCode }}</span>
              </div>
              <span class="area">{{ row.nsdName }}</span>
            </div>
          </div>
        </div>
        <List
          :finished="finished"
          v-model="loading"
          :finished-text="
            consultantList && consultantList.length ? '没有更多了' : ''
          "
          @load="loadData"
        >
          <div class="members" v-if="consultantList.length">
            <div class="members-group-title">顾问名单</div>
            <div
              v-for="(row, index) in consultantList"
              :key="`member_${index}`"
              class="members-item"
              @click="toNextPage(row, 'consultant')"
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
                    >{{ row.consultantLastName
                    }}{{ row.consultantFirstName }}</span
                  >
                  <span class="level">{{ row.careerLevelCode }}</span>
                </div>
                <span class="area">{{ row.nsdName }}</span>
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
import storage from "good-storage";
export default {
  data() {
    return {
      isIos: isIos(),
      members: [],
      employeeList: [],
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
      isEmployee: false,
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
    this.initPage();
  },
  methods: {
    back() {
      closeWebview();
    },
    async initPage() {
      let api = this.$ctx.baseApi;
      try {
        const { data } = await this.$request.get(`${api}/employees/role`);
        console.log("employees/role", data);
        const { isAdmin, isEmployee } = data;
        this.isEmployee = isEmployee;
        if (isAdmin) {
          this.getEmployeeAccounts();
        } else if (isEmployee) {
          this.$router.push({
            path: "/operation",
            query: {
              monthKey: this.monthKey,
            },
          });
        } else {
          this.loading = false;
          this.$toast({
            message: "您没有查看权限!",
            duration: 0,
          });
          // closeWebview()
        }
      } catch (error) {
        this.getEmployeeAccounts();
      }
    },
    async getEmployeeAccounts() {
      let api = this.$ctx.baseApi;
      const params = this.filter;
      const { data } = await this.$request.get(`${api}/employees/accounts`, {
        params,
      });
      console.log("employees/role", data);
      this.loading = false;
      this.employeeList = data.employeeList;
      this.consultantList = data.consultantInfo.consultantList;

      if (!(this.employeeList.length || this.consultantList.length)) {
        this.searchStr = this.filter.searchStr;
        this.isNoData = true;
      } else {
        this.isNoData = false;
      }
    },
    async loadData() {
      let api = this.$ctx.baseApi;
      const params = this.filter;
      const { data } = await this.$request.get(`${api}/employees/accounts`, {
        params,
      });
      this.total = data.total;
      this.loading = false;
      if (!data.consultantInfo.hasNextPage) {
        this.finished = true;
      } else {
        this.finished = false;
      }
      this.consultantList = this.consultantList.concat(
        data.consultantInfo.consultantList
      );
      this.filter.pageNo = this.filter.pageNo + 1;
    },
    async onSearch() {
      this.$jsBridge.startBusy();
      this.filter.pageNo = 1;
      this.employeeList = [];
      this.consultantList = [];
      let api = this.$ctx.baseApi;
      const params = this.filter;
      const { data } = await this.$request.get(`${api}/employees/accounts`, {
        params,
      });
      console.log("employees/role", data);
      this.$jsBridge.stopBusy();
      this.loading = false;
      if (!data.consultantInfo.hasNextPage) {
        this.finished = true;
      } else {
        this.finished = false;
      }
      this.employeeList = data.employeeList;
      this.consultantList = data.consultantInfo.consultantList;
      this.filter.pageNo = this.filter.pageNo + 1;

      if (!(this.employeeList.length || this.consultantList.length)) {
        this.searchStr = this.filter.searchStr;
        this.isNoData = true;
      } else {
        this.isNoData = false;
      }
    },
    toNextPage(row, type) {
      storage.set("ContactId", row.contactId);
      let url = `${window.location.origin}/home`;
      const params = {
        opaque: false,
        levelCode: row.careerLevelCode,
        targetContactId: row.contactId,
        ImpersonatedContactID: row.contactId,
        monthKey: this.monthKey,
        isEmployee: false,
      };
      if (type === "employee") {
        params.consultantName = `${row.consultantLastName}${row.consultantFirstName}`;
        params.isEmployee = true;
        url = `${window.location.origin}/operation`;
      }
      this.$go(url, params);
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
