<template>
  <div id="selectSchool" >
   <el-select size="small" v-model="schoolId" :disabled="disabled" @change="selectSchool" placeholder="请选择学校">
      <el-option label="全部" :value="0"></el-option>
        <el-option
          v-for="item in schoolData"
          :key="item.schoolId"
          :label="item.schoolName"
          :value="item.schoolId">
        </el-option>
      </el-select>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
import { getBool } from '../utils';

  export default {
    name: "selectSchool",

    data() {
      return {
          schoolId:null,
      }
    },
    props:{
        disabled:{
            type:Boolean,
            default:false
        }
    },
    methods: {
         ...mapActions("common", ['getTeacherList','getSchoolList']),
         selectSchool(value){
            localStorage.setItem('schoolId',value)
         }
    },
    computed: {
         ...mapState("common", {
        schoolData: state => state.schoolList||[],
      }),
    },
    mounted(){

       if(!getBool()){

         localStorage.setItem('schoolId',null)
       } else{
         this.schoolId=localStorage.getItem('schoolName');
       }
    },
   async created() {
     if(this.schoolData.length===0||this.schoolData.length===undefined){
        await this.getSchoolList();
     }
    }
  }
</script>

<style scoped lang="scss">


  #selectSchool {
    display: inline-block;
  }
</style>
