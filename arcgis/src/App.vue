<!--
 * @Author: 汪锦
 * @Date: 2020-07-13 09:19:58
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-11-02 11:30:26
 * @Description: 文件描述
-->
<template>
  <div id="app">
    <gisMap />
  </div>
</template>

<script>
import gisMap from '@/components/gisMap/gisMap'
export default {
  name: 'app',
  components: { gisMap },
  mounted() {},
  created() {}
}
</script>

<style lang="less">
// 补padding-top
.main-view {
  padding-top: var(--header-height-fix);
  &.hideHeader {
    padding-top: 0;
  }
}
</style>
