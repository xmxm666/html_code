<template>
  <div id="CustomerView">
    <header-bar legend="学校概览"/>
    <body-container>
      <ul class="c-statistics">
        <li class="c-statistics__item">
          <div class="c-statistics__text">
            <strong class="strong">88456</strong>
            <em class="legend">累计访客数</em>
          </div>
          <el-progress :stroke-width="12" color="#63eff9" class="c-pie" type="circle" :percentage="80"></el-progress>
        </li>
        <li class="c-statistics__item">
          <div class="c-statistics__text">
            <strong class="strong">88456</strong>
            <em class="legend">累计访客数</em>
          </div>
          <el-progress :stroke-width="12" class="c-pie" type="circle" :percentage="80" color="#8e71c7"></el-progress>
        </li>
        <li class="c-statistics__item">
          <div class="c-statistics__text">
            <strong class="strong">88456</strong>
            <em class="legend">累计访客数</em>
          </div>
          <el-progress :stroke-width="12" color="#63eff9" class="c-pie" type="circle" :percentage="80"></el-progress>

        </li>
        <li class="c-statistics__item">
          <div class="c-statistics__text">
            <strong class="strong">88456</strong>
            <em class="legend">累计访客数</em>
          </div>
          <el-progress :stroke-width="12" class="c-pie" type="circle" :percentage="80"></el-progress>
        </li>
      </ul>
      <h3 class="c-title-bar">
        <em>客户分布</em>
        <i class="el-icon-question icon"></i>
      </h3>
      <section class="c-leader-board">
        <div ref="map" style="width: 800px;height: 500px"></div>
        <el-table
          stripe
          ref="multipleTable"
          :data="tableData3"
          tooltip-effect="dark"
          border
          style="min-width: 500px">
          <el-table-column
            label="排行"
            align="center"
            width="100">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="地区"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="粉丝数"
            align="center"
       >
          </el-table-column>
        </el-table>
      </section>
    </body-container>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../components/header-bar";
  import BodyContainer from "../../components/body-container";
  import {initMap} from "./map";
  import Echarts from 'echarts'
  import '../../lib/china'

  export default {
    name: "CustomerView",
    components: {BodyContainer, HeaderBar},
    data() {
      return {
        tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        multipleSelection: []
      }
    },
    methods: {},
    computed: {},
    created() {
      this.$nextTick(() => {
        const options = initMap();
        const mycharts = Echarts.init(this.$refs.map);
        mycharts.setOption(options);
      })
    }
  }
</script>
<style>
  #CustomerView .el-progress__text {
    color: #fff;
  }
</style>
<style scoped lang="scss">
  @import "../../assets/common";

  #CustomerView {

    .c-statistics {
      @include alignCenter;
      height: 200px;
      background-color: #3F4650;
      border: 10px solid #4D5460;
      box-sizing: border-box;
      &__text {
        display: flex;
        flex-direction: column;
      }
      &__item {
        @include flex-between;
        height: 100%;
        flex: 1;
        padding: 0 20px;
        &:not(:first-child) {
          border-left: 6px solid #4D5460;
        }
        .strong {
          color: #63eff9;
          font-size: 20px;
        }
        .legend {
          color: #fff;
          font-size: 14px;
          margin-top: 6px;
        }
      }
    }
    .c-title-bar {
      background-color: #F8F8F8;
      height: 50px;
      @include flex-between;
      padding: 0 30px;
      font-size: 18px;
      color: #333;
      position: relative;
      text-indent: 6px;
      margin-top: 30px;
      .icon {
        color: #BBBBBB;
      }
      &:before {
        background-color: #EF7E31;
        width: 4px;
        left: 22px;
        height: 26px;
        transform: translateY(-50%);
        content: "";
        top: 50%;
        position: absolute;
        display: block;
      }
    }
    .c-leader-board{
      @include alignCenter;
    }
  }
</style>
