<template>
  <div id="ADD">
    <header-bar legend="添加/编辑人员"/>
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
        <el-form-item label="人员ID"  class="recruitmentTitle" v-if="isChange">
          <el-input placeholder="请输入" :disabled='true' v-model="form.adminId"/>
        </el-form-item>
        <el-form-item label="人员名称" class="recruitmentTitle">
          <el-input placeholder="请输入" v-model="form.name"/>
        </el-form-item>
        <el-form-item label="手机号" class="recruitmentTitle">
          <el-input placeholder="请输入" v-model="form.phone"/>
        </el-form-item>
        <el-form-item label="密码" class="recruitmentTitle">
          <el-input placeholder="请输入" v-model="form.password"/>
        </el-form-item>
        <el-form-item label="角色" class="recruitmentTitle" v-if="!disabled" >
          <el-radio-group v-model="roleRedio" @change="roleChange">
            <el-radio :label="0">超级管理员</el-radio>
            <el-radio :label="1">学校管理员</el-radio>
            <el-radio :label="3">普通管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" class="recruitmentTitle" v-if="isAdmin">
          <el-select v-model="form.roleIds" multiple placeholder="请选择" filterable allow-create default-first-option>
            <el-option
              v-for="item in options"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
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
        isAdmin: false,
        roleRedio:null,
        options: [],
        isChange:false,
        isEdit: false,
        schoolName:null,
        form: {
          adminId:null,
          name:null,
          phone:null,
          schoolId:null,
          roleIds: [],
          role: 3
        },
      }
    },
    methods: {
      ...mapActions("teacher", [ 'addTeacher', "getTeacherDetails",'upDataTeacher']),
      ...mapActions('common',["getTeacherList","getSchoolList"]),
      ...mapActions('role',["getRoleListBySchool"]),
      async submitForm() {
				this.loading = true;
        if(this.isChange){
           const {data,code,msg} = await this.upDataTeacher({
           ...this.form,
         })
          if (code === '200') {
          this.$message.success(msg);
          this.$pushRoute("/permission/admin/list")
        } else {
          this.$message.error(msg)
        }
        }else{
          const {data,code,msg} = await this.addTeacher({
           ...this.form,
         })
          if (code === '200') {
          this.$message.success(msg);
          this.$pushRoute("/permission/admin/list")
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
        this.isAdmin = false;
        this.roleRedio = null;
        this.form.role = null;
        this.form.roleIds = [];
      },
      roleChange(value){
        if(value === 3){
          const schoolId = this.form.schoolId || this.$route.query.schoolId;
          if(!schoolId) {
            this.$message.error("请先选择学校");
            this.roleRedio = null;
            return false;
          }
          this.roleList(schoolId);
          this.form.role = 3;
          this.isAdmin = true;
        } else {
          this.form.role = value;
          this.isAdmin = false;
        }
      },

      async roleList(schoolId) {
        const {data} = await this.getRoleListBySchool({schoolId:schoolId});
        this.options = data;
      }
    },
    computed: {
      ...mapState('common',{
        schoolData:state=>state.schoolList||[],
        teacherData:state=>state.teacherList||[]
      }),
    },
    async created() {
      this.disabled=getBool();
      this.isAdmin = this.disabled;
      const id = this.$route.query.id;
      await this.getSchoolList()
      if (id) {
        this.isChange=true;
        const {data} = await this.getTeacherDetails({adminId:id,schoolId: this.$route.query.schoolId});
        this.form.name=data.name;
        this.form.phone=data.phone;
        this.form.schoolId=data.schoolId;
        this.form.adminId=data.adminId;
        this.schoolName=data.schoolName;
        this.form.roleIds = data.roleIds;
        this.form.role = data.role;
        this.roleRedio = data.role;
        if(this.roleRedio === 3) {
          this.isAdmin = true;
        }
      }
      if(this.roleRedio) {
        const {data} = await this.getRoleListBySchool({schoolId:this.$route.query.schoolId});
        this.options = data;
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
