<template>
  <div class="newcomers-plan-search">
    <NavBar title="首席认可报表" left-arrow @click-left="back">
      <template #left>
        <img class="back_btn" src="../../images/search_back.png" alt="" />
      </template>
    </NavBar>
    <Search
      v-model="filter.searchName"
      show-action
      placeholder="请输入顾问姓名或顾问编号"
      @search="onSearch"
      @cancel="onCancel"
      @clear="onClear"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </Search>
    <template
      v-if="(filter.searchName && tableData.length > 0) || tableData.length > 0"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getData"
      >
        <Table :tableData="tableData"></Table>
      </van-list>
    </template>
    <template v-if="filter.searchName && tableData.length <= 0">
      <p class="is-empty">暂无数据</p>
    </template>
  </div>
</template>

<script>
import { Search, NavBar, Toast, List } from "vant";
import { closeWebview, createQuery } from "../../utils/index";
import Table from "../../components/chiefTable/table.vue";

export default {
  components: { Search, NavBar, Table, Toast, "van-list": List },
  data() {
    return {
      ImpersonatedContactID: "",
      pageSize: 20,
      refreshing: false,
      finished: false,
      loading: false,
      tableData: [],
      filter: {
        pageNo: 1,
        monthKey: null,
        searchName: null,
      },
    };
  },
  created() {
    this.ImpersonatedContactID = this.$route.query.ImpersonatedContactID;
    this.filter.monthKey = this.$route.query.monthKey;
  },
  methods: {
    onClear() {
      this.filter.searchName = "";
    },
    onSearch(keyWord) {
      this.filter.pageNo = 1;
      this.tableData = [];
      this.getData();
    },
    async getData() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      this.loading = true;
      let chieftApi = this.$ctx.baseApiList.income;
      const params = createQuery(this.filter);
      const { data } = await this.$request.get(
        `${chieftApi}/nsdapprovals/consultants?${params}`
      );
      this.tableData = this.tableData.concat(data.members || []);
      this.finished = !data.hasNextPage;
      this.filter.pageNo = data.pageNo + 1;
      this.loading = false;
      this.refreshing = false;
      // table数据更新后会直接滚动到页面底部导致一直触发load事件
      window.scrollTo(0, scrollTop);
    },
    onCancel() {
      closeWebview();
    },
    back() {
      closeWebview();
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  .van-nav-bar__content {
    height: 80px;
    .van-nav-bar__left {
      .back_btn {
        width: 17px;
        height: 32px;
      }
    }
  }
}
/deep/.van-search__content {
  border-radius: 17px;
}
.is-empty {
  text-align: center;
  font-size: 14px;
  padding-top: 20px;
}
</style>
