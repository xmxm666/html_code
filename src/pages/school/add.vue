<template>
  <div id="ADD" v-loading="loading">
    <header-bar legend="添加"/>
    <body-container>
      <el-form size="small" style="width: 600px" label-width="120px" label-position="left">
        <el-form-item label="学校名称" >
          <el-input placeholder="请输入" v-model="form.schoolName" class="userName"/>
        </el-form-item>
        <el-form-item label="经度">
          <el-input placeholder="请输入" v-model="form.latitude"/>
        </el-form-item>
        <el-form-item label="维度">
          <el-input placeholder="请输入" v-model="form.longitude"/>
        </el-form-item>
      </el-form>
      <footer class="c-footer">
        <el-button size="small" type="primary" style="width: 120px" @click="submitForm">提交</el-button>
      </footer>
    </body-container>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../components/header-bar"
  import bodyContainer from '../../components/body-container'


  export default {
    name: "ADD",
    components: {},
    data() {
      return {
        loading: false,
        isChange:false,
        form: {
          schoolId:null,
          schoolName:null,
          longitude:null,
          latitude:null,
        },

      }
    },
    components: { HeaderBar,bodyContainer},

    methods: {
      ...mapActions("teacher", ["getAllJob"]),
      ...mapActions('school',['addSchool','getSchoolDetails','upDataSchool']),
      async submitForm() {
        this.loading = true;
        if(this.isChange){
          const {data,code,msg} = await this.upDataSchool({
            ...this.form
          });
          if(code==='200'){
            this.$message.success(msg);
            this.$pushRoute("/school/list")
          }else{
            this.$message.error(msg)
          }
        }else{
          const {data,code,msg} = await this.addSchool({
            ...this.form
          });
          if(code==='200'){
            this.$message.success(msg);
            this.$pushRoute("/school/list")
          }else{
            this.$message.error(msg)
          }
        }
				this.loading = false;

      }
    },
    computed: {},
    async created() {
      const id = this.$route.query.id;
      if (id) {
        this.isChange=true;
        const {data} = await this.getSchoolDetails({schoolId:id});
        this.form.schoolName=data.schoolName;
        this.form.longitude=data.longitude;
        this.form.latitude=data.latitude;
        this.form.schoolId=data.schoolId;

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
  @import "../../assets/common";

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
    .waringTip{
      color: red;
    }
  }
</style>
