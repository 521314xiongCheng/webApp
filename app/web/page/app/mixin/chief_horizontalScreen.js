import {
  closeWebview,
  deepCopy,
  createQuery,
  isIos
} from '../utils/index'
import {
  Popover,
  Toast
} from 'vant'
const actions = [{
  text: 'Excel导出',
  type: 'export'
},
{
  text: '横/竖屏切换',
  type: 'fullscreen'
}
];
export default {
  components: {
    "van-popover": Popover
  },
  data() {
    return {
      screenRotationType: 'portrait',
      isFullScreen: false,
      showPopover: false,
      popoverActions: [{
        text: 'Excel导出',
        type: 'export'
      },
      {
        text: '横/竖屏切换',
        type: 'fullscreen'
      }
      ],
      screenHeight: 0, //fix 横屏后获取screen.height错误
    }
  },
  mounted() {
    this.screenHeight = screen.height;
    this.resetToPortraitScreen()
    // this.$jsBridge.setAllowRotateScreen(false)
    const screenRotation = async data => {
      this.screenRotationType = data
      if (data === 'portrait') {
        // this.isFullScreen = true
        if (this.isFullScreen && isIos()) {
          this.isFullScreen = false
        }
      }
    }
    this.$jsBridge.screenRotationNotification(screenRotation)
  },
  methods: {
    gofullscreen() {
      this.$track({
        context: this.pageName,
        behavior: this.landscapeEventName,
        item_type: this.pageName,
        item_id: this.landscapeEventName,
        attributes: {
          isEmployee: this.accountType && this.accountType === "operation",
        },
      });
      if (!this.tableData.length) return
      if (xxxxx) {
        this.$jsBridge.setFullScreen()
        this.isFullScreen = true
      }
    },
    popoverSelect(action) {

      if (action.type === 'fullscreen') {
        this.$track({
          context: this.pageName,
          behavior: this.landscapeEventName,
          item_type: this.pageName,
          item_id: this.landscapeEventName,
          attributes: {
            isEmployee: this.accountType && this.accountType === "operation",
          },
        });
        if (!this.tableData.length) return
        if (xxxxxx) {
          this.$jsBridge.setFullScreen()
          this.isFullScreen = true
        }
      } else {
        this.$track({
          context: this.pageName,
          behavior: this.export2ExcelEventName,
          item_type: this.pageName,
          item_id: this.export2ExcelEventName,
          attributes: {
            isEmployee: this.accountType && this.accountType === "operation",
          },
        });
        this.export2Excel()
      }
    },

    async export2Excel() {
      let baseApi = this.$ctx.baseApiList.income;
      const params = deepCopy(this.filterParams)
      delete params.pageNo
      const tableName = this.tableName
      const EmployeetableName = this.EmployeetableName
      console.log('tablename', tableName)
      const isEmployee = this.isEmployee
      params.ImpersonatedContactID = this.$route.query.ImpersonatedContactID
      let accessToken = ''
      if (xxxxxx) {
        accessToken = await this.$jsBridge.getAccessToken()
      } else {
        const {
          data: atData
        } = await this.$request.get('/getAccessToken')
        accessToken = atData.access_token
      }
      params.access_token = accessToken
      // if (params.cities) {
      //   params.cities = encodeURIComponent(params.cities)
      // }
      // if (params.provinces) {
      //   params.provinces = encodeURIComponent(params.provinces)
      // }
      var url = ''
      console.log('tableName', tableName)
      //员工账号导出
      // if (isEmployee) {
      //   console.log('员工')
      //   url = `${baseApi}/export/employee/${tableName}/report?${createQuery(params)}`
      // } else {
      //非员工账号
      url = `${baseApi}/export/nsdapprovals/consultants?${createQuery(params)}`
      // }
      console.log('url', url, params)
      if (xxxxxx) {
        //overwrite 是否需要覆盖下载,true：覆盖原来的文件；false：直接返回已下载过的文件路径
        const data = await this.$jsBridge.downloadFile({
          url,
          overwrite: true
        })

        if (data.result) {
          this.$jsBridge.shareLocalFile(data.filepath)
        } else {
          Toast('抱歉，导出失败，请重新导出');
          return
        }

      } else {
        console.log(this.filterParams,);
        location.href = url
        // const { data } = await this.$request.get(url, {
        //   responseType: "blob"
        // })
        // const a = document.createElement("a")
        // a.download = "首席认可报表.xlsx"
        // a.href = window.URL.createObjectURL(data)
        // console.log(a);
        // a.click()
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    resetToPortraitScreen() {
      this.$track({
        context: this.pageName,
        behavior: this.landscapeEventName,
        item_type: this.pageName,
        item_id: this.landscapeEventName,
        attributes: {
          isEmployee: this.accountType && this.accountType === "operation",
        },
      });
      this.$jsBridge.resetToPortraitScreen()
      this.isFullScreen = false
    },
    back() {
      closeWebview()
    }
  }
}