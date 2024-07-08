<template>
  <div class="coach-home" :class="{ isAndroid: !isIos }">
    <div class="coach-home-content">
      <van-sticky>
        <NavBar
          left-text="返回"
          title="教练笔记跟进"
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
          <template #right>
            <img
              class="icon-search"
              src="../../images/index/icon_search.png"
              alt=""
              @click="goSearch()"
            />
          </template>
        </NavBar>
      </van-sticky>
      <Tabs
        ref="tabs"
        v-model="currentTabName"
        @click="setTableHeader()"
        v-if="this.showNav"
      >
        <Tab title="管理区域" name="area" v-if="this.levelCode >= 70"></Tab>
        <Tab title="沙龙" name="unit" v-if="this.levelCode >= 60"></Tab>
        <Tab title="美容顾问" name="team"></Tab>
      </Tabs>
      <div class="unit-content-filter">
        <img class="icon" src="../../images/select.png" alt="" />
        <dropdowm-menu
          :filterConfig="filterConfig"
          :filter="filter"
          ref="filterAction"
          :total="total"
          @filterConfirm="filterConfirm"
        ></dropdowm-menu>
      </div>

      <List
        :finished="finished"
        v-model="loading"
        @load="loadData"
        :finished-text="
          tableData.data && tableData.data.length ? '没有更多了' : ''
        "
      >
        <common-table
          id="table-content"
          ref="teamTable"
          :border="false"
          :tableData="tableData"
          @sortChange="sortChange"
          :setClassName="setClassName"
          @cellClick="cellClick"
        >
          <el-table-column
            :label="'顾问' + '\n' + '姓名'"
            fixed="left"
            align="center"
            header-align="center"
            key="1"
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
            label="管理区域"
            slot="between"
            prop="offSpringLineNumber"
            align="center"
            header-align="center"
            sortable="custom"
            :sort-orders="['descending', 'ascending', null]"
            v-if="this.filter.type == '1'"
            key="2"
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
            v-if="this.filter.type == '1' || this.filter.type == '2'"
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
  </div>
</template>

<script>
import { Tab, Tabs, NavBar, Popup, Sticky, List, Button, Dialog } from "vant";
import horizontalScreen from "../../mixin/horizontalScreen";
import {
  isIos,
  isIphoneX,
  closeWebview,
  xxxxxx,
  formatMoney,
  createQuery,
} from "../../utils/index";
import dropdowmMenu from "../../components/filterActionSheet/dropdowmMenu.vue";
import commonTable from "../../components/commonTable.vue";
import clickAvatarActionSheet from "../../components/clickAvatarActionSheet";

export default {
  mixins: [horizontalScreen],
  data() {
    return {
      isIos: isIos(),
      currentTabName: "area",
      loading: true,
      currentData: {},
      selectInfo: "note",
      targetContactId: "",
      tableData: {
        data: [],
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
      },
      finished: false,
      total: 0,
      filterConfig: [],
      areaConfig: [
        {
          prop: "lineNumbers",
          label: "管理区域",
          multiple: true,
          options: [],
        },
        {
          prop: "statusCodeIds",
          label: "顾问状态",
          multiple: true,
          options: [],
        },
      ],
      teamConfig: [
        {
          prop: "statusCodeIds",
          label: "顾问状态",
          multiple: true,
          options: [],
        },
      ],
      showNav: true,
      levelCode: "",
      filter: {
        pageSize: 20,
        pageNo: 1,
        type: "1",
        sortEnum: "",
        orderEnum: "",
      },
    };
  },

  created() {
    this.$nextTick(() => {
      this.$refs.filterAction.initFilterConfig();
    });
    this.targetContactId = this.$route.query.targetContactId;
    this.levelCode = this.$route.query.levelCode;
    if (this.levelCode >= 70) {
      this.currentTabName == "area";
      this.filter.type = 1;
    } else if (this.levelCode >= 60 && this.levelCode < 70) {
      this.currentTabName == "unit";
      this.filter.type = 2;
    } else {
      this.currentTabName == "team";
      this.filter.type = 3;
      this.showNav = false;
    }
    console.log("this.currentTabName", this.currentTabName);
  },

  mounted() {
    this.$nextTick(() => {
      this.$refs.filterAction.initFilterConfig();
    });

    console.log("this.filter.type", this.filter.type);
    this.loadData();
    this.getFilterConditions();
  },
  methods: {
    goProflie() {
      //正式发布删除
      let native = window.__INITIAL_STATE__.env;
      var url = "";
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
    goNote() {
      let native = window.__INITIAL_STATE__.env;
      var url = "";
      //正式发布删除
      if (native == "prod") {
        url = "https://xxxxxxx-stag-latest.prod.pcf.mkc.io/note";
      } else {
        url = `${window.location.origin}/note`;
      }
      // let url = `${window.location.origin}/note`;
      console.log("native", native);
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
    goSearch() {
      let url = `${window.location.origin}/note_table_search`;
      const params = {
        type: this.filter.type,
        targetContactId: this.$route.query.targetContactId,
      };
      this.$go(url, params);
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
    filterConfirm(filter) {
      this.filter.pageNo = 1;
      this.filter = Object.assign(this.filter, filter);
      this.tableData.data = [];
      this.loadData();
    },
    callnomarl(mobile, name) {
      window.location.href = `tel:${mobile}`;
    },
    async loadData() {
      //调用
      console.log("调用");
      let params = this.filter;

      const { lineNumbers, statusCodeIds } = this.filter;
      console.log("lineNumbers", lineNumbers, "statusCodeIds", statusCodeIds);
      if (lineNumbers && lineNumbers.length > 0) {
        params.lineNumbers = lineNumbers.join(",");
      }

      if (statusCodeIds && statusCodeIds.length > 0) {
        params.statusCodeIds = statusCodeIds.join(",");
      }

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
      this.total = res.data.total;
      this.tableData.data = this.tableData.data.concat(res.data.members);

      this.filter.pageNo = this.filter.pageNo + 1;
      this.loading = false;
    },
    back() {
      closeWebview();
    },
    async getFilterConditions() {
      if (this.filter.type != "1") {
        this.filterConfig = this.teamConfig;
      } else {
        this.filterConfig = this.areaConfig;
      }
      let params = {
        type: this.filter.type,
      };
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(
        `${baseApi}/notes/report/filter-conditions`,
        { params }
      );
      this.total = data.total;
      console.log("筛选", data);
      const { lineNumbers } = data;
      const statusCodeIds = data.activityStatuses;
      this.filterConfig.forEach((o) => {
        if (o.prop === "lineNumbers" && lineNumbers) {
          o.options = lineNumbers.map((l) => ({
            name: `${l}`,
            value: `${l}`,
          }));
        }

        if (o.prop === "statusCodeIds" && statusCodeIds) {
          o.options = statusCodeIds.map((l) => ({
            name: `${l.activityStatusCode}(${l.dirCount})`,
            value: l.activityStatusId,
          }));
        }
      });
      console.log(this.filter, "offSpringLineNumber");
      this.$nextTick(() => {
        this.$refs.filterAction.initFilterConfig();
      });
    },
    setTableHeader() {
      console.log("调用");
      console.log("this.currentTabName", this.currentTabName);
      if (this.currentTabName == "area") {
        this.filter.type = 1;
      } else if (this.currentTabName == "unit") {
        this.filter.type = 2;
      } else {
        this.filter.type = 3;
      }

      this.filter.pageNo = 1;
      this.tableData.data = [];
      this.filter.statusCodeIds = [];
      this.filter.lineNumbers = [];
      this.loadData();
      this.$refs.filterAction.setFilterText("筛选");
      this.getFilterConditions();
    },
  },
  components: {
    NavBar,
    List,
    commonTable,
    Tabs,
    Tab,
    dropdowmMenu,
    clickAvatarActionSheet,
    "van-popup": Popup,
    "van-sticky": Sticky,
    "van-button": Button,
  },
};
</script>

<style lang="less" scoped>
.coach-home {
  &-content {
    // padding-top: env(safe-area-inset-top);
    // margin-top: 80px;

    position: relative;
  }
}
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

.icon-search {
  width: 46px;
  margin-right: 25px;
}
/deep/.van-tab {
  background: #ee4d9b;
  color: #fff;
  font-size: 32px;
}
/deep/.van-tab--active {
  color: white;
  font-weight: 500;
}
/deep/.van-tabs__wrap {
  height: 100px;
}
/deep/.van-tabs__nav--line {
  background-color: #f16eae;
}
/deep/.van-tabs__line {
  bottom: 40px;
  background-color: #fff;
  height: 6px;
  border-radius: 2px;
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
  // margin-left: 160px;
  // border-bottom: 40px solid #0059DF;
  // border-left: 10px solid transparent;
  // -webkit-transform: rotate(180deg);
  // transform: rotate(180deg);
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
// /deep/.el-input__inner {
//   border: none;
//   padding: 0;
//   font-size: 4vw;
//   line-height: 2;
//   height: auto;
//   text-align: center;
//   color: #333;
//   font-weight: bold;
// }
// /deep/.el-input--suffix {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 35vw;
// }
// /deep/.el-input__suffix {
//   position: initial;
// }
// /deep/.el-select .el-input .el-select__caret {
//   color: #f26899;
// }

.unit-content-filter {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 28px;
  font-weight: bold;
  color: #f16eae;
  line-height: 28px;
  padding: 37px 20px;
  background-color: #fff;
  .icon {
    width: 22px;
    margin-right: 8px;
  }
  .num {
    font-size: 22px;
    color: #000;
  }
}

.isAndroid {
  // .unit-content {
  //   margin-top: 135px;
  // }
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
// /deep/.van-action-sheet {
//   height: 340px !important;
//   box-sizing: border-box;
//   max-height: 340px !important;
//   padding-bottom: 15px !important;
// }

/deep/.date-name .cell span {
  color: #f16e9f;
}
</style>