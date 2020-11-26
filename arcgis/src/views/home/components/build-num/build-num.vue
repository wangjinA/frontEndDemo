<!--
 * @Author: 汪锦
 * @Date: 2020-10-22 17:30:40
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-10-30 12:09:13
 * @Description: 建设信息 - home左上
-->
<template>
  <ul class="buildNum">
    <li v-for="(item, index) in list" :key="index">
      <v-countup :end-value="item.value"></v-countup>
      <img src="./images/light-line.png" />
      <label>{{ item.name }}</label>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'buildNum',
  data() {
    return {
      list: [
        {
          name: '在建数量',
          value: 1230
        },
        {
          name: '已建数量',
          value: 1230
        },
        {
          name: '汇聚数量',
          value: 1230
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
  },
  created() {}
}
</script>

<style lang="less" scoped>
.buildNum {
  display: flex;
  > li {
    flex: 1;
    height: 0.93rem;
    align-items: center;
    .flex-col();
    > span {
      font-size: 0.32rem;
    }
    > img {
      width: 100%;
    }
    > label {
      font-size: 0.18rem;
    }
    &:nth-of-type(1) {
      background: linear-gradient(90deg, rgba(102, 216, 251, 0.75) 0%, rgba(102, 216, 251, 0.076) 8%, rgba(102, 216, 251, 0.07) 70%);
    }
    &:nth-of-type(2) {
      background: linear-gradient(90deg, rgba(239, 121, 48, 0.75) 0%, rgba(239, 121, 48, 0.076) 8%, rgba(239, 121, 48, 0.07) 70%);
    }
    &:nth-of-type(3) {
      background: linear-gradient(90deg, rgba(45, 126, 241, 0.75) 0%, rgba(45, 126, 241, 0.076) 8%, rgba(45, 126, 241, 0.07) 70%);
    }
  }
}
</style>
