<!--
 * @Author: 汪锦
 * @Date: 2020-10-26 09:12:56
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-10-30 12:10:03
 * @Description: 信息采集情况 - home左中
-->
<template>
  <ul class="infoNum">
    <li v-for="(item, index) in list" :key="index">
      <div class="xf_conter">
        <img :src="item.icon" />
        <div class="in-name">{{ item.name }}</div>
        <v-countup class="in-value" :end-value="item.value"></v-countup>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'infoNum',
  data() {
    return {
      list: [
        {
          name: '人口数量',
          value: 1230,
          icon: require('./images/num-v2-1.png')
        },
        {
          name: '房屋数量',
          value: 1230,
          icon: require('./images/num-v2-2.png')
        },
        {
          name: '车辆数量',
          value: 1230,
          icon: require('./images/num-v2-3.png')
        },
        {
          name: '设备数量',
          value: 1230,
          icon: require('./images/num-v2-4.png')
        }
      ]
    }
  },
  watch: {
    area: {
      immediate: true,
      handler() {
        if (this.area != '昌平区') {
          this.list = this.list.map(item => ({
            ...item,
            value: this.$utils.randomNumber(500, 2500)
          }))
        } else {
          Object.assign(this.$data, this.$options.data())
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.infoNum {
  position: relative;
  padding-left: 0.2rem;
  height: 2.3rem;
  .bg-style('./images/dpan.png');
  &::after {
    // content: '';
    width: 90%;
    height: 100%;
    position: absolute;
    left: 0;
    bottom: -0.35rem;
    z-index: 0;
    background-image: url('./images/dpan.png');
    // animation: ghostUpdown 1.8s infinite alternate;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position-y: bottom;
    @keyframes ghostUpdown {
      40% {
        transform: translateY(0.08rem);
      }

      to {
        transform: translateY(-0rem);
      }
    }
  }
  > li {
    z-index: 1;
    position: relative;
    &:nth-child(1) {
      margin-left: 0.2rem;
      margin-bottom: -0.1rem;
    }
    &:nth-child(2) {
      margin-left: 1rem;
    }
    &:nth-child(3) {
      margin-left: -0.1rem;
    }
    &:nth-child(4) {
      margin-left: 1.3rem;
      margin-top: -0.2rem;
    }
    animation: ghostUpdown 1.5s infinite alternate;
    @keyframes ghostUpdown {
      from {
        transform: translateY(0.15rem);
      }
      to {
        transform: translateY(0.05rem);
      }
    }
    .xf_conter {
      position: relative;
      &::after {
        content: '';
        top: 90%;
        position: absolute;
        height: 0.4rem;
        opacity: 0.46;
        left: 0.45rem;
        border: 1px dashed rgba(135, 251, 203, 0.6);
      }
      .in-name {
        margin-left: 0.7rem;
        font-size: 0.15rem;
        font-family: Source Han Sans CN Normal, Source Han Sans CN Normal-Normal;
        font-weight: Normal;
        color: #efefef;
      }
      .in-value {
        margin-left: 0.7rem;
        font-size: 0.2rem;
        font-family: DINPro Medium, DINPro Medium-Medium;
        font-weight: 500;
        color: rgba(102, 240, 200, 1);
      }
      & > img {
        position: absolute;
        width: 0.7rem;
        top: -0.1rem;
        left: 0.1rem;
      }
    }
  }
}
</style>
