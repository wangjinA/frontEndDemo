<template>
  <div class="home-left">
    <div class="common-title" style="margin-bottom: 2vh;">建设情况</div>
    <transition appear name="scaleX">
      <build-num />
    </transition>
    <div class="common-title" style="margin: 2vh 0 1vh;">信息采集情况</div>
    <transition appear name="scaleY">
      <info-num />
    </transition>
    <div class="common-title" style="margin: 2vh 0 0;">各镇街建设情况排名</div>
    <echart-template :options="townRanking" height="3.6rem" />
  </div>
</template>

<script>
import buildNum from '../components/build-num'
import infoNum from '../components/info-num'
import { townRanking } from '../config'
export default {
  components: {
    buildNum,
    infoNum
  },
  data() {
    return {
      townRanking
    }
  }
}
</script>

<style lang="less" scoped>
.home-left {
  width: var(--home-left-width);
  padding-left: 0.29rem;
  position: absolute;
  left: 0;
  bottom: 0;
  top: var(--header-height-fix);
  overflow: hidden;
  z-index: 2;
}
</style>
