<template>
  <div id="main-container">
    <section class="main-nav-bar">
      <div class="inner">
        <nav-menu/>
      </div>
    </section>

    <section class="main-content-container">
      <div class="main-menu-bar">
        <slider-menu/>
      </div>
      <div class="inner">
        <router-view></router-view>
      </div>
    </section>
  </div>
</template>

<script>
  import NavMenu from "../components/nav-menu";
  import SliderMenu from "../components/slider-menu";
  import {mapActions} from 'vuex'

  export default {
    name: "Index",
    components: {SliderMenu, NavMenu},
    data() {
      return {}
    },
    methods: {
      ...mapActions('platform', ["getAppPage"])
    },
    computed: {
      menuBarWidth() {
        return '200px'
      }
    },
    created() {
   
    }
  }
</script>

<style lang="scss" scoped>
  $nav-bar-height: 60px;
  #main-container {
    width: 100%;
    overflow: auto;
    background-color: #f4f4f4;
    &:after {
      content: "";
      clear: both;
      display: block;
    }
    /*内容*/
    .main-content-container {
      width: 100%;
      display: flex;
      .inner {
        flex: 1;
        overflow: hidden;
      }
    }
    /*左侧菜单栏*/
    .main-menu-bar {
      min-height: calc(100vh - #{$nav-bar-height});
    }
    /*顶部导航条*/
    .main-nav-bar {
      width: 100%;
      .inner {
        height: $nav-bar-height;
      }
    }
  }
</style>
