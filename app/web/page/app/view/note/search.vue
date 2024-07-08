<template>
  <div class="search-wrap">
    <div class="search-bar">
      <img
        class="back_btn"
        @click="back"
        src="../../images/search_back.png"
        alt=""
      />
      <van-search
        v-model.trim="filter.keywords"
        @cancel="onCancel"
        @search="onSearch"
        show-action
        placeholder="请输入"
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
    </div>
    <div>
      <div class="">
        <div
          class="search"
          v-for="item in this.noteList"
          @click="goNoteInfo(item)"
        >
          <div class="search-date">
            <span class="today" v-if="item.labelType == 1">今天</span>
            <span class="last" v-if="item.labelType == 3">过去</span>
            <span class="future" v-if="item.labelType == 2">将来</span>
          </div>
          <div class="search-info">
            <div class="search-info-mes">
              {{ item.noteContent }}
            </div>
            <div class="search-info-date">{{ item.noteDate }}</div>
          </div>
        </div>
      </div>
    </div>
     <div class="no_data" v-if="isNoData">
      <div>
        <img class="table-empty__bg" src="../../images/nodata.png" alt="" />
      </div>
      未查询到<span class="is_active">“{{ this.keyword }}”</span>的数据
    </div>
   
  </div>
</template>

<script>
import { Search, List, Button, Icon, Dialog, Popup } from "vant";
import { isIos, closeWebview, formatMoney } from "../../utils/index";
export default {
  data() {
    return {
      noteList: [],
      isNoData:false,
      finished: false,
      loading: true,
      keyword:'',
      filter: {
        pageSize: 500,
        pageNo: 1,
        followContactId: "",
        keywords:'',
      },
    };
  },
  methods: {
    back() {
      closeWebview();
    },
    onCancel() {
      this.noteList = [];
    },
    onSearch() {
      this.loadData();
    },
    goNoteInfo(item) {
      let url = `${window.location.origin}/addNote`;
      let params = {
        noteId: item.noteId,
        targetContactId: this.$route.query.targetContactId,
        followed: this.$route.query.followed,
        opaque: false,
      };
      this.$go(url, params);
      console.log(item, "11");
    },
    async loadData() {
      this.noteList = [];
      let baseApi = this.$ctx.baseApi;
      let params = this.filter;
      params.contactId = this.$route.query.followed;

      params.followContactId = this.$route.query.targetContactId;
      params.contactId=this.$route.query.followed
      console.log("parmam", params);
      const { data } = await this.$request.get(`${baseApi}/notes`, {
        params,
      });

      if (!data.hasNextPage) {
        this.finished = true;
      } else {
        this.finished = false;
      }
      let list = data.notes;
      console.log("list", list);
      this.noteList = this.noteList.concat(list);
      console.log("noteList", this.noteList);
      for (let i in this.noteList) {
        this.noteList[i].noteDate = this.noteList[i].noteDate
          .replace(/-/g, "/")
          .substring(this.noteList[i].noteDate.length - 5);
      }
       if (this.noteList && this.noteList.length>0) {
        this.isNoData = false;
       
      } else {
          this.keyword = this.filter.keywords;
        this.isNoData = true;
       
      }
      //this.filter.pageNo = this.filter.pageNo + 1;
      this.loading = false;
    },
  },
  components: {
    List,
    "van-search": Search,
    "van-button": Button,
    "van-icon": Icon,

    "van-popup": Popup,
  },
};
</script>

<style lang="less" scoped>
.search-wrap {
  .search-bar {
    display: flex;
    align-items: center;
    width: 100%;
    .back_btn {
      width: 20px;
      height: 36px;
      margin-left: 42px;
    }
    .van-search__content {
      display: flex;
      align-items: center;
      height: 70px;
      width: 568px;
      background-color: #f5f5f5;
      border-radius: 35px;
      /deep/.van-field__control {
        font-size: 30px;
      }
    }
  }
  .search-bar .search-bar__btn {
    width: 15.47vw;
    text-align: center;
  }
}
.search {
  display: flex;
  padding: 0px 20px;

  &-date {
    width: 15%;
    text-align: center;
    padding: 20px 0px;

    span {
      display: block;
      text-align: center;
      border-radius: 10px;
      width: 71px;
      font-size: 28px;
      height: 45px;
      line-height: 45px;
      margin: 0 auto;
    }
  }
  &-info {
    display: flex;
    margin-left: 10px;
    width: 85%;
    padding: 20px 0px;
    border-bottom: 1px solid #e1e1e1;
    justify-content: space-around;

    &-mes {
      width: 70%;
      font-size: 28px;
      font-weight: 500;
      color: #484848;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &-date {
      color: #f16eae;
    }
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
.today {
  background: #ffecec;
  color: #f483b8;
}
.last {
  background: #f5f5f5;
  color: #7f7f7f;
}
.future {
  background: #edecff;
  color: #836ef2;
}
</style>