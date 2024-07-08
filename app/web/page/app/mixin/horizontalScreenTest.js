import {
  xxxxxx,
  closeWebview,
  deepCopy,
  createQuery,
  isIos
} from '../utils/index'
import {
  Popover,
  Toast
} from 'vant'
import html2canvas from 'html2canvas'
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
      ]
    }
  },
  mounted() {
    // if(this.levelCode>=90&&!this.isEmployee){
    //   this.popoverActions=[
    //     {
    //       text: 'Excel导出',
    //       type: 'export'
    //     },
    //     {
    //       text: '横/竖屏切换',
    //       type: 'fullscreen'
    //     }
    //   ]
    // }else{
    //   this.popoverActions=[

    //     {
    //       text: '横/竖屏切换',
    //       type: 'fullscreen'
    //     }
    //   ]
    // }
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

    window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', () => {
      console.log('orientationchange', this.screenRotationType)
      // if(this.screenRotationType === 'landscapeRight' || this.screenRotationType === 'landscapeLeft'){
      //   this.isFullScreen = true
      // } else {
      //   // this.$jsBridge.resetToPortraitScreen()
      //   this.isFullScreen = false
      // }
    })
  },
  methods: {
    gofullscreen() {
      if (!this.tableData.data.length) return
      if (xxxxxx) {
        this.$jsBridge.setFullScreen()
        this.isFullScreen = true
      }
    },
    popoverSelect(action) {

      if (action.type === 'fullscreen') {
        if (!this.tableData.data.length) return
        if (xxxxxx) {
          this.$jsBridge.setFullScreen()
          this.isFullScreen = true
        }
      } else {
        // this.export2Excel()
        this.export2Image()
      }
    },
    async export2Image() {
      const el = document.querySelector(".common-table")
      const canvas = await html2canvas(el, {
        debug: false,
        logging: true,
        useCORS: true,
        scale: 2
      })
      let base64img = canvas.toDataURL('image/jpeg')
      console.log(base64img)
      // const filePathRes = await this.$jsBridge.downloadFile(base64img);
      const result = await this.$jsBridge.saveBase64Photo(base64img.split(',')[1]);
      console.log(result)
      // Toast.success('保存成功');
    },
    async export2Excel() {
      let baseApi = this.$ctx.baseApi;
      const params = deepCopy(this.filterParams)
      const tableName = this.tableName
      const EmployeetableName = this.EmployeetableName
      console.log('tablename', tableName)
      const isEmployee = this.isEmployee
      params.contactId = this.targetContactId
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
      if (params.cities) {
        params.cities = encodeURIComponent(params.cities)
      }
      if (params.provinces) {
        params.provinces = encodeURIComponent(params.provinces)
      }
      var url = ''
      console.log('tableName', tableName)
      //员工账号导出
      if (isEmployee) {
        console.log('员工')
        url = `${baseApi}/export/employee/${tableName}/report?${createQuery(params)}`


      } else {
        //非员工账号

        if (tableName == "unitHistory") {
          url = `${baseApi}/export/unit/history/report?${createQuery(params)}`
        } else {
          url = `${baseApi}/export/${tableName}/report?${createQuery(params)}`
        }
      }




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
        location.href = url
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    resetToPortraitScreen() {
      this.$jsBridge.resetToPortraitScreen()
      this.isFullScreen = false
    },
    back() {
      closeWebview()
    }
  }
}