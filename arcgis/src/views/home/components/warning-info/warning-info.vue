<!--
 * @Author: 汪锦
 * @Date: 2020-10-26 09:43:57
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-10-30 10:24:16
 * @Description: 预警信息 - home右下
-->
<template>
  <ul class="warning-info">
    <li v-for="(item, index) in list" :key="index">
      <div class="wi-title">{{ item.type }}预警</div>
      <!-- <div class="wi-img-box">
        <img :src="item.img" />
      </div>
      <div class="wi-info-box">
        <div class="wi-name">{{ item.name }}</div>
        <span>{{ item.createTime }}</span>
        <p>{{ item.address }}</p>
      </div>
      <div class="warningType">{{ item.warningType }}</div> -->
      <div class="waitOpen">待开发...</div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'warning-info',
  data() {
    return {
      list: [
        {
          name: '张嘉译',
          createTime: '2020-9-3 11:23',
          type: '人脸识别',
          address: '昌平区南口镇民族大街439号4栋502房',
          sex: '男',
          img: require('./images/img-1.jpg'),
          warningType: '重点人员'
        },
        {
          name: '京N 854JA',
          createTime: '2020-9-3 11:23',
          type: '车禁',
          address: '宝胜路往永泰庄东路方向',
          img: require('./images/img-2.jpg'),
          warningType: '嫌疑车辆'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.warning-info {
  > li {
    flex: 1;
    display: flex;
    align-items: center;
    height: 2.25rem;
    padding-left: 0.2rem;
    padding-right: 0.22rem;
    position: relative;
    .hover();
    .bg-style('./images/bg.png');
    .waitOpen {
      position: absolute;
      left: 0.5rem;
      right: 0.22rem;
      top: 0.3rem;
      bottom: 0.35rem;
      // background-color: rgba(0, 21, 39, 0.7);
      .bg-style('./images/bg-item.png');
      color: #718c9c;
      font-size: 0.22rem;
      .flex-center();
    }
    .warningType {
      position: absolute;
      right: 0.39rem;
      top: 0.32rem;
      border: 1px solid #ff2e2e;
      color: #ff2e2e;
      font-size: 0.12rem;
      border-radius: 0.03rem;
      background-color: rgba(255, 46, 46, 0.2);
      padding: 0 0.08rem;
    }
    .wi-title {
      writing-mode: tb-rl;
      letter-spacing: 0.02rem;
      font-size: 0.16rem;
      margin-right: 0.18rem;
    }
    .wi-img-box {
      height: 1.17rem;
      width: 0.93rem;
      margin-right: 0.1rem;
      flex-shrink: 0;
      > img {
        .wh100-img();
      }
    }
    .wi-info-box {
      flex: 1;
      height: 1.17rem;
      .flex-col();
      justify-content: space-between;
      filter: blur(2px);
      .wi-name {
        color: #70fbfd;
        font-size: 0.22rem;
      }
      > span {
        // font-size: 0.18rem;
      }
      > p {
        // color: rgba(255, 255, 255, 0.9);
        .text-overflow1();
      }
    }
  }
}
</style>
