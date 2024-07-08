<template>
  <div class="con" @click="closeBox">
    <div class="largebox">
      <p class="largebox-name">{{ largeTextInfo.name }}</p>
      <p class="largebox-data" id="largeData">
        {{ largeTextInfo.data | formatMoney }}
        <img src="../../images/copy.png" alt="" @click.stop="copy" />
      </p>
      <p class="largebox-label">{{ largeTextInfo.label }}</p>
    </div>
  </div>
</template>

<script >
import { formatMoney } from "../../utils/index";
export default {
  props: ["largeTextInfo"],
  methods: {
    closeBox() {
      console.log("11");
      this.$emit("closeLargeText");
    },
    copy() {
      console.log("111");
    },
  },
};
</script>

<style lang="less" scoped>
.con::-webkit-scrollbar {
  width: 0px;
  display: none;
}
.con {
  display: flex;
  display: -webkit-flex;
  background: white;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;
  z-index: 1000;
}
.largebox {
  background: white;

  &-name {
    font-size: 55px;
  }
  &-label {
    font-size: 65px;
    margin-top: 30px;
  }
  &-data {
    font-weight: bold;
    color: #333333;
    font-size: 85px;
    margin-top: 30px;
  }
}
</style>