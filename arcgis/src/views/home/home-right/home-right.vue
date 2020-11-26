<template>
  <div class="home-right">
    <div class="common-title" style="margin-bottom: 1.5vh;">
      <span>出入信息</span>
      <img :src="require('@/assets/images/more-icon.png')" title="更多" @click="$root.modalList.showInout = true" />
    </div>
    <inout-info />
    <div class="common-title" style="margin: 1.5vh 0 1.5vh;">预警信息</div>
    <warning-info />
  </div>
</template>

<script>
import inoutInfo from '../components/inout-info'
import warningInfo from '../components/warning-info'
export default {
  components: {
    inoutInfo,
    warningInfo
  }
}
</script>

<style lang="less" scoped>
.home-right {
  width: var(--home-right-width);
  padding-right: 0.25rem;
  position: absolute;
  right: 0;
  bottom: 0;
  top: var(--header-height-fix);
  overflow: hidden;
  z-index: 2;
}
</style>
