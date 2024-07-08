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
        v-model.trim="filter.search"
        show-action
        placeholder="请输入姓名/直销员编号"
        @search="onSearch"
        @cancel="onCancel"
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
    <div class="search-result" v-show="tableData.data.length">
      <List
        :finished="finished"
        v-model="loading"
        :finished-text="
          tableData.data && tableData.data.length ? '没有更多了' : ''
        "
        @load="loadData"
      >
        <common-table
          id="table-content"
          ref="teamTable"
          :border="false"
          :setClassName="setClassName"
          :tableData="tableData"
          @sortChange="sortChange"
          @cellClick="cellClick"
        >
          <el-table-column
            key="1"
            :label="'顾问' + '\n' + '姓名'"
            fixed="left"
            align="center"
            width="70px"
            header-align="center"
          >
            <template slot-scope="{ row }">
              <div>
                <div class="name team_name" @click="handleClickAvatar(row)">
                  {{ row.name }}
                </div>
                <div class="tags">
                  <span class="level">{{ row.careerLevelCode }}</span>
                  <span class="status">{{ row.activityStatusCode }}</span>
                  <span class="self" v-if="row.contactId == targetContactId"
                    >本人</span
                  >
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            key="2"
            label="管理区域"
            slot="between"
            prop="offSpringLineNumber"
            align="center"
            header-align="center"
            sortable="custom"
            :sort-orders="['descending', 'ascending', null]"
            v-if="this.type == '1'"
          >
            <template slot-scope="{ row }">
              {{ row.offSpringLineNumber }}
            </template>
          </el-table-column>

          <el-table-column
            :label="'辅导' + '\n' + '姓名'"
            align="center"
            width="70px"
            header-align="center"
            v-if="this.type == '1' || this.type == '2'"
          >
            <template slot-scope="{ row }">
              <div v-if="row.recruiterName" @click="handleClickAvatarrec(row)">
                <div class="name team_name">
                  {{ row.recruiterName }}
                </div>
                <div class="tags">
                  <span class="level">{{ row.recruiterLevelCode }}</span>
                  <span class="status">{{ row.recruiterStatusCode }}</span>
                  <span
                    class="self"
                    v-if="row.contactId == row.recruiterContactId"
                    >本人</span
                  >
                </div>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
        </common-table>
      </List>
    </div>
    <click-avatar-action-sheet
      ref="clickAvatarActionSheet"
      :info="currentData"
      :selectInfo="selectInfo"
      @onSelect="onSelect"
    />
    <div class="no_data" v-if="isNoData">
      <div>
        <img class="table-empty__bg" src="../../images/nodata.png" alt="" />
      </div>
      未查询到<span class="is_active">“{{ keyword }}”</span>的数据
    </div>
  </div>
</template>

<script>
import { Search, List, Button, Icon, Dialog, Popup } from "vant";
import { isIos, closeWebview, formatMoney } from "../../utils/index";
import commonTable from "../../components/commonTable.vue";
import clickAvatarActionSheet from "../../components/clickAvatarActionSheet";

export default {
  data() {
    return {
      currentData: {},
      isNoData: false,
      loading: true,
      finished: false,
      tableData: {
        header: [
          {
            label: "最近\n跟进",
            prop: "followDate",
            sortable: "custom",
            formatter: (row) => {
              return row.followDate ? row.followDate : "-";
            },
          },
          {
            label: "事件\n提醒",

            prop: "remindDate",
            sortable: "custom",
            formatter: (row) => {
              return row.remindDate ? row.remindDate : "-";
            },
          },
        ],
        data: [],
      },
      keyword: "",
      selectInfo: "note",
      filter: {
        pageSize: 20,
        pageNo: 1,
        type: "1",
        sortEnum: "REMINDDATE",
        orderEnum: "DESC",
        search: "",
      },
      type: "",
      targetContactId: "",
    };
  },
  mounted() {
    this.filter.type = this.$route.query.type;
    this.targetContactId = this.$route.query.targetContactId;
    this.type = this.$route.query.type;
  },
  methods: {
    goNote() {
      let native = window.__INITIAL_STATE__.env;
      var url = "";
      //正式发布删除
      if (native == "prod") {
        url = "https://xxxxxxx-stag-latest.prod.pcf.mkc.io/note";
      } else {
        url = `${window.location.origin}/note`;
      }
      //let url = `${window.location.origin}/note`;
      const params = {
        opaque: false,
        targetContactId: this.currentData.contactId,
        levelCode: this.currentData.careerLevelCode,
        name: this.currentData.name,
        //跟进人
        followed: this.$route.query.targetContactId,
      };
      this.$go(url, params);
    },
    goProflie() {
      let native = window.__INITIAL_STATE__.env;
      var url = "";
      //正式发布删除
      if (native == "prod") {
        url = "https://xxxxxxx-stag-latest.prod.pcf.mkc.io/profile";
      } else {
        url = `${window.location.origin}/profile`;
      }
      //let url = `${window.location.origin}/profile`;
      const params = {
        opaque: false,
        targetContactId: this.currentData.contactId,
        levelCode: this.currentData.careerLevelCode,
        //跟进人
        followed: this.$route.query.targetContactId,
      };
      this.$go(url, params);
    },
    async onSelect(item) {
      //console.log(item);
      switch (item.prop) {
        case "profile": //个人详情
          this.goProflie();
          break;
        case "goNote": //列表
          this.goNote();
          break;
        case "call": //拨打电话
          window.location.href = `tel:${this.currentData.mobile}`;
          break;
      }
      this.$refs.clickAvatarActionSheet.show = false;
    },
    handleClickAvatar(row) {
      this.currentData = row;
      console.log("row", row);
      this.$nextTick(() => {
        this.$refs.clickAvatarActionSheet.showActions();
      });
    },
    handleClickAvatarrec(row) {
      this.currentData.contactId = row.recruiterContactId;
      this.currentData.careerLevelCode = row.recruiterLevelCode;
      this.currentData.mobile = row.recruiterMobile;
      this.$nextTick(() => {
        this.$refs.clickAvatarActionSheet.showActions();
      });
    },
    sortMap(prop) {
      let propMap = {
        offSpringLineNumber: "OFFSPRINGLINENUMBER",
        followDate: "FOLLOWDATE",
        remindDate: "REMINDDATE",
      };
      return propMap[prop];
    },
    sortChange({ column, prop, order }) {
      console.log("调用");
      if (order) {
        if (order === "descending") {
          order = "desc";
        } else if (order === "ascending") {
          order = "asc";
        }
        this.filter.sortEnum = this.sortMap(prop);
        this.filter.orderEnum = order.toLocaleUpperCase();
      } else {
        this.filter.sortEnum = null;
        this.filter.orderEnum = null;
      }
      this.tableData.data = [];
      this.filter.pageNo = 1;
      this.loadData();
    },
    onSearch(search) {
      this.filter.search = search;
      this.filter.pageNo = 1;
      this.tableData.data = [];
      this.loadData();
    },
    back() {
      closeWebview();
    },
    onCancel() {
      closeWebview();
    },
    callnomarl(mobile, name) {
      window.location.href = `tel:${mobile}`;
    },
    cellClick(data) {
      var params = {
        targetContactId: data.row.contactId,
        linkNote: true,
        name: data.row.name,
        levelCode: data.row.careerLevelCode,
        opaque: false,
        followed: this.$route.query.targetContactId,
      };
      var url = `${window.location.origin}/addNote`;

      if (
        data.column.property == "remindDate" &&
        data.row.remindDate != null &&
        data.row.remindDate != ""
      ) {
        params.noteId = data.row.remindNoteId;

        this.$go(url, params);
      } else if (
        data.column.property == "followDate" &&
        data.row.followDate != null &&
        data.row.followDate != ""
      ) {
        params.noteId = data.row.followNoteId;

        this.$go(url, params);
      }
    },
    setClassName({ row, column }) {
      if (
        (column.property == "followDate" &&
          row.followDate != "" &&
          row.followDate != null) ||
        (column.property == "remindDate" &&
          row.remindDate != "" &&
          row.remindDate != null)
      ) {
        return "date-name";
      }
    },
    async loadData() {
      let params = this.filter;

      let baseApi = this.$ctx.baseApi;
      // let baseApi = "https://mock.marykay.com.cn/mock/600/api/v1/notes/report";
      const res = await this.$request.get(`${baseApi}/notes/report`, {
        params,
      });
      if (!res.data.hasNextPage) {
        this.finished = true;
      } else {
        this.finished = false;
      }

      this.tableData.data = res.data.members;
      if (!this.tableData.data || !this.tableData.data.length) {
        this.isNoData = true;
        this.keyword = this.filter.search;
      } else {
        this.isNoData = false;
      }
      this.loading = false;
    },
  },
  components: {
    commonTable,
    clickAvatarActionSheet,
    List,
    "van-search": Search,
    "van-button": Button,
    "van-icon": Icon,
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
  .is_active {
    color: #fe88a0 !important;
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
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  .icon_crown {
    position: absolute;
    width: 32px;
    height: 30px;
    right: 36px;
    top: 12px;
  }
  .assess-performance {
    position: relative;
    display: inline-block;
    &-btn {
      padding: 0 12px;
      height: 44px;
      background-color: #fff7fd;
      color: #f16eae;
      font-size: 24px;
      border-color: #ffa7d2;
      border-radius: 9px;
      width: 150px;
    }
    &-tip {
      position: absolute;
      width: 24px;
      height: 24px;
      right: -10px;
      top: 0;
    }
  }
}
.popupmodel {
  background: none;
  /deep/ .van-popup__close-icon--top-right {
    right: 70px;
  }
}
.popupmodel {
  background-color: transparent;
}
.popbox {
  padding: 0 50px;
  .msg {
    position: relative;
    width: 590px;
    height: 268px;
    background-image: url("../../images/self.png");
    background-size: 100%;
    background-repeat: no-repeat;
    padding-top: 50px;
    span {
      position: relative;
      font-size: 36px;
    }
    img {
      width: 36px;
      height: 31px;
      position: absolute;
      left: 0;
      top: 0;
      transform: translate(-60%, -60%);
    }
  }
  .bottom {
    position: relative;
    height: 99px;
    img {
      width: 128px;
      height: 99px;
      position: absolute;
      right: 0;
      bottom: 50%;
      transform: translateX(50px);
    }
  }
  &-title {
    font-size: 36px;
    text-align: center;
    margin: 0 auto;
    color: #541b5a;
    line-height: 1;
  }
  &-mes {
    font-size: 26px;
    padding: 0 37px 0 45px;
    color: #333333;
    margin-top: 36px;
    color: #333333;
    line-height: 44px;
  }
}
.tags {
  font-size: 0;
  transform: scale(0.71);
  display: flex;
  justify-content: center;
  span {
    width: 40px;
    height: 26px;
    line-height: 26px;
    display: inline-block;
    text-align: center;
    font-size: 20px;
  }
  .level {
    background-color: rgba(241, 110, 159, 0.15);
    color: #f16e9f;
  }
  .status {
    background-color: rgba(110, 116, 241, 0.15);
    color: #8288f5;
    margin-left: 3px;
  }
  .self {
    background-color: rgba(255, 107, 40, 0.15);
    color: #ff783c;
    width: 60px;
    margin-left: 3px;
  }
}
.name {
  display: inline-block;
  width: 120px;
  font-size: 26px;
  font-weight: 500;
  color: #333333;
  white-space: normal;
  img {
    width: 20px;
    margin-left: 5px;
  }
}

/deep/.date-name .cell span {
  color: #f16e9f;
}
// /deep/.van-action-sheet {
//   height: 340px !important;
//   box-sizing: border-box;
//   max-height: 340px !important;
//   padding-bottom: 15px !important;

// }
</style>