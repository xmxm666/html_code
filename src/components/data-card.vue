<template>
  <transition appear enter-active-class="animated bounceIn">
    <div id="DataCard">
      <h3 class="c-legend">{{legend}}</h3>
      <div class="c-card" :style="{backgroundColor:color}">
        <el-row class="l-top">
          <el-col :span="14" class="c-main">
            <em class="legend">今日</em>
            <strong class="num">{{data?data.today:'8888'}}</strong>
          </el-col>
          <el-col :span="10" class="c-sub">
            <p class="c-sub__item"><em class="legend">昨日</em>
              <strong class="num">{{data?data.yesterday:'8888'}}</strong></p>
            <p class="c-sub__item"><em class="legend">近7日</em>
              <strong class="num">{{data?data.sevenDay:'8888'}}</strong></p>
          </el-col>
        </el-row>
        <el-row class="l-bottom">
          <el-col :span="14" class="l-bottom__left">
            <em class="legend">总金额</em>
            <strong class="num" style="margin-left: 10px">{{data?data.total:'8888'}}</strong>
          </el-col>
          <el-col :span="10" class="l-bottom__right">
            <em class="legend">近30日</em>
            <strong class="num">{{data?data.monthDay:'8888'}}</strong>
          </el-col>
        </el-row>
      </div>
    </div>
  </transition>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "DataCard",
    props: {
      color: {
        type: String,
        default: "#F6AD3A"
      },
      legend: {
        type: String,
      },
      data:{
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

  #DataCard {

    .c-card{
      width: 283px;
      height: 168px;
      border-radius: 4px;
      box-shadow: 0px 2px 5px 0px rgba(246, 173, 58, 0.4);
      cursor: pointer;
    }
    &:hover {
      opacity: .7;
    }
    .l-top {
      height: 70%;
      box-sizing: border-box;
      .c-main {
        position: relative;
        @include flex-center;
        border-right: 1px solid #FFFFFF;
        border-bottom: 1px solid #FFFFFF;
        height: 100%;
        .legend {
          position: absolute;
          left: 16px;
          top: 17px;
          font-size: 12px;
          color: rgba(255, 255, 255, 1);
        }
        .num {
          font-size: 24px;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
        }
      }
      .c-sub {
        height: 100%;
        &__item {
          box-sizing: border-box;
          position: relative;
          height: 50%;
          font-size: 12px;
          border-bottom: 1px solid #FFFFFF;
          color: rgba(255, 255, 255, 1);
        }
        .legend {
          position: absolute;
          left: 13px;
          top: 13px;

        }
        .num {
          position: absolute;
          right: 12px;
          bottom: 12px;
        }
      }
    }
    .l-bottom {
      height: 30%;
      box-sizing: border-box;
      color: #fff;
      &__right {
        height: 100%;
        position: relative;
        font-size: 12px;
        .legend {
          position: absolute;
          left: 13px;
          top: 13px;
        }
        .num {
          position: absolute;
          right: 12px;
          bottom: 12px;
        }
      }
      &__left {
        height: 100%;
        position: relative;
        @include alignCenter;
        font-size: 14px;
        padding-left: 13px;
        border-right: 1px solid #fff;
      }
    }
    .c-legend {
      color: #333;
      font-size: 14px;
      margin: 20px 0 10px 10px;
    }
  }
</style>
