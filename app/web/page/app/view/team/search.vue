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
            align="center"
            label="头像"
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
            label="评估绩效"
            slot="between"
            prop="estimateProductionAmt"
            width="96px"
            align="center"
            header-align="center"
            sortable="custom"
            v-if="this.levelCode < 60"
            :sort-orders="['descending', 'ascending', null]"
          >
            <template slot-scope="{ row }">
              <div class="assess-performance">
                <van-button
                  @click="cellClick(row)"
                  v-if="!row.setTargetProductionAmt"
                  class="assess-performance-btn"
                  >评估绩效</van-button
                >
                <van-button
                  v-else
                  class="assess-performance-btn"
                  @click="cellClick(row)"
                  >{{ row.estimateProductionAmt | formatMoney }}</van-button
                >
                <img
                  v-if="!row.setBySelf && row.setTargetProductionAmt"
                  class="assess-performance-tip"
                  src="../../images/avatar.png"
                  alt=""
                  @click="setByself(row)"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="收入目标"
            slot="between"
            prop="targetIncomeAmt"
            align="center"
            header-align="center"
            sortable="custom"
            minWidth="90px"
            v-if="this.levelCode >= 60"
          >
            <template slot-scope="{ row }">
              <div class="assess-performance">
                <van-button
                  @click="setTargetIncomerow(row)"
                  v-if="!row.setTargetIncomeAmt"
                  class="assess-performance-btn"
                  >未设置</van-button
                >
                <van-button
                  v-else
                  class="assess-performance-btn"
                  @click="setTargetIncomerow(row)"
                  >{{ row.incomeTargetAmt | formatMoney }}</van-button
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="绩效进度"
            slot="between"
            prop="estimateProductionAmt"
            minWidth="90px"
            align="center"
            header-align="center"
            sortable="custom"
            v-if="this.levelCode < 60"
          >
            <template slot-scope="{ row }">
              {{ row.productionAmtRate }}%
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
      profileClickEventName="TeamDetailsClick"
      focusEventName="TeamDetailsSetFocusClick  "
      unfocusEventName="TeamDetailsUnfocusClick"
      setTargetEventName="TeamDetailsSetIncomeTargetClick"
      callEventName="TeamDetailsPhoneCallClick"
      cancelEventName="TeamDetailsUnsetClick"
      :info="currentData"
      :isFullScreen="isFullScreen"
      :accountType="accountType"
      :targetContactId="targetContactId"
      @onSelect="onSelect"
    />
    <!-- 评估绩效面板 -->
    <productionSheet
      ref="productionAction"
      :contactId="productionContactId"
      queryType="team"
      :productionName="productionName"
      @addProduction="addProduction"
    ></productionSheet>
    <van-popup v-model="popup" position="center" class="popupmodel" closeable>
      <div class="popbox">
        <div class="msg">
          <p class="popbox-title">
            <span><img src="../../images/mk_title_icon.png" alt="" />提示</span>
          </p>
          <p class="popbox-mes">{{ describe }}</p>
        </div>
        <div class="bottom">
          <img src="../../images/mk_bottom_icon.png" alt="" />
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Search, List, Button, Icon, Dialog, Popup } from "vant";
import { isIos, closeWebview, formatMoney } from "../../utils/index";
import commonTable from "../../components/commonTable.vue";
import productionSheet from "../../components/productionSheet/index.vue";
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
            prop: "productionAmt",
            formatter: (row) => {
              return formatMoney(row.productionAmt);
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
        sortEnum: null,
        orderEnum: null,
      },
      currentData: {},
      total: 1,
      monthKey: "",
      isNoData: false,
      setproductionAmtM: false,
      productionContactId: "",
      productionName: "",
      keyword: "",
      popup: false,
      describe: "",
      levelCode: 0,
      targetContactId: null,
      accountType: "",
      pageName: "TeamDetailsPage",
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
    productionSheet,
    "van-popup": Popup,
  },
  created() {
    const { monthKey, businessType, targetContactId, accountType, levelCode } =
      this.$route.query;
    console.log(levelCode);
    this.monthKey = monthKey;
    this.filter.businessType = businessType;
    this.targetContactId = targetContactId;
    this.accountType = accountType;
    this.levelCode = Number(levelCode);
    let date = new Date(monthKey.substr(0, 4), monthKey.substr(4, 6));
    date.setMonth(date.getMonth() - 1, 1);
    for (let i = 1; i < 13; i++) {
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
          return formatMoney(row[`productionAmtM${i}`]);
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
        behavior: "TeamDetailsSearchCancelClick",
        item_type: this.pageName,
        item_id: "TeamDetailsSearchCancelClick",
      });
      closeWebview();
    },
    onSearch(search) {
      this.$track({
        context: this.pageName,
        behavior: "TeamDetailsSearchIconClick",
        item_type: this.pageName,
        item_id: "TeamDetailsSearchIconClick",
        attributes: {
          search_content: search,
        },
      });
      this.filter.search = search;
      this.filter.pageNo = 1;
      this.tableData.data = [];
      this.loadData();
    },
    async setTargetIncomerow(row) {
      if (this.accountType === "operation") {
        this.$toast("抱歉，暂时不支持对她进行操作～");
        return;
      }
      if (!row.setTargetIncomeAmt) {
        // 分享逻辑
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

        this.$track({
          context: this.pageName,
          behavior: "TeamDetailsUnsetClick",
          item_type: this.pageName,
          item_id: "TeamDetailsUnsetClick",
        });
      }
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
      const { data } = await this.$request.get(
        `${baseApi}/reports/team/details`,
        {
          params,
        }
      );
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
      if (this.accountType === "operation") {
        this.$toast("抱歉，暂时不支持对她进行操作～");
        return;
      }
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
        estimateProductionAmt: "ESTIMATE_PRODUCTION_AMT",
        setTargetProductionAmt: "SET_TARGET_PRODUCTION_AMT",
        setTargetIncomeAmt: "INCOME_TARGET_AMT",
        productionAmtRate: "PRODUCTIONAMT_RATE",
        productionAmt: "PRODUCTION_AMT",
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
    cellClick(row) {
      if (this.isFullScreen) {
        this.$toast("请返回竖屏下操作～");
        return;
      }
      if (this.accountType === "operation") {
        this.$toast("抱歉，暂时不支持对她进行操作～");
        return;
      }
      this.currentData = row;
      this.productionContactId = row.contactId;
      this.productionName = row.name;
      this.$refs.productionAction.showProductionAction = true;
    },
    setEstimateProduction(row) {
      this.currentData = row;
      this.productionContactId = row.contactId;
      this.productionName = row.name;
      this.$refs.productionAction.showProductionAction = true;
    },
    async addProduction(targetAmt) {
      this.currentData.setTargetProductionAmt = true;
      this.currentData.estimateProductionAmt = targetAmt;
      this.currentData.setBySelf = true;
      this.$refs.productionAction.showProductionAction = false;
    },
    async setByself(row) {
      console.log("row", row);
      this.currentData = row;
      // let baseApi = 'https://mock.marykay.com.cn/mock/490/api/v1'
      let baseApi = this.$ctx.baseApi;
      const params = {
        contactId: this.currentData.contactId,
      };
      const { data } = await this.$request.get(
        `${baseApi}/estimate/production/relationship`,
        { params }
      );
      this.describe = "该美容顾问的目标由她的辅导老师王云在2021-07-02日更新。";
      //this.describe=data.describe
      this.popup = true;
      console.log("data", data);
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
</style>
