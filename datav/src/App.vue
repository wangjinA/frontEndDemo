<template>
  <div id="app">
    <Datav-header></Datav-header>
    <main>
      <HelloWorld />
    </main>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import DatavHeader from "./layout/header";

export default {
  name: "App",
  components: {
    HelloWorld,
    DatavHeader,
  },
};
</script>

<style lang="less" scoped>
#app {
  font-family: MicrosoftYaHei;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  height: 100%;
  main {
    flex: 1;
  }
}
</style>
