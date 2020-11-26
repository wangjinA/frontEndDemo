<!--
 * @Author: 梁智超
 * @Date: 2020-11-11 15:56:46
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-11-12 16:38:30
 * @Description: 
-->
<template>
  <div id="app">
    123
    <router-view />
  </div>
</template>

<style lang="less">
html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
* {
  box-sizing: border-box;
}
#app {
  height: 100%;
  width: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
