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
        placeholder="请输入姓名/手机号搜索"
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
          ref="unitTable"
          :border="false"
          :tableData="tableData"
          :isFullScreen="isFullScreen"
          :setClassName="setClassName"
          @sortChange="sortChange"
        >
          <el-table-column
            fixed="left"
            width="60px"
            label="头像"
            prop="avatar"
            align="center"
          >
            <template slot-scope="{ row }">
              <div class="avatar-wrap">
                <img
                  @click="handleClickAvatar(row)"
                  class="avatar"
                  :src="`https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${row.contactId}/avatar?size=60`"
                  alt=""
                />
                <img
                  v-show="row.setTargetIncomeAmt"
                  class="icon_crown"
                  src="../../images/crown.png"
                  alt=""
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="姓名"
            fixed="left"
            width="70px"
            align="center"
            header-align="center"
          >
            <template slot-scope="{ row }">
              <div class="user">
                <div class="user-info">
                  <div class="user_name">
                    <span class="climp">{{ row.name }}</span>
                  </div>
                </div>
                <div
                  class="tags"
                  v-if="targetContactId === row.contactId.toString()"
                >
                  <span class="level">{{ row.careerLevelCode }}</span>
                  <span class="status">{{ row.activityStatusCode }}</span>
                  <span class="self">本人</span>
                </div>
                <div class="no-self" v-else>
                  <span class="level">{{ row.careerLevelCode }}</span>
                  <span class="line"></span>
                  <span class="status">{{ row.activityStatusCode }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="offSpringLineNumber"
            label="管理类别"
            width="100"
            align="center"
            sortable="custom"
            v-if="levelCode > 60 && currentTabName === 'apply'"
          >
          </el-table-column>
          <el-table-column
            prop="directorName"
            v-if="levelCode > 60 && currentTabName === 'apply'"
            align="center"
            label="督导姓名"
          >
          </el-table-column>
        </common-table>
      </List>
    </div>
    <div class="no_data" v-if="isNoData">
      <div>
        <img class="table-empty__bg" src="../../images/nodata.png" alt="" />
      </div>
      未查询到<span class="is_active">“{{ keyword }}”</span>的数据
    </div>
    <van-action-sheet
      v-model="showActions"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
    />
  </div>
</template>
<script>
import { Search, List, Button, Icon, ActionSheet, Dialog } from "vant";
import { isIos, closeWebview, formatMoney, deepCopy } from "../../utils/index";
import commonTable from "../../components/commonTable.vue";
import productionSheet from "../../components/productionSheet/index.vue";
import tableHeaderFixed from "../../mixin/tableHeaderFixed";
const actions = [
  {
    name: "个人详情",
    prop: "profile",
  },
  {
    name: "新人行动",
    prop: "nbcAction",
  },
  {
    name: "添加笔记",
    prop: "addNote",
  },
  {
    name: "邀请设置收入目标",
    prop: "setTarget",
  },
];
export default {
  data() {
    return {
      isFullScreen: false,
      isIos: isIos(),
      loading: true,
      finished: false,
      tableData: {
        header: [],
        data: [],
      },
      currentTableName: "apply",
      applyHeader: [
        {
          label: "累计零售\n绩效",
          width: 80,
          prop: "totalProductionAmt",
          formatter: (row) => {
            return formatMoney(row.totalProductionAmt);
          },
        },
        {
          label: "零售绩效\n达成4800",
          width: 80,
          prop: "productionAmtReachedStatus",
          formatter: (row) => {
            return row.productionAmtReachedStatus ? "已达成" : "未达成";
          },
        },
        {
          label: "培养A状态\n顾问数",
          width: 80,
          prop: "trainAContactNum",
          formatter: (row) => {
            return `${row.trainAContactNum}/10`;
          },
        },
        {
          label: "DIQ网上申请\n和自测",
          width: 90,
          prop: "onlineSelfExamStatus",
          formatter: (row) => {
            switch (row.onlineSelfExamStatus) {
              case 0:
                return "未自测";
              case 1:
                return "已通过";
              case 2:
                return "未通过";
            }
          },
        },
        {
          label: "是否有行为\n规范处理",
          width: 90,
          prop: "citationStatus",
        },
      ],
      assessHeader: [
        {
          label: "DIQ考核\n月份",
          prop: "assessMonthNo",
          formatter: (row) => {
            return this.assessMonthNoMap(row.assessMonthNo);
          },
        },
        {
          label: "累计零售\n绩效",
          prop: "productionAmt",
          formatter: (row) => {
            return formatMoney(row.productionAmt);
          },
        },
        {
          label: "零售绩效\n达成4800",
          prop: "isProductionReach",
          formatter: (row) => {
            return row.isProductionReach ? "已达成" : "未达成";
          },
        },
        {
          label: "累计DIQ\n沙龙绩效",
          prop: "diqProductionAmt",
          formatter: (row) => {
            return formatMoney(row.diqProductionAmt);
          },
        },
        {
          label: "DIQ沙龙绩效\n达成45000",
          prop: "isDiqProductionReach",
          minWidth: "90px",
          formatter: (row) => {
            return row.isDiqProductionReach ? "已达成" : "未达成";
          },
        },
        {
          label: "DIQ沙龙\nA成员",
          prop: "activeConsultantCount",
          minWidth: "90px",
        },
        {
          label: "DIQ沙龙成员\n达成20A",
          prop: "isActiveConsultantCountReach",
          minWidth: "90px",
          formatter: (row) => {
            return row.isActiveConsultantCountReach ? "已达成" : "未达成";
          },
        },
        {
          label: "每月A状态",
          prop: "isActiveEveryMonth",
          formatter: (row) => {
            let month = Number(this.$route.query.monthKey.substr(4, 6));
            return row.isActiveEveryMonth ? "已达成" : `${month}月未达成`;
          },
        },
        {
          label: "是否有行为\n规范处理",
          prop: "citationDate",
          formatter: (row) => {
            return row.citationDate ? row.citationDate : "-";
          },
        },
        {
          label: "管理类别",
          prop: "offSpringLineNumber",
        },
        {
          label: "督导姓名",
          prop: "directorName",
        },
      ],
      filter: {
        pageSize: 50,
        pageNo: 1,
        businessType: "AREA_ONE",
        sortEnum: "OFF_SPRING_LINE_NUMBER",
        orderEnum: "ASC",
      },
      actions: [],
      showActions: false,
      currentData: {},
      total: 1,
      monthKey: "",
      isNoData: false,
      keyword: "",
      pageName: "DIQDetailsPage",
      levelCode: 97,
    };
  },
  mixins: [tableHeaderFixed],
  components: {
    commonTable,
    List,
    "van-search": Search,
    "van-button": Button,
    "van-icon": Icon,
    "van-action-sheet": ActionSheet,
    productionSheet,
  },
  created() {
    const {
      monthKey,
      businessType,
      targetContactId,
      currentTabName,
      levelCode,
    } = this.$route.query;
    this.monthKey = monthKey;
    this.levelCode = Number(levelCode);
    this.filter.businessType = businessType;
    this.targetContactId = targetContactId;
    this.currentTabName = currentTabName;
    this.tableData.header = this[`${currentTabName}Header`];
  },
  methods: {
    addZero(m) {
      return m < 10 ? `0${m}` : m;
    },
    back() {
      closeWebview();
    },
    onCancel() {
      this.$track({
        context: this.pageName,
        behavior: "DIQDetailsCancelClick",
        item_type: this.pageName,
        item_id: "DIQDetailsCancelClick",
      });
      closeWebview();
    },
    onSearch(search) {
      console.log(search);
      this.$track({
        context: this.pageName,
        behavior: "DIQDetailsSearchIconClick",
        item_type: this.pageName,
        item_id: "DIQDetailsSearchIconClick",
        attributes: {
          search_content: search,
        },
      });
      this.filter.search = search;
      this.filter.pageNo = 1;
      this.tableData.data = [];
      this.loadData();
    },
    async loadData() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      this.loading = true;
      const { pageNo, pageSize, search, sortEnum, orderEnum } = this.filter;
      const params = {
        pageNo,
        pageSize,
        search,
        sortEnum,
        orderEnum,
      };

      let baseApi = this.$ctx.baseApi;
      let apiUrl = `${baseApi}/reports/area-diq`;
      if (this.currentTabName === "apply") {
        apiUrl = `${baseApi}/reports/diq/applyperiod`;
      }
      const { data } = await this.$request.get(apiUrl, {
        params,
      });
      let members = data.members || data.pageList;
      //零售绩效4800
      members.map((item) => {
        if (item.isProductionReach) {
          item.isProductionReach = "已达成";
        } else {
          item.isProductionReach = "未达成";
        }
        //20A
        if (item.isActiveConsultantCountReach) {
          item.isActiveConsultantCountReach = "已达成";
        } else {
          item.isActiveConsultantCountReach = "未达成";
        }
        //diq45000
        if (item.isDiqProductionReach) {
          item.isDiqProductionReach = "已达成";
        } else {
          item.isDiqProductionReach = "未达成";
        }
        //a状态
        if (item.notActiveMonth == null || item.notActiveMonth == "") {
          item.notActiveMonth = "-";
        }
        //违规
        if (item.citationDate == null || item.citationDate == "") {
          item.citationDate = "-";
        }
      });
      this.loading = false;
      if (!data.hasNextPage) {
        this.finished = true;
      } else {
        this.finished = false;
      }
      const map = new Map();
      let newMembers = this.tableData.data.concat(members);
      this.tableData.data = newMembers.filter(
        (nm) => !map.has(nm.contactId) && map.set(nm.contactId, 1)
      );
      // this.tableData.data = [...new Set(this.tableData.data.concat(data.members))]
      if (!this.tableData.data || !this.tableData.data.length) {
        this.isNoData = true;
        this.keyword = this.filter.search;
      } else {
        this.isNoData = false;
      }
      window.scrollTo(0, scrollTop);
      this.filter.pageNo = this.filter.pageNo + 1;
    },
    async onRefresh() {
      this.finished = false;
      this.filter.pageNo = 1;
      this.tableData.data = [];
      this.loadData();
    },
    async setTargetIncome() {
      Dialog.confirm({
        message: "是否邀请设置收入目标",
      })
        .then(() => {
          // on confirm
          this.share();
        })
        .catch(() => {
          // on cancel
        });
    },
    async handleClickAvatar(row) {
      this.currentData = row;
      // 新人行动
      let baseApi = this.$ctx.baseApi;
      // let baseApi = `https://mock.marykay.com.cn/mock/646/api/v1`;
      const {
        data: { isNew },
      } = await this.$request.get(`${baseApi}/goldenweek/newconsultant?contactId=${row.contactId}`);
      let copyActions = deepCopy(actions);

      if (row.setTargetIncomeAmt) {
        copyActions[3].name = "邀请修改收入目标";
      } else {
        copyActions[3].name = "邀请设置收入目标";
      }
      if (this.accountType === "operation") {
        copyActions.forEach((item, index, arr) => {
          if (item.prop === "setTarget" || item.prop === "nbcAction") {
            arr.splice(index, 1);
          }
        });
        if (Number(row.careerLevelCode) < 50) {
          copyActions.forEach((item, index, arr) => {
            if (item.prop === "call") {
              arr.splice(index, 1);
            }
          });
        }
      }
      if (!isNew) {
        copyActions.forEach((item, index, arr) => {
          if (item.prop === "nbcAction") {
            arr.splice(index, 1);
          }
        });
      }
      this.actions = copyActions;
      this.showActions = true;
    },
    async share() {
      let baseApi = this.$ctx.baseApi;
      const inviteLinkData = await this.$request.post(`${baseApi}/invite/link`);
      console.log(inviteLinkData);
      let shareUrl = `${this.$ctx.baseShareUrl}?linkKey=${inviteLinkData.data.linkKey}`;
      const shareArg = {
        kind: "media",
        title: "写下你的收入愿望，我们一起实现她",
        description: "愿望无论大小，说不定就实现了呢？",
        thumbnail:
          "https://dev-community-s3.marykay.com.cn/DEV/MyBizIntouch_Content_Cms/LibraryResource/20210917102605_661.png",
        mediatype: "webpage",
        scene: "WXSceneSession",
        url: shareUrl,
      };
      this.$jsBridge.shareToWechat(shareArg);
    },
    async onSelect(item) {
      let baseApi = this.$ctx.baseApi;
      switch (item.prop) {
        case "follow": //关注
          const { data } = await this.$request.post(`${baseApi}/focus`, {
            focusContactId: this.currentData.contactId.toString(),
          });
          this.currentData.isFocus = !this.currentData.isFocus;
          console.log(this.currentData.isFocus);
          break;
        case "profile": //个人详情
          this.$track({
            context: this.pageName,
            behavior: "DIQDetailsClick",
            item_type: this.pageName,
            item_id: "DIQDetailsClick",
          });
          let url = `${window.location.origin}/profile`;
          const params = {
            opaque: false,
            targetContactId: this.currentData.contactId,
            levelCode: this.currentData.careerLevelCode,
              //跟进人
            followed:this.$route.query.targetContactId
          };
          this.$go(url, params);
          break;
        case "setTarget": //邀请设置收入目标
          this.$track({
            context: this.pageName,
            behavior: "DIQDetailsSetIncomeTargetClick",
            item_type: this.pageName,
            item_id: "DIQDetailsSetIncomeTargetClick",
          });
          let { setTargetIncomeAmt } = this.currentData;
          let message = setTargetIncomeAmt
            ? "是否邀请修改收入目标"
            : "是否邀请设置收入目标";

          Dialog.confirm({
            message,
          })
            .then(() => {
              // on confirm
              this.share();
            })
            .catch(() => {
              // on cancel
            });
          break;
        case "assess": //查看目标评估
          let path = "team";
          if (Number(this.currentData.careerLevelCode) >= 60) {
            path = "unit";
          }
          let detailUrl = `${window.location.origin}/${path}`;
          const query = {
            opaque: false,
            isSelf: false,
            targetContactId: this.currentData.contactId,
            levelCode: this.currentData.careerLevelCode,
            monthKey: this.monthKey,
            navTitle: "收入目标评估",
          };
          this.$go(detailUrl, query);
          break;
        case "call": //拨打电话
          window.location.href = `tel:${this.currentData.mobile}`;
          break;
        case "nbcAction":
          this.toActionPlan()
          break;
        case "addNote":
          this.goAddNote()
          break;
      }
      this.showActions = false;
    },
    toActionPlan() {
      let url = `${window.location.origin}/nbcActionPlan`;
      const params = {
        opaque: false,
        targetContactId: this.currentData.contactId,
      };
      this.$go(url, params);
    },
    async goAddNote() {
      const { data } = await this.$request.get(
        `${this.$ctx.baseApi}/notes/check?followContactId=${this.currentData.contactId}&contactId=${this.targetContactId}`
      );

      let url = `${window.location.origin}/note`;
      let params = {
        opaque: false,
        targetContactId: this.currentData.contactId,
        name: this.currentData.name,
        levelCode: this.currentData.careerLevelCode,
        followed: this.targetContactId,
      };
      if (!data.hasNote) {
        url = `${window.location.origin}/addNote`;
        params = {
          targetContactId: this.currentData.contactId,
          name: this.currentData.name,
          opaque: false,
          levelCode: this.currentData.careerLevelCode,
          from: "addNote_none",
          followed: this.targetContactId,
        };
      }
      console.log("params", params);
      this.$go(url, params);
    },
    sortMap(prop) {
      let propMap = {
        totalProductionAmt: "TOTAL_PRODUCTION_AMT",
        productionAmtReachedStatus: "PRODUCTION_AMT_REACHED_STATUS",
        trainAContactNum: "TRAIN_A_CONTACT_NUM",
        onlineSelfExamStatus: "ONLINE_SELF_EXAM_STATUS",
        citationStatus: "CITATION_STATUS",
        offSpringLineNumber: "OFF_SPRING_LINE_NUMBER",
      };
      return propMap[prop];
    },
    sortChange({ column, prop, order }) {
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
    assessMonthNoMap(assessMonthNo) {
      switch (assessMonthNo) {
        case 0:
          return "第一月";
        case 1:
          return "第二月";
        case 2:
          return "第三月";
        case 3:
          return "第四月";
        case 4:
          return "第五月";
        case 5:
          return "第六月";
        case 6:
          return "第七月";
        case 7:
          return "第八月";
        case 8:
          return "第九月";
        case 9:
          return "第十月";
      }
    },
    setClassName({ row, column }) {
      if (column.property === "name") {
        return "cell-class_name";
      }
      if (column.property === "avatar") {
        return "cell-class_avatar";
      }
      if (column.property === "estimateProductionAmt") {
        return "cell-class_estimateProductionAmt";
      }
    },
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
    right: 26px;
    top: 7px;
  }
  .assess-performance {
    position: relative;
    display: inline-block;
    &-btn {
      padding: 0 12px;
      height: 42px;
      background-color: #fff7fd;
      color: #f16eae;
      font-size: 24px;
      border-color: #ffa7d2;
      border-radius: 9px;
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
</style>
