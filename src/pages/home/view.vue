<template>
  <div id="home">
    <header-bar legend="数据概览">
      <el-select size="small" v-model="value" filterable  placeholder="请选择" @change="selectSchool(value)">
        <el-option
          v-for="item in schoolData"
          :key="item.schoolId"
          :label="item.schoolName"
          :value="item.schoolId">
        </el-option>
      </el-select>
      <el-button type="success" size="small" style="width: 80px;margin-left: 20px">确认</el-button>
    </header-bar>
    <body-container color="#f4f4f4">
      <ul class="c-card-list">
        <li class="c-card-list__item">
          <data-card legend="营业额"/>
        </li>
        <li class="c-card-list__item">
          <data-card legend="营业额"  color="#FE8087"/>
        </li>
        <li class="c-card-list__item">
          <data-card legend="营业额" color="#5CBBF2"/>
        </li>
      </ul>  <ul class="c-card-list">
        <li class="c-card-list__item">
          <data-card legend="营业额"/>
        </li>
        <li class="c-card-list__item">
          <data-card legend="营业额"  color="#FE8087"/>
        </li>
        <li class="c-card-list__item">
          <data-card legend="营业额" color="#5CBBF2"/>
        </li>
      </ul>
      <section class="c-chart">
        <div ref="main" style="height: 400px"></div>
      </section>
    </body-container>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../components/header-bar";
  import BodyContainer from "../../components/body-container";
  import DataCard from "../../components/data-card";
  import Echarts from 'echarts'


  var colors = ['#5793f3', '#d14a61', '#675bba'];
  var option = {
    color: colors,

    tooltip: {
      trigger: 'none',
      axisPointer: {
        type: 'cross'
      }
    },
    // legend: {
    //   data:['2015 降水量', '2016 降水量']
    // },
    grid: {
      top: 70,
      bottom: 50
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: colors[1]
          }
        },
        axisPointer: {
          label: {
            formatter: function (params) {
              return '降水量  ' + params.value
                + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
            }
          }
        },
        data: ["2016-1", "2016-2", "2016-3", "2016-4", "2016-5", "2016-6", "2016-7", "2016-8", "2016-9", "2016-10", "2016-11", "2016-12"]
      },
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: colors[0]
          }
        },
        axisPointer: {
          label: {
            formatter: function (params) {
              return '降水量  ' + params.value
                + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
            }
          }
        },
        data: ["2015-1", "2015-2", "2015-3", "2015-4", "2015-5", "2015-6", "2015-7", "2015-8", "2015-9", "2015-10", "2015-11", "2015-12"]
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name:'2015 降水量',
        type:'line',
        xAxisIndex: 1,
        smooth: true,
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
      },
      {
        name:'2016 降水量',
        type:'line',
        smooth: true,
        data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
      }
    ]
  };
  export default {
    name: "home",
    components: {DataCard, BodyContainer, HeaderBar},
    data() {
      return {
        value: '',
        schoolName:null,
      }
    },
    methods: {
      ...mapActions('common',['getSchoolList']),
      selectSchool(value){
        localStorage.setItem('schoolId',value);
        this.$message({
          message: '设置成功',
          type: 'success'
        });
      }
    },
    computed: {
      ...mapState('common',{
        schoolData:state=>state.schoolList.list
      })
    },
   async created() {
      this.$nextTick(() => {
        var myChart = Echarts.init(this.$refs.main);
        myChart.setOption(option)
      });
   
        await this.getSchoolList();


    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #home {
    min-width: 1000px;
    .c-card-title {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .c-card-list {
      background-color: #fff;
      border-radius: 6px;
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 20px;
      &__item {
        @include flex-center;
        flex: 1;
      }

    }
    .c-chart {
      background-color: #fff;
      border-radius: 6px;
      margin-top: 20px;
    }
  }
</style>
