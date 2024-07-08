<template>
  <div class="search-wrap">
    <div class="search-bar">
      <img
        class="back_btn"
        @click="back"
        src="../../../images/search_back.png"
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
            src="../../../images/icon_input_search.png"
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
            label="头像"
            width="60px"
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
                  src="../../../images/crown.png"
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
        </common-table>
      </List>
    </div>
    <div class="no_data" v-if="isNoData">
      <div>
        <img class="table-empty__bg" src="../../../images/nodata.png" alt="" />
      </div>
      未查询到<span class="is_active">“{{ keyword }}”</span>的数据
    </div>
  </div>
</template>
<script>
import { Search, List, Button, Icon, ActionSheet, Dialog } from "vant";
import { isIos, closeWebview, formatMoney } from "../../../utils/index";
import commonTable from "../../../components/commonTable.vue";
import productionSheet from "../../../components/productionSheet/index.vue";
import tableHeaderFixed from "../../../mixin/tableHeaderFixed";
const actions = [
  {
    name: "个人详情",
    prop: "profile",
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
        {
          label: "督导姓名",
          prop: "directorName",
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
          label: "DIQ沙龙成员\nA成员",
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
          label: "督导姓名",
          prop: "directorName",
        },
      ],
      filter: {
        pageSize: 20,
        pageNo: 1,
        businessType: "AREA_ONE",
        sortEnum: null,
        orderEnum: null,
      },
      showActions: false,
      currentData: {},
      total: 1,
      monthKey: "",
      isNoData: false,
      setproductionAmtM: false,
      productionAmtMdata: {
        name: "",
        productionAmtmc: {
          text: "零售绩效设定",
          date: "2021.06",
        },
        //零售绩效
        productionAmt: "",
        //目标绩效
        targetProductionAmt: "",
        reference: {
          //上个月
          lastMonthProductionAmt: "",
          //半年
          halfYearAvgProductionAmt: "",
        },
        //收益分析
        incomeDescribe: "222",
      },
      keyword: "",
      currentTabName: "apply",
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
    const { monthKey, businessType, targetContactId, currentTabName } =
      this.$route.query;
    this.monthKey = monthKey;
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
        context: "StaffDIQDetailsPage",
        behavior: "DIQDetailsSearchCancelClick",
        item_type: "StaffDIQDetailsPage",
        item_id: "DIQDetailsSearchCancelClick",
      });
      closeWebview();
    },
    onSearch(search) {
      this.$track({
        context: "StaffDIQDetailsPage",
        behavior: "DIQDetailsSearchClick",
        item_type: "StaffDIQDetailsPage",
        item_id: "DIQDetailsSearchClick",
        attributes: {
          search_content: search,
        },
      });
      console.log(search);
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

      // let baseApi = 'https://mock.marykay.com.cn/mock/489/api/v1'
      let baseApi = this.$ctx.baseApi;
      let apiUrl = `${baseApi}/reports/employee/area-diq`;
      if (this.currentTabName === "apply") {
        apiUrl = `${baseApi}/reports/employee/diq/applyperiod`;
      }
      const { data } = await this.$request.get(apiUrl, {
        params,
      });
      let members = data.members || data.pageList;
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
    handleClickAvatar(row) {
      this.currentData = row;
      this.goProflie();
    },
    goProflie() {
      let url = `${window.location.origin}/profile`;
      const params = {
        opaque: false,
        targetContactId: this.currentData.contactId,
        levelCode: this.currentData.careerLevelCode,
        accountType: "operation",
        isEmployee: true,
        followed: this.$route.query.targetContactId,
        from: "operation",
      };
      // if (this.$route.query.impersonatedContactId) {
      //   params.impersonatedContactId = this.$route.query.impersonatedContactId;
      // }
      this.$go(url, params);
    },
    async share() {
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
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
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
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
          let url = `${window.location.origin}/profile`;
          const params = {
            opaque: false,
            targetContactId: this.currentData.contactId,
            levelCode: this.currentData.careerLevelCode,
          };
          this.$go(url, params);
          break;
        case "setTarget": //邀请设置收入目标
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
      }
      this.showActions = false;
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
    setEstimateProduction(row) {
      this.currentData = row;
      this.productionAmtMdata.name = row.name;
      this.Estimateproduction();
    },
    async Estimateproduction() {
      const params = {
        queryType: "unit",
        contactId: this.currentData.contactId,
      };
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(
        `${baseApi}/estimate/production`,
        { params }
      );
      console.log("cell", data);

      this.productionAmtMdata = Object.assign(this.productionAmtMdata, data);
      this.setproductionAmtM = true;
      console.log("this.productionAmtMdata", this.productionAmtMdata);
    },
    async addProduction(targetAmt) {
      let baseApi = this.$ctx.baseApi;
      const params = {
        //设置人id
        setByContactId: this.targetContactId,
        //被设置人id
        memberContactId: this.currentData.contactId,
        //设定绩效
        targetAmt: targetAmt,
      };
      const { data } = await this.$request.post(
        `${baseApi}/target/production`,
        params
      );
      console.log("addproduction", data);
      this.setproductionAmtM = false;
      this.currentData.setTargetProductionAmt = true;
      this.currentData.estimateProductionAmt = targetAmt;
      if (this.targetContactId === this.currentData.contactId) {
        this.currentData.setBySelf = true;
      } else {
        this.currentData.setBySelf = false;
      }
      // this.$set(this.currentData,'estimateProductionAmt',targetAmt)
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
      padding: 0 30px;
      height: 47px;
      background-color: #fff7fd;
      color: #f16eae;
      font-size: 24px;
      border-color: #ffa7d2;
      border-radius: 9px;
      width: 146px;
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
