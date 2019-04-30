<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    created() {
      console.log("=>测试更新 v1");
    }
  }
</script>

<style lang="scss">
  .cl::after {
    content: ".";
    clear: both;
    display: block;
    overflow: hidden;
    font-size: 0;
    height: 0;
  }

  .cl {
    zoom: 1;
  }

</style>
