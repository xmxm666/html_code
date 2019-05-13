<template>
  <div id="ADD" v-loading="loading">
    <header-bar legend="添加/编辑"/>
    <body-container>
      <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" >
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="选择学校"  v-if="!disabled">
          <el-select v-model="schoolName" placeholder="请选择学校" @change="selectSchool" >
            <el-option :label="item.schoolName" :value="item.schoolId" v-for="(item,i) in schoolData" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面图片">
         <el-upload
            class="avatar-uploader"
            :action="`${backendBasePath}/pic/uploadSchoolImages`"
            :show-file-list="false"
            name='file'
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-dialog :visible.sync="ruleForm.dialogVisible">
            <img width="100%" :src="ruleForm.dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="是否置顶">
          <el-switch v-model="ruleForm.istop" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="是否公开">
          <el-switch v-model="ruleForm.ispublic" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
<!--        1-通知公告, 3-校园介绍, 4-联盟资讯, 5-政策法规-->
        <el-form-item label="文章类型" >
          <el-checkbox-group  v-model="type">
            <el-checkbox :label="1">通知公告</el-checkbox>
            <el-checkbox :label="3">校园介绍</el-checkbox>
            <el-checkbox :label="4">联盟资讯</el-checkbox>
            <el-checkbox :label="5">政策法规</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="文章正文">
<!--          <el-input type="textarea" v-model="ruleForm.content"></el-input>-->
          <rich-text v-model="ruleForm.content">
          </rich-text>
        </el-form-item>
        <el-form-item label="连接地址">
          <el-input v-model="ruleForm.url"></el-input>
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
  import HeaderBar from "../../../components/header-bar"
  import bodyContainer from '../../../components/body-container'
  import richText from  '../../../components/rich-text'
  import {getBool} from '../../../utils'
  import {backendBasePath} from "../../../project-config/base";


  export default {
    name: "ADD",
    data() {
      return {
        backendBasePath,
        loading: false,
        isChange:false,
        schoolName:null,
        dialogImageUrl: '',
        dialogVisible: false,
        disabled:false,
        imageUrl: '',
        type:[],
        ruleForm: {
          schoolId:null,
          title: '',
          istop: false,
          ispublic:false,
          content: '',
          url:null,
        },
      }
    },
    components: { HeaderBar,bodyContainer,richText},

    methods: {
      ...mapActions('school',['addArticle','getArticlDetails']),
      ...mapActions('common',['getSchoolList']),
      async submitForm() {
        this.loading = true;
          if(this.isChange){
           this.ruleForm.id= this.id;
          }
          const {data,code,msg} = await this.addArticle({
            ...this.ruleForm,
            type:this.type.join(',')
          });
          if(code==='200'){
            this.$message.success(msg);
            this.$router.back()
          }else{
            this.$message.error(msg);
        }
				this.loading = false;

      },
   handleAvatarSuccess(res, file) {
        this.ruleForm.url=res.url
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // return isJPG;
      },
      selectSchool(value){
        this.ruleForm.schoolId=value;
      }
    },
    computed: {
      ...mapState("common", {
        schoolData: state => state.schoolList||[],
      }),
    },
    async created() {
            this.disabled=getBool()
      const id = this.$route.query.id;
      if (id) {
        this.isChange=true;
        const {data} = await this.getArticlDetails({id});
        this.id=data.id;
        this.schoolName=data.schoolName;
        this.ruleForm.schoolId=data.schoolId;
        this.type.push(data.type*1);
        console.log(this.type)
        this.ruleForm.title=data.title;
        this.ruleForm.istop=data.istop*1;
        this.ruleForm.ispublic=data.ispublic*1;
        this.ruleForm.content=data.content;
        this.ruleForm.url=data.url;
        this.imageUrl=`http://120.27.16.130/${data.url}`
      }
        await this.getSchoolList();
    }

  }
</script>


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
    .waringTip{
      color: red;
    }
     .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  }
</style>
