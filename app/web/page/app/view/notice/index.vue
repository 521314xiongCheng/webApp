<template>
  <div class="invitedList" :class="{ isAndroid: !isIos}">
    <NavBar
      left-text="返回"
      fixed
      title="目标更新"
      :border="false"
      :safe-area-inset-top="true"
      @click-left="back"
    >
      <template #left>
        <i class="el-icon-arrow-left"></i>
      </template>
    </NavBar>
    <div class="top">
      您有<span>{{ setTargetAmtMemberCount }}</span
      >位顾问已经设置收入目标～
    </div>
    <div class="table">
      <div class="tableList">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getData"
        >
          <el-table :data="tableData" @sort-change="tableSort">
            <el-table-column align="center">
              <template slot-scope="{ row }">
                <div class="imgBox" :style="`background: url(https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${row.contactId}/avatar?size=60) no-repeat center`"></div>
                <!-- <img :src="`https://consultant-ecard-api-external-latest.prod.pcf.mkc.io/v1/user/${row.contactId}/avatar?size=60`" alt="" /> -->
              </template>
            </el-table-column>
            <el-table-column label="姓名" align="center">
              <template slot-scope="{ row }">
                <div>
                  {{ row.name }}
                </div>
                <div class="other">
                  <span>{{ row.careerLevelCode }}</span>
                  <span class="line"></span>
                  <span>{{ row.activityStatusCode }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="targetIncomeAmt" label="收入目标" align="center" sortable="custom">
              <template slot-scope="{ row }">
                ￥{{ formatMoney(row.targetIncomeAmt) }}
              </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
          </el-table>
        </van-list>
      </div>
    </div>
  </div>
</template>
<script>
import { formatMoney, createQuery, isIos,closeWebview } from "../../utils/index";
import { List,NavBar } from 'vant';

export default {
  components: {
    "van-list": List,
    NavBar
  },
  data() {
    return {
      // 分页,排序
      isIos: isIos(),
      loading: true,
      finished: false,
      pageNo: 1,
      pageSize: 20,
      hasNextPage: false,
      total: 20,
      sort: "",
      setTargetAmtMemberCount: 18,
      tableData: [
        // {
        //   contactId: "20009810156",
        //   name: "艾丽",
        //   careerLevelCode: "60",
        //   activityStatusCode: "A1",
        //   targetIncomeAmt: 15000,
        // }
      ],
    };
  },
  async created() {
    this.getData()
  },
  methods: {
    async getData() {
      let query = {
        pageNo: this.pageNo,
        sort: this.sort,
        sourceType: "all"
      }
      const filters = createQuery(query)
      try {
        // const res = await this.$request.get("https://mock.marykay.com.cn/mock/491/api/v1/invite/details")
        let baseApi = this.$ctx.baseApi
        const res = await this.$request.get(`${baseApi}/invite/details?${filters}`)
        console.log(res);
        this.pageNo = res.data.pageNo
        this.hasNextPage = res.data.hasNextPage
        this.total = res.data.total
        this.setTargetAmtMemberCount = res.data.setTargetAmtMemberCount
        // 排序时清空缓存
        if (res.data.pageNo == 1) {
          this.tableData = []
        }
        this.tableData.push(...res.data.members)
        this.pageNo = res.data.pageNo + 1
        // 分页list
        this.loading = false;
        this.finished = !res.data.hasNextPage
      } catch (err) {
        console.log(err);
      }
    },
    formatMoney(value) {
      return formatMoney(value);
    },
    // 排序
    tableSort({ prop, order }) {
      console.log(prop,order);
      this.sort = order == "ascending" ? `${prop}_asc` : order == "descending" ? `${prop}_desc` : ""
      this.pageNo = 1
      this.getData()
    },
    back() {
      closeWebview();
    },
  },
};
</script>
<style lang="less" scoped>
.invitedList {
  .top {
    margin: 30px;
    min-height: 96px;
    line-height: 96px;
    background: #ffffff;
    box-shadow: 1px 0px 8px 1px rgba(221, 221, 221, 0.5);
    border-radius: 6px;
    padding-left: 22px;
    font-size: 30px;
    font-weight: bold;
    color: #333333;
    padding-top: env(safe-area-inset-top);
    margin-top: 80px;
    span {
      color: #f16eae;
    }
  }
  .table {
    margin: 39px 30px 0 30px;
    box-shadow: 0px 2px 8px 0px rgba(211, 211, 211, 0.5);
    border-radius: 10px;
    .tableList {
      .imgBox {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin: 0 auto;
        background-size: 100%!important;
      }
      // img {
      //   width: 80px;
      //   height: 80px;
      //   border-radius: 50%;
      // }
      .other {
        font-size: 20px;
        display: flex;
        align-items: center;
        margin-top: 10px;
        span:not(.line) {
          flex: 1;
        }
        .line {
          width: 1px;
          height: 18px;
          background-color: #b1b6c0;
        }
      }
      .view {
        color: #F16EAE;
        font-weight: 500;
        font-size: 26px;
      }
      .el-icon-caret-bottom,
      .el-icon-caret-top {
        color: #BDBDBD;
      }
    }
  }
  .page {
    margin-top: 30px 0;
  }
}
.el-icon-arrow-left {
  font-size: 46px;
}
.isAndroid {
  .top {
    margin-top: 135px;
  }
  /deep/.van-nav-bar {
    padding-top: 55px;
  }
}
/deep/.el-table td.el-table__cell {
  border-bottom: none;
}
/deep/.el-table th.el-table__cell.is-leaf {
  border-bottom: 1px dashed #E4E4E4;
}
/deep/.el-table .cell {
  font-size: 24px;
}
/deep/.el-table__cell .cell {
  padding: 0;
}
/deep/.el-table th.el-table__cell>.cell {
  font-size: 26px;
  font-weight: 500;
  color: #333;
  padding: 0 5px;
}
</style>
