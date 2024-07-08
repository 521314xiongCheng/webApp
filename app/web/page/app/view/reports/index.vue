<template>
  <div class="reports-wrap">
    <NavBar 
      left-text="返回" 
      fixed
      title="沙龙详情" 
      :border="false"
      :safe-area-inset-top="true"
      @click-left="back">
      <template #left>
        <img class="back_btn" src="../../images/search_back.png" alt="">
      </template>
      <template #title>
        <van-search
          v-model="keyword"
          placeholder="搜索"
          @search="onSearch"
        >
        </van-search>
      </template>
    </NavBar>
    <div class="content">
      <div class="content-item" v-for="(report,index) in reports" :key="`report_${index}`">
        <div class="content-item-group">{{report.groupName}}</div>
        <div class="report-list">
          <div class="report-list-item" v-for="(group,idx) in report.groups" :key="`group_${idx}`">
            <img class="report-icon" :src="group.icon" alt="">
            <div class="report-label" v-html="group.label"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { NavBar, Search } from 'vant'
import { closeWebview } from '../../utils/index'
const reports = [
        {
          groupName: '业务信息',
          groups: [
            {
              icon: require('../../images/reports/icon_16.png'),
              label: `沙龙跟进\n机会`,
              key: 'unitMemberReport',
              reportType: 'LUA',
              minAuthLevel: 60,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_26.png'),
              label: `应开发票\n查询`,
              key: 'regInvoiceReport',
              reportType: 'H5',
              minAuthLevel: 0,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_20.png'),
              label: `X状态\n成员`,
              key: 'xMembersReport',
              reportType: 'LUA',
              minAuthLevel: 20,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_22.png'),
              label: `新顾问\n起步锦囊`,
              key: 'starterKit',
              reportType: 'H5',
              minAuthLevel: 60,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_17.png'),
              label: `我的收入`,
              key: 'incomeListReport',
              reportType: 'H5',
              minAuthLevel: 0,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_10.png'),
              label: `绩效概览`,
              key: 'performanceNewReport',
              reportType: 'LUA',
              minAuthLevel: 20,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_19.png'),
              label: `RC报表`,
              key: 'regCustReport',
              reportType: 'H5',
              minAuthLevel: 15,
              maxAuthLevel: 100,
              hidden: false
            },
          ]
        },
        {
          groupName: '竞赛挑战',
          groups: [
            {
              icon: require('../../images/reports/icon_5.png'),
              label: `新经销商\n粉车基金`,
              key: 'pinkSilverGoldRoseNewReport',
              reportType: 'H5',
              minAuthLevel: 60,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_12.png'),
              label: `精英经销商\n海外游`,
              key: 'eliteOverseasTourReport',
              reportType: 'LUA',
              minAuthLevel: 60,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_1.png'),
              label: `2021新顾客\n挑战报表`,
              key: 'customerServiceChallengeReport',
              reportType: 'H5',
              minAuthLevel: 20,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_9.png'),
              label: `成功阶梯\n报表`,
              key: 'successLadder',
              reportType: 'H5',
              minAuthLevel: 15,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_4.png'),
              label: `年度新品\n体验计划`,
              key: 'newProductExperience',
              reportType: 'H5',
              minAuthLevel: 0,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_17.png'),
              label: `新人起步\n计划`,
              key: 'newcomersPlan',
              reportType: 'H5',
              minAuthLevel: 0,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_24.png'),
              label: `幸福小店\n辅导奖励`,
              key: 'happinessShop',
              reportType: 'H5',
              minAuthLevel: 0,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_25.png'),
              label: `研讨会三星`,
              key: 'seminar',
              reportType: 'H5',
              minAuthLevel: 60,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_15.png'),
              label: `女主人\n分享季`,
              key: 'hostess',
              reportType: 'H5',
              minAuthLevel: 0,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_2.png'),
              label: `百万打卡`,
              key: 'millionCheck',
              reportType: 'H5',
              minAuthLevel: 0,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_8.png'),
              label: `成功阶梯\n积分报表`,
              key: 'gemPoints',
              reportType: 'H5',
              minAuthLevel: 60,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_23.png'),
              label: `粉车挑战`,
              key: 'pinkCarReportCarReport',
              reportType: 'H5',
              minAuthLevel: 60,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_27.png'),
              label: `DIQ`,
              key: 'DIQ',
              reportType: 'LUA',
              minAuthLevel: 60,
              maxAuthLevel: 100,
              hidden: false
            },
          ]
        },
        {
          groupName: '会议培训',
          groups: [
            {
              icon: require('../../images/reports/icon_6.png'),
              label: '新人起步课\n程(云课）',
              key: 'classMapReport',
              reportType: 'LUA',
              minAuthLevel: 30,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_14.png'),
              label: `明星学院`,
              key: 'starCollegeReport',
              reportType: 'LUA',
              minAuthLevel: 60,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_7.png'),
              label: `红外套挑战`,
              key: 'redCoat',
              reportType: 'H5',
              minAuthLevel: 0,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_11.png'),
              label: `精英顾问\n培养日名单`,
              key: 'regEliteWelcomeReport',
              reportType: 'LUA',
              minAuthLevel: 60,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_13.png'),
              label: `玫琳凯大学`,
              key: 'marykayCollegeReport',
              reportType: 'LUA',
              minAuthLevel: 60,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_18.png'),
              label: `新督导\n训练营报名`,
              key: 'newDirTrainReport',
              reportType: 'LUA',
              minAuthLevel: 60,
              maxAuthLevel: 100,
              hidden: false
            },
            {
              icon: require('../../images/reports/icon_21.png'),
              label: `新顾问\n欢迎日名单`,
              key: 'regNewWelcomeReport',
              reportType: 'LUA',
              minAuthLevel: 60,
              maxAuthLevel: 100,
              hidden: false
            },
          ]
        },
      ]
export default {
  data() {
    return {
      keyword: '',
      reports: [],
      userProfile: {
        career_level_code: 97,
        contact_id: 20002868550
      }
    };
  },
  async created() {
    if(xxxxxx) {
      let userProfile = await this.$jsBridge.getUserProfile()
      userProfile = typeof userProfile === 'string' ? JSON.parse(userProfile) : userProfile
      console.log(userProfile)
      this.userProfile = userProfile
      // this.levelCode = Number(userProfile.career_level_code)
      // this.targetContactId = userProfile.contact_id
    }
  },
  methods: {
    initReportData() {
      const { career_level_code } = this.userProfile
      
    },
    back() {
      closeWebview()
    },
    onSearch() {

    },
    onCancel() {

    }
  },
  components: {
    NavBar,
    "van-search": Search
  },
};
</script>
<style lang="less" scoped>
.reports-wrap {
  // background-color: #F5F5F5;
  min-height: 100vh;
  .back_btn {
    width: 16px;
    height: 32px;
  }
  .content {
    padding: 130px 30px 3px 30px;
    &-item {
      margin-bottom: 40px;
      &-group {
        font-size: 34px;
        color: #333;
        font-weight: bold;
        margin-bottom: 30px;
      }
      .report-list {
        display: flex;
        flex-wrap: wrap;
        background-color: #fff;
        border-radius: 9px;
        padding-top: 33px;
        &-item {
          width: 25%;
          text-align: center;
          font-size: 24px;
          color: #7F7F7F;
          margin-bottom: 33px;
          .report-icon {
            width: 60px;
            height: 60px;
            margin-bottom: 22px;
          }
          .report-label {
            white-space: pre-wrap;
          }
        }
      }
    }
  }
  /deep/ .van-search {
    padding: 0;
    .van-search__content {
      color: #7F7F7F;
      background-color: #F5F5F5;  
      border-radius: 35px;
      padding: 0 26px;
      .van-icon {
        color: #B0B0B4;
      }
      .van-icon-search {
        font-size: 28px;
        color: #B0B0B4;
      }
    }
  }
  /deep/ .van-nav-bar {
    .van-nav-bar__content {
      height: 110px;
      padding: 20px 0;
    }
    .van-nav-bar__left {
      padding: 0 0 0 44px;
    }
    .van-nav-bar__title {
      margin-left: 80px;
      width: 643px;
      max-width: 640px;
    }
  }
}
</style>