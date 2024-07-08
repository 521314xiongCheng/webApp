<template>
  <div class="content">
    <div>
      <p class="title">
        {{ this.productionAmtMdata.productionAmtmc.text }}
        <span> ({{ this.productionAmtMdata.productionAmtmc.date }}) </span>
      </p>
      <div class="change">
        <div class="changebg" @click="openNumber">
          <span>
            {{ this.productionAmtMdata.targetProductionAmt |formatMoney}}
          </span>
          <img src="../../images/edit.png" alt="" class="edit" />
        </div>
        <div class="sum">
          （已达成绩效：{{
            this.productionAmtMdata.productionAmt  |formatMoney
          }}）
        </div>
      </div>
    </div>
    <div>
      <p class="title">目标参考</p>
      <div class="productmap">
        <div @click="lastMonthpro" :class="{productionBg:lastMonth}">
          <p>上个月业绩</p>
          <p>{{ this.productionAmtMdata.reference.lastMonthProductionAmt | formatMoney }}</p>
        </div>
        <div @click="halfYearpro" :class="{productionBg:halfYear}">
           <p>近6个月平均业绩</p>
          <p>{{ this.productionAmtMdata.reference.halfYearAvgProductionAmt | formatMoney }}</p>
        </div>
      </div>
    </div>

    <div>
      <p class="title">收益分析</p>
      <div class="Income">
        <p>
          {{this.productionAmtMdata.incomeDescribe}}
        </p>

        <p class="active" @click="shareToWechat" v-if="!this.productionAmtMdata.setTargetProductionAmt">邀请她设定当月收入目标</p>
      </div>
    </div>
    <div class="btn" @click="addproduction">保存绩效</div>
    <van-number-keyboard
      v-model="pro"
      :show="show"
      theme="custom"
      close-button-text="完成"
      @blur="
        show = false
      "
      @input="onInput"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import {
 NumberKeyboard,
 Dialog,
} from "vant";
import {
  isIos,
  isIphoneX,
  closeWebview,
  formatMoney,
} from "../../utils/index";
export default {
  props: ["productionAmtMdata"],
  data() {
    return {
        pro:'',
        show:false,
        lastMonth:false,
        halfYear:false,
    };
  },
  created() {
 
  },
  methods: {
      onInput(key){
        
        
      },
      onDelete(){
       
      },
      shareToWechat() {
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
      async share() {
        let baseApi = this.$ctx.baseApi;
        const inviteLinkData = await this.$request.post(`${baseApi}/invite/link`);
        console.log(inviteLinkData);
        let shareUrl = `${this.$ctx.baseShareUrl}?linkKey=${inviteLinkData.data.linkKey}`;
        const shareArg = {
          kind: "media",
          title: "写下你的收入愿望，我们一起实现她",
          description: "愿望无论大小，说不定就实现了呢？",
          thumbnail: "",
          mediatype: "webpage",
          scene: "WXSceneSession",
          url: shareUrl,
        };
        this.$jsBridge.shareToWechat(shareArg);
      },
      addproduction(){
        //传设定值
        this.$emit('addProduction',this.productionAmtMdata.targetProductionAmt)
      },
      lastMonthpro(){
        this.lastMonth=true
        this.halfYear=false
        this.productionAmtMdata.targetProductionAmt=this.productionAmtMdata.reference.lastMonthProductionAmt
        this.estimateData(this.productionAmtMdata.targetProductionAmt)
     },
      halfYearpro(){
        this.lastMonth=false
        this.halfYear=true
        this.productionAmtMdata.targetProductionAmt=this.productionAmtMdata.reference.halfYearAvgProductionAmt
        this.estimateData(this.productionAmtMdata.targetProductionAmt)
      },
      openNumber(){
        this.show=true
        this.lastMonth=false
        this.halfYear=false
        this.pro=''
        //改变面板高度
        this.$emit("changeHeight")

      },
      //实时输入接口
      async estimateData(data){
        let baseApi = this.$ctx.baseApi;
        const params={}
        params.estimateProductionAmt=data
        const res=await this.$request.get(
          `${baseApi}/estimate/production`,{params}
        );
     
        this.productionAmtMdata.incomeDescribe=res.data.incomeDescribe
      }
      
  },
  components:{
      'van-number-keyboard':NumberKeyboard
      
  },
    watch: {
    pro: function (newvalue, oldvalue) {
    this.productionAmtMdata.targetProductionAmt=Number(newvalue)
    this.estimateData(this.productionAmtMdata.targetProductionAmt)
    }
  },

};
</script>

<style lang="less" scoped>
.title {
  font-size: 32px;
  color: #303133;
  line-height: 28px;
}
.content > div {
  margin-top: 40px;
}
.content {
  padding: 25px;
}
.change {
  display: flex;
  align-items: baseline;
}
.changebg {
  position: relative;
  margin-top: 25px;
  width: 293px;
  height: 81px;
  border-radius: 10px;
  background: #fff7fa;
  padding:0 15px;
  line-height: 81px;
  font-size: 50px;
  color: #f16eae;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.edit {
  width: 25px;
  height: 25px;
  // position: absolute;
  // right: 5px;
  // top: 50%;
  // transform: translateY(-50%);
}
.sum {
  font-size: 24px;
  color: #303133;
  margin-left: 20px;
}
.productmap {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
}
.productmap > div {
 flex: 1;
 margin: 4px;
  height: 100px;
  background: #f8f8f8;
  border-radius: 8px;
  font-size: 24px;
  text-align: center;
  font-weight: 400;
  color: #484848;
  padding: 15px 0px;
  box-sizing: border-box;
}
.productmap .active {
  background: #fff7fa;
}
.Income {
  width: 100%;
  border: 1px dotted #f16eae;
  border-radius: 8px;
  padding: 15px;
  font-size: 28px;

  color: #484848;
  line-height: 36px;
  margin-top: 25px;
}
.Income span {
  color: #f16eae;
}
.Income .active {
  color: #f16eae;
  text-align: right;
  margin-top: 10px;
}
.btn {
  width: 356px;
  height: 61px;
  background: #f16eae;
  box-shadow: 0px 1px 3px 0px rgba(255, 255, 255, 0.5);
  border-radius: 31px;
  margin: 20px auto;
  text-align: center;
  line-height: 61px;
  color: white;
}
.productmap .productionBg{
background-color: #FFF7FA;
color:#f16eae ;
}
</style>
