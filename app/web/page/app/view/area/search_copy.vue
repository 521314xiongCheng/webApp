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
          ref="gemPointTable"
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
                  v-show="row.incomeTarget"
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
            label="管理类别"
            slot="between"
            minWidth="90px"
            sortable="custom"
            align="center"
            header-align="center"
            v-if="filter.businessType === 'AREA_ONE_TO_THREE'"
          >
            <template slot-scope="{ row }">
              <span>{{ row.offspringLineNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="收入目标"
            slot="between"
            minWidth="90px"
            align="center"
            sortable="custom"
            prop="incomeTarget"
            header-align="center"
          >
            <template slot-scope="{ row }">
              <div class="assess-performance">
                <span
                  class="assess-performance-btn"
                  v-if="!row.incomeTarget"
                  @click="setTargetIncome(row)"
                  >提醒设置</span
                >
                <span v-else>{{ row.incomeTarget | formatMoney }}</span>
              </div>
            </template>
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
    <!-- 点击头像弹出层 -->
    <click-avatar-action-sheet
      ref="clickAvatarActionSheet"
      :pageName="pageName"
      profileClickEventName="OffspringDetailsClick"
      focusEventName="OffspringDetailsSetFocusClick"
      unfocusEventName="OffspringDetailsUnfocusClick"
      setTargetEventName="OffspringSetIncomeTargetClick"
      callEventName="OffspringPhoneCallClick"
      cancelEventName="OffspringDetailsCancelClick"
      :info="currentData"
      :isFullScreen="isFullScreen"
      :accountType="accountType"
      :targetContactId="targetContactId"
      @onSelect="onSelect"
    />
  </div>
</template>
<script>
import { Search, List, Button, Icon, Dialog } from "vant";
import { isIos, closeWebview, formatMoney, deepCopy } from "../../utils/index";
import commonTable from "../../components/commonTable.vue";
import tableHeaderFixed from "../../mixin/tableHeaderFixed";
import clickAvatarActionSheet from "../../components/clickAvatarActionSheet";

export default {
  data() {
    return {
      isFullScreen: false,
      isIos: isIos(),
      loading: true,
      finished: false,
      tableData: {
        header: [
          {
            label: "当月绩效",
            minWidth: "90px",
            sortable: "custom",
            prop: "productionAmtCurrentMonth",
            formatter: (row) => {
              return formatMoney(row.productionAmtCurrentMonth, 2);
            },
          },
        ],
        data: [],
      },
      filterConfig: [
        {
          prop: "dirTags",
          label: "分类",
          options: [],
        },
        {
          prop: "activityStatuses",
          label: "状态",
          options: [],
        },
        {
          prop: "careerLevels",
          label: "职级",
          options: [],
        },
        {
          prop: "incomeTargetStatusIds",
          label: "收入目标",
          multiple: false,
          options: [
            {
              name: "已设置",
              value: 1,
            },
            {
              name: "未设置",
              value: 0,
            },
          ],
        },
      ],
      filter: {
        pageSize: 50,
        pageNo: 1,
        businessType: "AREA_ONE",
        sortEnum: "INCOME_TARGET",
        orderEnum: "DESC",
      },
      currentData: {},
      total: 1,
      monthKey: "",
      isNoData: false,
      keyword: "",
      accountType: "",
      pageName: "OffspringDetailsPage",
    };
  },
  mixins: [tableHeaderFixed],
  components: {
    commonTable,
    List,
    "van-search": Search,
    "van-button": Button,
    "van-icon": Icon,
    clickAvatarActionSheet,
  },
  created() {
    const { monthKey, businessType, targetContactId, accountType, levelCode } =
      this.$route.query;
    this.monthKey = monthKey;
    this.filter.businessType = businessType;
    this.targetContactId = targetContactId;
    this.accountType = accountType;
    this.levelCode = levelCode;
    console.log(monthKey);
    let date = new Date(monthKey.substr(0, 4), monthKey.substr(4, 6));
    date.setMonth(date.getMonth() - 1, 1);
    for (let i = 1; i <= 12; i++) {
      date.setMonth(date.getMonth() - 1);
      let newDate = `${date.getFullYear()}/${this.addZero(
        date.getMonth() + 1
      )}`;
      this.tableData.header.push({
        label: `${newDate}`,
        minWidth: "90px",
        sortable: "custom",
        prop: `productionAmtM${i}`,
        formatter: (row) => {
          return formatMoney(
            row.productionAmtHistoryMonth[`productionAmtM${i}`],
            2
          );
        },
      });
    }
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
        behavior: "OffspringDetailsSearchCancelClick",
        item_type: this.pageName,
        item_id: "OffspringDetailsSearchCancelClick",
      });
      closeWebview();
    },
    onSearch(keywords) {
      console.log(keywords);
      this.$track({
        context: this.pageName,
        behavior: "OffspringDetailsSearchIconClick",
        item_type: this.pageName,
        item_id: "OffspringDetailsSearchIconClick",
        attributes: {
          search_content: keywords,
        },
      });
      this.filter.keywords = keywords;
      this.filter.pageNo = 1;
      this.tableData.data = [];
      this.loadData();
    },
    async loadData() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      this.loading = true;
      const { pageNo, pageSize, keywords, businessType, sortEnum, orderEnum } =
        this.filter;
      const params = {
        pageNo,
        pageSize,
        keywords,
        businessType,
        sortEnum,
        orderEnum,
      };

      // let baseApi = 'https://mock.marykay.com.cn/mock/489/api/v1'
      let baseApi = this.$ctx.baseApi;
      const { data } = await this.$request.get(`${baseApi}/reports/area`, {
        params,
      });
      this.loading = false;
      if (!data.hasNextPage) {
        this.finished = true;
      } else {
        this.finished = false;
      }
      const map = new Map();
      let newMembers = this.tableData.data.concat(data.members);
      this.tableData.data = newMembers.filter(
        (nm) => !map.has(nm.contactId) && map.set(nm.contactId, 1)
      );
      // this.tableData.data = [...new Set(this.tableData.data.concat(data.members))]
      window.scrollTo(0, scrollTop);
      if (!this.tableData.data || !this.tableData.data.length) {
        this.isNoData = true;
        this.keyword = this.filter.keywords;
      } else {
        this.isNoData = false;
      }
      this.filter.pageNo = this.filter.pageNo + 1;
    },
    async onRefresh() {
      this.finished = false;
      this.filter.pageNo = 1;
      this.tableData.data = [];
      this.loadData();
    },
    async setTargetIncome(row) {
      if (this.accountType === "operation") {
        this.$toast("抱歉，暂时不支持对她进行操作～");
        return;
      }
      if (this.targetContactId.toString() === row.contactId.toString()) {
        // 是本人 直接设置收入目标
        this.$track({
          context: this.pageName,
          behavior: "OffspringSetTargetClick",
          item_type: this.pageName,
          item_id: "OffspringSetTargetClick",
        });
        this.currentData = row;
        this.$refs.setTarget.setTargetIncome();
      } else {
        this.$track({
          context: this.pageName,
          behavior: "OffspringRemindToSetClick",
          item_type: this.pageName,
          item_id: "OffspringRemindToSetClick",
        });
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
      }
    },
    handleClickAvatar(row) {
      this.currentData = row;
      this.$nextTick(() => {
        this.$refs.clickAvatarActionSheet.showActions();
      });
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
              //跟进人
            followed:this.$route.query.targetContactId
          };
          this.$go(url, params);
          break;
        case "setTarget": //邀请设置收入目标
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
      }
      this.$refs.clickAvatarActionSheet.show = false;
    },
    sortMap(prop) {
      let propMap = {
        incomeTarget: "INCOME_TARGET",
        productionAmtCurrentMonth: "PRODUCTION_AMT_CURRENT_MONTH",
        offspringLineNumber: "LINE_NUMBER",
        productionAmtM1: "PRODUCTION_AMT_M1",
        productionAmtM2: "PRODUCTION_AMT_M2",
        productionAmtM3: "PRODUCTION_AMT_M3",
        productionAmtM4: "PRODUCTION_AMT_M4",
        productionAmtM5: "PRODUCTION_AMT_M5",
        productionAmtM6: "PRODUCTION_AMT_M6",
        productionAmtM7: "PRODUCTION_AMT_M7",
        productionAmtM8: "PRODUCTION_AMT_M8",
        productionAmtM9: "PRODUCTION_AMT_M9",
        productionAmtM10: "PRODUCTION_AMT_M10",
        productionAmtM11: "PRODUCTION_AMT_M11",
        productionAmtM12: "PRODUCTION_AMT_M12",
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
  .assess-performance {
    position: relative;
    display: inline-block;
    &-btn {
      color: #f99e79;
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
