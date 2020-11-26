<!--
 * @Author: 汪锦
 * @Date: 2020-10-26 09:12:56
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-10-26 10:13:41
 * @Description: 信息采集情况 - home左中
-->
<template>
  <ul class="infoNum">
    <li v-for="(item, index) in list" :key="index">
      <label>
        <img :src="item.icon" />
        {{ item.name }}
      </label>
      <img src="./images/light-line.png" />
      <span>{{ item.value }}</span>
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
          icon: require('./images/num-1.png')
        },
        {
          name: '房屋数量',
          value: 1230,
          icon: require('./images/num-2.png')
        },
        {
          name: '车辆数量',
          value: 1230,
          icon: require('./images/num-3.png')
        },
        {
          name: '设备数量',
          value: 1230,
          icon: require('./images/num-4.png')
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.infoNum {
  display: grid;
  gap: 0.19rem 0.34rem;
  grid-template: repeat(2, max-content) ~'/' repeat(2, max-content);
  > li {
    flex: 1;
    width: 1.35rem;
    height: 0.86rem;
    align-items: center;
    justify-content: center;
    position: relative;
    .bg-style('./images/info-num-bg.png');
    .flex-col();
    & > img {
      position: absolute;
      width: 100%;
      top: 40%;
    }
    > span {
      font-size: 0.32rem;
      color: rgba(20, 255, 252, 1);
    }
    > label {
      font-size: 0.16rem;
      display: flex;
      align-items: center;
      & > img {
      }
    }
  }
}
</style>
