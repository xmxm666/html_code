<template>
  <div id="LocationSelect">
    <div class="c-select"><em class="c-select__legend">显示位置</em>
      <el-select class="c-select__input" size="small" v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <p class="tips">首页、简历列表项、招聘列表项、求职列表项、转让列表项、求租列表项</p>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "LocationSelect",
    data() {
      return {
        options: [{
          value: '选项1',
          label: '黄石市'
        }, {
          value: '选项2',
          label: '孝感市'
        }, {
          value: '选项3',
          label: '武汉市'
        }],
        value: '选项1'
      }
    },
    methods: {},
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/common";

  #LocationSelect {
    .c-select {
      @include alignCenter;
      &__legend {
        font-size: 14px;
        color: rgba(77, 77, 77, 1);
      }
      &__input {
        width: 160px;
        margin-left: 20px;
      }
    }
    .tips{
      font-size:12px;
      color:rgba(128,128,128,1);
      margin-top: 10px;
    }
  }
</style>
