<template>
  <div id="HeaderBar" class="c-header">
    <div class="l-left">

        <h2 class="l-left__text">
            <el-tag>{{legend}}<i class="el-icon-arrow-right icon"></i></el-tag>
          </h2>
        <slot name="left"/>
      </div>
    <div class="l-right">
        <slot/>
      </div>

  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "HeaderBar",
    props: {
      legend: {
        type: String
      }
    },
    data() {
      return {}
    },
    methods: {},
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/common";

  #HeaderBar {
    height: 60px;
    background:#f2f2f2;
    overflow: hidden;
    @include alignCenter;
    padding: 0 20px;
    @include flex-between;
    .l-left{
      @include alignCenter;
      height: 100%;
      &__text{
        font-size: 16px;
        color: #515a6e;
      }
      .icon{
        font-weight: bold;
      }
    }
    .l-right{
      display: flex;
      align-items: center;
    }
    .c-header {
      &__legend {
        font-size: 16px;
        color: rgba(77, 77, 77, 1);
      }
    }
  }
</style>
