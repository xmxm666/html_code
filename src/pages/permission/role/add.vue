<template>
  <div id="ADD">
    <header-bar legend="添加/编辑角色"/>
    <body-container>
      <el-form size="small" style="width: 600px" label-width="120px" label-position="left">
        <el-form-item label="学校名称" v-if="!disabled" >
        <el-select   v-model="schoolName" placeholder="请选择添加到哪个学校" @change="selectSchool">
          <el-option
            v-for="item in schoolData"
            :key="item.schoolId"
            :label="item.schoolName"
            :value="item.schoolId">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="角色ID"  class="recruitmentTitle" v-if="isChange">
          <el-input placeholder="请输入" :disabled='true' v-model="form.roleId"/>
        </el-form-item>
        <el-form-item label="角色名称" class="recruitmentTitle">
          <el-input placeholder="请输入" v-model="form.roleName"/>
        </el-form-item>
        <el-form-item label="权限名称" class="recruitmentTitle">
          <el-tree
            ref="tree"
            :data="perData"
            show-checkbox
            node-key="id"
            :default-checked-keys="checkedKey"
            :default-expanded-keys="checkedKey"
            :props="defaultProps">
          </el-tree>
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
  import {excludeEmpty,getBool} from "../../../utils";
  import _ from 'lodash'
  import {EDUCATIONS, WELFARE_TAG} from "../../../enum";

  export default {
    name: "ADD",
    components: {RegionSelect, BodyContainer, LocationSelect, HeaderBar},
    data() {

      return {
        checkedKey:[],
        isChange:false,
        isEdit: false,
        schoolName:null,
        form: {
          roleId:null,
          roleName:null,
          schoolId:null,
          permisIds:[]
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      ...mapActions("role", [ 'addRole', "getRoleDetails",'allPermission']),
      ...mapActions('common',["getSchoolList"]),
      async submitForm() {
				this.loading = true;
        const  cheNo = this.$refs.tree.getCheckedNodes(true);
        if(cheNo.length === 0) {
          this.$message.error("请选择权限");
          return
        }
        this.form.permisIds = cheNo.map(node => {
          return node.id;
        });
        const {data,code,msg} = await this.addRole({
           ...this.form
         })
        if (code === '200') {
          this.$message.success(msg);
          this.$pushRoute("/permission/role/list")
        } else {
          this.$message.error(msg)
        }
				this.loading = false;
      },
      toString(val){
        return val.toString()
      },
        selectSchool(value){
        this.form.schoolId=value;
      }

    },
    computed: {
      ...mapState('common',{
        schoolData:state=>state.schoolList||[],
      }),
      ...mapState('role',{
        perData:state=>state.permissionList||[],
      })
    },
    async created() {
      this.disabled=getBool()
      const id = this.$route.query.id;
      await this.getSchoolList();
      if(this.perData.length === 0) {
        await this.allPermission();
      }
      if (id) {
        this.isChange=true;
        const {data} = await this.getRoleDetails({roleId:id});
        this.form.roleId=data.roleId;
        this.form.roleName=data.roleName;
        this.schoolName=data.schoolName;
        this.checkedKey=data.permisIds;
        this.form.schoolId = data.schoolId;
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
