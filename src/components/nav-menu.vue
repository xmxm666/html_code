<template>
  <div id="NavMenu">
    <nav class="nav">
      <section class="l-left">
        <i class="nav__logo"></i>
        <em class="nav__legend">老年大学后台</em>
        <i class="iconfont icon-caidan nav__icon"></i>
        <i class="el-icon-refresh nav__icon"></i>
      </section>
      <section class="l__right">
        <i class="iconfont icon-yonghu nav__icon"></i>
        <em class="nav__text">欢迎您，管理员</em>
        <i class="iconfont icon-zhuye nav__icon"></i>
        <i class="iconfont icon-tuichu5 nav__icon" @click="drop"></i>
      </section>
    </nav>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    name: "NavMenu",
    data() {
      return {
        activeIndex2: "1",
      }
    },
    computed: {},
    methods: {

      ...mapActions(["logout"]),
      handleSelect(index) {
        if (!isNaN(index)) {

        }
      },
      async logoutHandle(command) {
        if (command === "logout") {
          const res = await this.logout();
          if (res.code === 200) {
            this.$message.success("成功退出登录！");
            setTimeout(_ => {
              window.location.reload();
            }, 500);
          }
        }
      },
      drop(){
        sessionStorage.clear();
        localStorage.clear()
        window.location.reload();
      }
    },
    watch: {},
    components: {}
  }
</script>
<style lang="scss">
  #NavMenu {
    .el-menu-item, .el-submenu {
      float: right;
    }

  }

  .middle-text {
    vertical-align: middle;
  }
</style>
<style lang="scss" scoped>
  @import "../assets/common";

  #NavMenu {
    height: 100%;
    .nav {
      @include alignCenter;
      padding: 0 20px;
      height: 100%;
      box-sizing: border-box;
      background-color: #FFFFFF;
      border-bottom: 1px solid #ccc;
      color: rgba(51, 51, 51, 1);
      .l-left, .l-right {
        flex: 1;
        height: 100%;
        @include alignCenter;
      }
      &__logo {
        width: 30px;
        height: 30px;
        background-image: url("../assets/img/logo.png");
        background-size: 100% 100%;
      }
      &__icon {
        margin-left: 20px;
        font-size: 18px;
      }
      &__legend {
        margin-left: 20px;
        font-size: 18px;
      }
      &__text {
        margin-left: 20px;
        font-size: 16px;
      }
      &__logo, &__icon, &__legend, &__text {
        cursor: pointer;
        &:hover{
          opacity: .7;
        }
      }

    }

  }
</style>
