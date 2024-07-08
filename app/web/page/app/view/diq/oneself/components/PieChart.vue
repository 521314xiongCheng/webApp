<template>
  <div id="echart" class="cicle"></div>
</template>

<script>
// import * as echarts from "echarts";
// require("echarts/theme/macarons");

export default {
  props: {
    value: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  watch: {
    value(val) {
      setTimeout(() => {
        this.setOptions();
      }, 50);
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    setOptions() {
      this.chart = this.$echarts.init(this.$el);
      this.chart.setOption({
        title: {
          text: this.value + "%",
          textStyle: {
            color: "#7F7F7F",
          },
          left: "center",
          top: "center",
        },
        color: ["#f16eae", "rgba(216,216,216,0.5)"],
        series: [
          {
            type: "pie",
            data: [
              {
                value: this.value,
              },
              {
                value: 100 - this.value,
              },
            ],
            radius: ["75%", "100%"],
            label: {
              show: false,
            },
            silent: true, //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
          },
        ],
      });
    },
  },
};
</script>
<style scoped lang="less">
.cicle {
  width: 140px;
  height: 140px;
}
</style>
