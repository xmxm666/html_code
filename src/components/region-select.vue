<template>
  <el-cascader
    placeholder="请选择城市"
    size="small"
    :options="province"
    :props="{value:'id',label:'name'}"
    v-model="fakeAddress">
  </el-cascader>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {province} from '../lib/province.js';
  import {city} from '../lib/city.js';
  import {area} from '../lib/area.js';
  import _ from 'lodash'

  export default {
    name: "RegionSelect",
    props: ["value", "needArea"],
    data() {
      return {
        province: [],
        city: [],
      }
    },
    methods: {
      // handleItemChange(arr) {
      //   // if (arr.length === 1) {
      //   //   const provinceItem = _.find(this.province, {
      //   //     id: arr[0]
      //   //   });
      //   //   provinceItem.children = this.city[arr[0]];
      //   // } else if (arr.length === 2) {
      //   //   const cityItem = _.find(this.city[arr[0]], {
      //   //     id: arr[1]
      //   //   });
      //   //   cityItem.children = area[arr[1]];
      //   // }
      // }
      initOptions() {
        const curCity = _.cloneDeep(city);
        if (this.needArea) {
          this.province = province.map((item) => {
            let citys = curCity[item.id] || [];
            citys = citys.map((item) => ({...item, children: area[item.id]}));
            return {...item, children: citys}
          });
        } else {
          this.province = province.map((item) => ({...item, children: curCity[item.id]}));
        }
      }
    },
    computed: {
      fakeAddress: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit("input", val);
        }
      },
    },
    created() {
      setTimeout(() => {
        this.initOptions();
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/common";

  #RegionSelect {
    width: 200px;
    .c-select {
      @include alignCenter;
      &__legend {
        font-size: 14px;
        color: rgba(77, 77, 77, 1);
      }
      &__input {
        flex: 1;
        margin-left: 20px;
      }
    }
    .tips {
      font-size: 12px;
      color: rgba(128, 128, 128, 1);
      margin-top: 10px;
    }
  }
</style>
