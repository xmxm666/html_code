<template>
  <section id="sliderMenu">
    <ul class="c-slider">
        <li @click="clickHandle(item,key)" class="c-slider__item"
            :class="{'is-active':activeIndex===key}"
            v-for="(item,key) in menuConfig "
            :key="key">
          <i class="c-slider__icon" :class="item.icon"></i>
          <em>{{item.legend}}</em>
        </li>
    </ul>
    <ul class="c-slider-sub" v-show="subMenuConfig.length">
        <li class="c-slider-sub__item" @click="subClickHandle(item,key)" :class="{'is-active':subActiveIndex === key}"
            v-for="(item,key) in subMenuConfig " :key="item.legend">
          <em>{{item.legend}}</em>
          <i class="c-slider-sub__icon el-icon-arrow-right"></i>
        </li>
    </ul>
  </section>
</template>

<script>
  // import {mapState, mapActions} from 'vuex'
  import _ from 'lodash'
  import {requestByGet} from "../utils/request";
  import {menu} from "../project-config/menu-config";

  export default {
    data() {
      return {
        activeIndex: null,
        subActiveIndex: null,
        menuConfig: []
      }
    },

    methods: {
      clickHandle(item, key) {

          this.$pushRoute(item.path)

        this.activeIndex = key;
        this.subActiveIndex = null;
      }, subClickHandle(item, key) {
        this.$pushRoute(item.path)
        this.subActiveIndex = key;
      },
      checkRole(roleMenu, currentMenu) {
        var boolean = false;
        roleMenu.forEach(aa => {
          if(aa.legend === currentMenu.legend) {
            boolean = true;
            currentMenu.children = currentMenu.children.filter(currentCh => {
              var booleanCh = false;
               aa.children.forEach(roleCh => {
                 if(roleCh.legend === currentCh.legend) booleanCh = true;
               });
               return booleanCh;
            });
          }
        })
        return boolean;
      }
    },
    computed: {

      subMenuConfig() {
        const target = this.menuConfig[this.activeIndex];
        return target ? target.children : []
      }
    },
    async created() {
      let data = await requestByGet("server/role/allMenu");
      // console.log(menu);
      // console.log(data);
      if (data.code === '200') {
        if(data.data.length === 0) {
          const role = localStorage.getItem('role');
          if(role === "0" || role === "1") {
            this.menuConfig = menu;
          } else {
            this.$message.error("您暂无权限，请联系管理员添加!");
          }
        }else {
          var roleMenu = data.data;
          const allMenu = menu.filter(m => {
            return this.checkRole(roleMenu, m);
          })
          allMenu.forEach(currentValue => {
            currentValue.path = currentValue.children[0].path;
          })
          this.menuConfig = allMenu;
        }
      } else {
        this.$message.error(data.msg);
      }
      this.activeIndex = _.findIndex(this.menuConfig, (item) => {
        return item.path && this.$route.path.includes(item.path)
      });
      this.subActiveIndex = _.findIndex(this.subMenuConfig, (item) => {
        return item.path && this.$route.path === item.path
      });
    }
  }
</script>
<style lang="scss" scoped>
  @import "../assets/common";

  #sliderMenu {
    height: 100%;
    display: flex;
    overflow: hidden;
    .c-slider {
      width: 140px;
      height: 100%;
      background-color: #24303c;
      padding-top: 30px;
      box-sizing: border-box;
      &__item {
        box-sizing: border-box;
        @include flex-center;
        padding: 16px 0;
        font-size: 14px;
        height: 48px;
        color: #e5e5e5;
        position: relative;

        &:hover, &.is-active {
          background-color: #19222e;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          transition: background-color .2s linear;
          .c-slider__icon {
            color: #fff;
            font-weight: bold;
          }
          &:before {
            @include absoluteFull;
            right: auto;
            content: "";
            width: 2px;
            background-color: #00aeff;
          }
        }

      }
      &__icon {
        font-size: 16px;
        margin-right: 10px;
        margin-left: -10px;
      }
    }
    .c-slider-sub {
      width: 120px;
      height: 100%;
      background-color: #fff;
      padding-top: 20px;
      box-sizing: border-box;
      border-right: 1px solid #f4f4f4;
      &__item {
        @include flex-between;
        box-sizing: border-box;
        padding: 0 12px;
        height: 50px;
        cursor: pointer;
        font-size: 12px;
        color: #666;
        &:hover {
          background-color: #edf6ff;
        }
        &.is-active {
          background-color: #edf6ff;
          color: #00aeff;
          transition: background-color .2s linear;
        }
      }
      &__icon {
        font-weight: bold;
      }
    }
  }
</style>
