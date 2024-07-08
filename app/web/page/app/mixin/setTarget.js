export default {
    data() {
        return {
            setTargetDialog: false,
            setTargetTitle: "请输入收入目标",
            setTargetTip: "",
            setTargetSuccessDialog: false,
            setTargetSuccessBtnText: "",
            targetIncomeAmt: null, //设置目标收入
        }
    },
    mounted() {

    },
    methods: {
        initText() {
            if (this.isSettingTarget) {
                this.setTargetTitle = '请修改收入目标'
            } else {
                this.setTargetTitle = '请输入收入目标'
            }
            if (this.levelCode < 60) {
                this.setTargetTip = "当月的收入需要和美容顾问一起达成，一起来评估她们当月的零售绩效吧。"
                this.setTargetSuccessBtnText = "评估美容顾问成员零售业绩"
            } else if (this.levelCode === 60) {
                this.setTargetTip = "当月的收入需要和沙龙成员一起达成，一起来评估她们当月的零售绩效吧。"
                this.setTargetSuccessBtnText = "评估沙龙成员零售业绩"
            } else {
                this.setTargetTip = "当月的收入需要和督导一起达成，一起来评估她们当月的零售绩效吧。"
                this.setTargetSuccessBtnText = "评估区域成员零售业绩"
            }
        },
        async setTargetIncomeConfirm() {
            console.log(this.targetIncomeAmt)
            console.log(this.income.targetIncomeAmt)
            if (!this.targetIncomeAmt) return
            let targetIncomeAmt = parseInt(this.targetIncomeAmt.replaceAll(',', ''))
            if (targetIncomeAmt === this.income.targetIncomeAmt) return
            const {
                data
            } = await this.$request.post(`${this.$ctx.baseApi}/target/income`, {
                targetAmt: targetIncomeAmt,
                sourceType: 'app'
            })
            console.log('setTargetIncomeConfirm', data)
            this.setTargetDialog = false
            this.setTargetSuccessDialog = true
            this.getIncome()
        },
        toEstimate() {
            let path = 'area'
            if (this.levelCode < 60) {
                path = 'team'
            } else if (this.levelCode === 60) {
                path = 'unit'
            } else {
                path = 'area'
            }
            let url = `${window.location.origin}/${path}`;
            const params = {
                monthKey: this.monthKey,
                opaque: false
            }
            this.$go(url, params);
        },
    }
}