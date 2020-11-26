<!--
 * @Author: 汪锦
 * @Date: 2020-10-26 09:43:57
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-10-26 16:29:09
 * @Description: 出入信息 - home右上
-->
<template>
  <div class="inout-info">
    <scroll-table :data="list" :showHeader="false" :line-height="1.03" :showLength="3">
      <template #list="{item}">
        <div class="ii-item">
          <div class="ii-img-box">
            <img :src="item.img" />
          </div>
          <div class="ii-info-box">
            <div class="ii-top">
              <div class="ii-name">{{ item.name }}</div>
              <img v-if="item.sex" :src="item.sex === '男' ? require('./images/male.png') : require('./images/famale.png')" />
              <span>{{ item.createTime }}</span>
            </div>
            <span>{{ item.type }}</span>
            <p>{{ item.address }}</p>
          </div>
        </div>
      </template>
    </scroll-table>
  </div>
</template>

<script>
export default {
  name: 'inout-info',
  data() {
    return {
      list: [
        {
          name: '张嘉译',
          img: require('./images/img-1.jpg'),
          createTime: '2020-9-3 11:23',
          type: '人脸识别',
          address: '昌平区南口镇民族大街439号4栋502房',
          sex: '男'
        },
        {
          name: '京N 854JA',
          img: require('./images/img-2.jpg'),
          createTime: '2020-9-3 11:23',
          type: '车禁',
          address: '宝胜路往永泰庄东路方向'
        },
        {
          name: '张嘉译',
          img: require('./images/img-1.jpg'),
          createTime: '2020-9-3 11:23',
          type: '人脸识别',
          address: '昌平区南口镇民族大街439号4栋502房',
          sex: '男'
        },
        {
          name: '京N 854JA',
          img: require('./images/img-2.jpg'),
          createTime: '2020-9-3 11:23',
          type: '车禁',
          address: '宝胜路往永泰庄东路方向'
        }
        // {
        //   name: '在线',
        //   img: require('./images/img-3.jpg'),
        //   createTime: '2020-9-3 11:23',
        //   type: '门禁',
        //   address: '东莞市麻涌镇XX村牌坊口'
        // }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .scrollTable-list-box-item {
  &:nth-of-type(3n + 1) {
    .bg-style('./images/fang-1.png');
  }
  &:nth-of-type(3n + 2) {
    .bg-style('./images/fang-2.png');
  }
  &:nth-of-type(3n + 3) {
    .bg-style('./images/fang-3.png');
  }
}
.inout-info {
  .ii-item {
    flex: 1;
    display: flex;
    padding: 0.16rem 0;
    padding-left: 0.21rem;
    padding-right: 0.16rem;
    .hover();
    .ii-img-box {
      height: 0.71rem;
      width: 0.56rem;
      margin-right: 0.17rem;
      flex-shrink: 0;
    }
    .ii-info-box {
      flex: 1;
      .flex-col();
      justify-content: space-between;
      .ii-top {
        display: flex;
        align-items: center;
        > img {
          height: 0.16rem;
          margin-left: 0.05rem;
        }
        > span {
          color: rgba(255, 255, 255, 0.6);
          margin-left: auto;
          font-size: 0.12rem;
        }
      }
      .ii-name {
        color: #70fbfd;
      }
      > span {
      }
      > p {
        font-size: 0.12rem;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}
</style>
