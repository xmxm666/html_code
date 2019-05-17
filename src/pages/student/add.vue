<template>
  <div id="CarouselMap">
    <header-bar legend="添加/编辑学员"/>
    <body-container v-loading="loading">
      <el-row type="flex">
        <el-form  class="c-form" inline size="small">
           <el-form-item label="学校名称" v-if="!disabled">
        <!--<location-select style="margin-left: 30px"/>-->
        <el-select   v-model="schoolname"  placeholder="请选择添加到哪个学校" @change="selectSchool">
          <el-option
            v-for="item in schoolData"
            :key="item.schoolId"
            :label="item.schoolName"
            :value="item.schoolId">
          </el-option>
        </el-select>
        </el-form-item>
        </el-form>
      </el-row>
      <el-row type="flex" >
        <el-form  class="c-form" inline size="small">
          <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="学员姓名" class="c-form__item" required>
                <el-input placeholder="请输入" v-model="form.userName"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="学员性别" class="c-form__item" required>
                <template>
                  <el-radio v-model="form.sex" :label="1">男</el-radio>
                  <el-radio v-model="form.sex" :label="2">女</el-radio>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="手机号" class="c-form__item" required>
                <el-input placeholder="请输入" v-model="form.phone"/>
              </el-form-item>
            </el-col>
          </el-row>
              <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="座机号" class="c-form__item">
                <el-input placeholder="请输入（选填）" v-model="form.telephone"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="身份证号" class="c-form__item" required>
                <el-input placeholder="请输入" v-model="form.identityCard"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="l-row">
            <el-col :span="24">
              <el-form-item label="人员分类" required>
                 <el-select v-model="form.employer" placeholder="请选择">
                  <el-option
                    v-for="item in studentClassificationColumns"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row type="flex" class="l-row">
            <el-col :span="24">
              <el-form-item label="政治面貌" >
                 <el-select v-model="form.political" placeholder="请选择">
                  <el-option
                    v-for="item in politicalStatusColumns"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row type="flex" class="l-row">
            <el-col :span="24">
              <el-form-item label="文化程度" >
                 <el-select v-model="form.educational" placeholder="请选择">
                  <el-option
                    v-for="item in educationalLevelColumns"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row type="flex" class="l-row">
            <el-col :span="24">
              <el-form-item label="退休状态" >
                 <el-select v-model="form.retired" placeholder="请选择">
                  <el-option
                    v-for="item in retirementStatusColumns"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="工作单位" class="c-form__item">
                <el-input placeholder="请输入" v-model="form.position"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="职务" class="c-form__item">
                <el-input placeholder="请输入" v-model="form.job"/>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="选择省市" class="c-form__item">
               <el-cascader

                    size="large"
              
                    :options="options"
              
                    v-model="selectedOptions"
              
                    @change="handleChange">
              
                  </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="详细地址" class="c-form__item">
                <el-input placeholder="请输入" v-model="form.address"/>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="加入志愿者" class="c-form__item">
                <template>
                  <el-radio v-model="form.volunteer" :label="1">是</el-radio>
                  <el-radio v-model="form.volunteer" :label="2">否</el-radio>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
             <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="在校任职" class="c-form__item">
                <template>
                   <el-input placeholder="请输入" v-model="form.schoolJob"/>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
             <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="备注" class="c-form__item">
                <template>
                    <el-input placeholder="请输入" v-model="form.remark"/>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="紧急联系人" class="c-form__item">
              </el-form-item>
            </el-col>
          </el-row>
            <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="姓名" class="c-form__item" >
                <el-input placeholder="请输入" v-model="form.emergencyContact1"/>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="关系" class="c-form__item" >
                <el-input placeholder="请输入" v-model="form.emergencyRelation1"/>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="电话" class="c-form__item" >
                <el-input placeholder="请输入" v-model="form.emergencyPhone1"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <footer class="c-footer">
        <el-button size="small" type="primary" style="width: 120px" @click="submitForm">提交</el-button>
      </footer>
    </body-container>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../components/header-bar";
  import LocationSelect from "../../components/location-select";
  import BodyContainer from "../../components/body-container";
  import RegionSelect from "../../components/region-select";
  import ImgUpload from "../../components/img-upload";
  import {WEEK,politicalStatusColumns,educationalLevelColumns,retirementStatusColumns,studentClassificationColumns} from "../../enum";
  import {convertUTCTimeToLocalTime,excludeEmpty,getWeek, getTowWeek,getBool} from '../../utils'
  import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
  import _ from 'lodash'


  export default {
    name: "CarouselMap",
    components: {ImgUpload, RegionSelect, BodyContainer, LocationSelect, HeaderBar},
    data() {
      return {
        WEEK,
        politicalStatusColumns,
        educationalLevelColumns,
        retirementStatusColumns,
        studentClassificationColumns,  //以上枚举
        options: regionData,
        selectWeek:null,
        loading: false,
        timeRange:[],
        selectedOptions:[],
        schoolname:null,
        teacherName:null,
        disabled:false,
        area:'',
        form: {
          userName:null,
          sex:1,
          phone:null,
          identityCard:null,
          peopleNumber:null,
          schoolId:null,
          political:null,
          employer:null,
          educational:null,
          retired:null,
          position:null,
          job:null,
          volunteer:null,
          address:null,
          telephone:null,
         emergencyContact1:null,
         emergencyRelation1:null,
         emergencyPhone1:null,
         remark:null,
         schoolJob:null,
         areaId:null,
        },
      }
    },
    methods: {
      ...mapActions("student", ['addStudent', 'getStudentDetails']),
      ...mapActions('common',["getTeacherList","getSchoolList"]),
      async submitForm() {       
        this.loading = true;
        const form = {
          ...this.form,
          area:this.area
        };
        const {code,msg} = await this.addStudent(form);
        if (code === '200') {
          this.$message.success("操作成功");

          this.$pushRoute("/student/list");

        } else {

          this.$message.error(msg);

        }
        this.loading = false;
      },
      handleChange (value) {
        this.form.areaId=value.join('-');
        this.area=CodeToText[value[0]]+'-'+CodeToText[value[1]]+'-'+CodeToText[value[2]]
      },

      selectSchool(value){
        this.form.schoolId=value;
        this.getTeacherList({schoolId:value});
      },
      selectTeacher(value){
         this.form.courseTeacher=value;
      }
			
    },
    computed: {
  
      ...mapState('common',{
        schoolData:state=>state.schoolList||[],
        teacherData:state=>state.teacherList||[]
      }),
    },
    async created() {
         this.disabled=getBool()
        this.getTeacherList({schoolId:localStorage.getItem('schoolId')});

      const userId = this.$route.query.userId;
      const schoolId = this.$route.query.schoolId;
      if (userId) {
      const {data} = await this.getStudentDetails({userId,schoolId})

       this.form = data;
       this.schoolname=data.schoolName
       if(data.area){
        this.selectedOptions=data.areaId.split('-');
        this.area=data.area
       }      
      }
      if(!this.schoolData){
        await this.getSchoolList();
      }
    }
  }
</script>
<style lang="scss">
  #CarouselMap .el-form-item__content {
    flex: 1;

  }
  .el-form-item__label{
    width: 90px !important;
    text-align: left;
  }
</style>
<style scoped lang="scss">
  @import "../../assets/common";

  #CarouselMap {
.sing-time{
  padding: 0 20px;
	
}
    .c-form {
      margin-left: 30px;
      .l-row {
        margin-bottom: 20px;
      }
      &__item {
        margin-bottom: 8px;
        width: 100%;
        display: flex;
      }

      &__hint {
        color: #808080;
        margin-top: 12px;
        font-size: 14px;
      }
    }
    .c-footer {
      margin-top: 30px;
      padding-top: 20px;

    }
    .tip{
       color: #c5c4c4;
    }
  }
</style>
