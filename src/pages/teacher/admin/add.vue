<template>
  <div id="ADD">
    <header-bar legend="添加/编辑管理员"/>
    <body-container>
      <el-form size="small" style="width: 600px" label-width="120px" label-position="left">
        <el-form-item label="学校名称" v-if="!disabled" >
        <!--<location-select style="margin-left: 30px"/>-->
        <el-select   v-model="schoolName" placeholder="请选择添加到哪个学校" @change="selectSchool">
          <el-option
            v-for="item in schoolData"
            :key="item.schoolId"
            :label="item.schoolName"
            :value="item.schoolId">
          </el-option>
        </el-select>
        </el-form-item>
         <el-form-item label="管理员ID"  class="recruitmentTitle" v-if="isChange">
          <el-input placeholder="请输入" :disabled='true' v-model="form.adminId"/>
        </el-form-item>
         <el-form-item label="管理员名称" class="recruitmentTitle">
          <el-input placeholder="请输入" v-model="form.name"/>
        </el-form-item>
        <el-form-item label="账号" class="recruitmentTitle">
          <el-input placeholder="请输入" v-model="form.phone"/>
        </el-form-item>
         <el-form-item label="密码" class="recruitmentTitle">
          <el-input placeholder="请输入" v-model="form.password"/>
        </el-form-item>
      </el-form>
      <footer class="c-footer">
        <el-button size="small" @click="submitForm" type="primary" style="width: 220px">提交</el-button>
      </footer>
    </body-container>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../../components/header-bar";
  import LocationSelect from "../../../components/location-select";
  import BodyContainer from "../../../components/body-container";
  import RegionSelect from "../../../components/region-select";
  import ImgUpload from "../../../components/img-upload";
  import {excludeEmpty,getBool} from "../../../utils";
  import _ from 'lodash'
  import {EDUCATIONS, WELFARE_TAG} from "../../../enum";

  export default {
    name: "ADD",
    components: {ImgUpload, RegionSelect, BodyContainer, LocationSelect, HeaderBar},
    data() {

      return {
        isChange:false,
        isEdit: false,
        schoolName:null,
        form: {
        adminId:null,
        name:null,
        phone:null,
        schoolId:null,
        },

      }
    },
    methods: {
      ...mapActions("teacher", [ 'addTeacher', "getTeacherDetails",'upDataTeacher']),
      ...mapActions('common',["getTeacherList","getSchoolList"]),
      async submitForm() {
				this.loading = true;

        if(this.isChange){
           const {data,code,msg} = await this.upDataTeacher({
           ...this.form,
           role:1
         })
          if (code === '200') {
          this.$message.success(msg);
          this.$pushRoute("/admin/list")
        } else {
          this.$message.error(msg)
        }
        }else{
          const {data,code,msg} = await this.addTeacher({
           ...this.form,
           role:1
         })
          if (code === '200') {
          this.$message.success(msg);
          this.$pushRoute("/admin/list")
        } else {
          this.$message.error(msg)
        }
        }
				this.loading = false;

      },
      toString(val){
        return val.toString()
      },
        selectSchool(value){
        this.form.schoolId=value;
      },
    },
    computed: {
        ...mapState('common',{
        schoolData:state=>state.schoolList||[],
        teacherData:state=>state.teacherList||[]
      }),
    },
    async created() {
            this.disabled=getBool()
      const id = this.$route.query.id;
       await this.getSchoolList()
      if (id) {
        this.isChange=true;
        const {data} = await this.getTeacherDetails({adminId:id});
        this.form.name=data.name;
        this.form.phone=data.phone;
        this.form.schoolId=data.schoolId;
        this.form.adminId=data.adminId;
        this.schoolName=data.schoolName;

      }
    }
  }
</script>
<style>
  #ADD .el-form-item__content {
    flex: 1;
  }
</style>
<style scoped lang="scss">
  @import "../../../assets/common";

  #ADD {
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
    .recruitmentTitle /deep/ .el-input__inner{
      width: 432px;
    }
  }
</style>
