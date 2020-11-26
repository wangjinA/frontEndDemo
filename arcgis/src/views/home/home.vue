<template>
  <div class="st-home">
    <!-- 选择区域 -->
    <hy-modal class="select-area-modal" v-model="showArea" footerHide hideBackgournd :width="10" :height="8.5">
      <area-echart class="area-echart"></area-echart>
    </hy-modal>
    <transition name="leftSide" appear>
      <home-left />
    </transition>
    <transition name="rightSide" appear>
      <home-right />
    </transition>
    <transition name="showScaleDelay" appear>
      <div class="select-area" @click="showArea = true">
        <img src="@/assets/images/location-icon.png" />
        <span>{{ area }}</span>
      </div>
    </transition>
  </div>
</template>
<script>
import homeLeft from './home-left'
import hyModal from '@/components/hy-modal'
import homeRight from './home-right'
import areaEchart from '@/views/home/components/area-echart'
export default {
  name: 'home',
  data() {
    return {
      showArea: false
    }
  },
  components: {
    homeLeft,
    homeRight,
    areaEchart,
    hyModal
  }
}
</script>

<style lang="less" scoped>
.select-area {
  position: fixed;
  top: calc(var(--header-height-fix));
  right: calc(var(--home-right-width) + 1rem);
  .bg-style('~@/assets/images/current-area-bg.png');
  .hover();
  .flex-center();
  font-size: 0.16rem;
  height: 0.4rem;
  min-width: 1.63rem;
  padding: 0 0.2rem;
  > img {
    height: 0.2rem;
    margin-right: 0.1rem;
    margin-top: 0.02rem;
  }
}
.select-area-modal /deep/ .hyModal-wrap-close {
  right: 1rem;
  top: 12%;
}
</style>
