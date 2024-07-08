// 只适用于部分场景的页面，请谨慎使用
export default {
  mounted() {
    // 固定表头
    let searchBar = document.querySelector(".search-bar");
    let tableHeaderWrap = document.querySelector(".el-table__header-wrapper");
    let tableBodyWrap = document.querySelector(".el-table__body-wrapper");
    window.addEventListener("scroll", (e) => {
      let tableFixedHeaderWrap = document.querySelector(
        ".el-table__fixed-header-wrapper"
      );
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop >= searchBar.clientHeight) {
        tableFixedHeaderWrap.style.cssText = `position: fixed;top: 0;width: 130px;z-index: 4;overflow: hidden;`;
        tableHeaderWrap.style.cssText = `position: fixed;top: 0;z-index: 4;`;
        tableBodyWrap.style.cssText = `padding-top: ${tableHeaderWrap.clientHeight}px`;
      } else {
        tableFixedHeaderWrap.style.cssText = `position: absolute;top: 0`;
        tableHeaderWrap.style.cssText = `position: unset;`;
        tableBodyWrap.style.cssText = "padding-top: 0;";
      }
    });
  }
}