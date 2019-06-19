<template>
  <div id="ADD" v-loading="loading">
    <header-bar legend="添加/编辑"/>
    <body-container>
      <el-form  v-loading="loading" :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row type="flex">
          <el-form-item label="学校" class="recruitmentTitle">
            <el-select size="small" v-model="ruleForm.schoolId" :disabled="isChange" @change="selectSchool" placeholder="请选择学校">
                <el-option label="全部" :value="0"></el-option>
                <el-option
                v-for="item in schoolData"
                :key="item.schoolId"
                :label="item.schoolName"
                :value="item.schoolId">
                </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="教师"  class="recruitmentTitle">
            <el-input v-model="ruleForm.teacher"/>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="标题" class="Title">
            <el-input v-model="ruleForm.title"/>
          </el-form-item>
        </el-row>
        <el-row type="flex">
            <el-form-item label="封面图片">
                <el-upload
                    class="avatar-uploader"
                    :action="`${backendPath}/qiniuyun/videoImport`"
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
            <el-form-item label="课程视频">
                <el-upload
                    class="avatar-uploader"
                    :action="`${backendPath}/qiniuyun/videoImport`"
                    :show-file-list="false"
                    name='file'
                    :on-success="handleAvatarSuccess2"
                    :on-progress="videoloding"
                    :before-upload="beforeAvatarUpload2">
                    <video v-if="videoUrl" :src="videoUrl" class="avatar" controls>
                        <source :src="videoUrl" type="video/mp4">
                    </video>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <p>提示：上传一次后，数据库存有数据，不必重复传</p>
                </el-upload>
                <el-dialog :visible.sync="ruleForm.dialogVisible">
                    <img width="100%" :src="ruleForm.dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
        </el-row>
        <el-form-item label="课程介绍" class="Title">
         <el-input type="textarea" v-model="ruleForm.introduce" rows="5"  cols="20"></el-input>
          <!-- <rich-text v-model="ruleForm.introduce"></rich-text> -->
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
  import {backendPath,ImgPath} from "../../../project-config/base";
  import { convertUTCTimeToLocalTime } from '../../../utils';

  export default {
    name: "ADD",
    data() {
      return {
        backendPath,
        ImgPath,
        loading: false,
        isChange:false,
        dialogImageUrl: '',
        dialogVisible: false,
        disabled:false,
        imageUrl: '',
        videoUrl: '',
        topTime:[],
        type:[],
        id: null,
        ruleForm: {
          schoolId:null,
          title: null,
          video: null,
          introduce: null,
          cover: null
        },
      }
    },
    components: { HeaderBar,bodyContainer,richText},

    methods: {
      ...mapActions('student',['addgoodArticle','getArticlDetails']),
      ...mapActions('common',['getSchoolList']),
      async submitForm() {
        this.loading = true;
        const {code,msg} =  await this.addgoodArticle({
          ...this.ruleForm,
          fineId:this.id
        })
        if(code==200){
          this.$message.success(msg);
          this.$pushRoute("/page/lesson/goodlesson/list");
        }else{
          this.$message.error(msg)
        }
        console.log(code,msg)
        this.loading = false;
      },
      handleAvatarSuccess(res, file) {
        this.ruleForm.cover=res.data
        this.imageUrl = URL.createObjectURL(file.raw);
        console.log(this.imageUrl)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
          this.$message.error('上传图片格式不符!');
        }
        return isJPG;
      },
      handleAvatarSuccess2(res, file) {
        this.ruleForm.video=res.data
        this.videoUrl = URL.createObjectURL(file.raw);
        this.$message.success("上传成功");
      },
      beforeAvatarUpload2(file) {
        const isJPG = file.type === 'video/mp4';
        if (!isJPG) {
          this.$message.error('上传视频格式不符!');
        }
        return isJPG;
      },
      selectSchool(value){
        this.ruleForm.schoolId=value;
      },
      videoloding(file){
         this.$message.info("正在上传,请耐心等待");
      }
    },
    computed: {
      ...mapState("common", {
        schoolData: state => state.schoolList||[],
      }),
    },
    async created() {
      const id = this.$route.query.id;
      if (id) {
        this.isChange=true;
        const {data} = await this.getArticlDetails({fineId:id});
        this.id=data.fineId;
        this.ruleForm.schoolId=data.schoolId;
        this.ruleForm.title=data.title;
        this.ruleForm.teacher=data.teacher;
        this.ruleForm.introduce=data.introduce;
        this.ruleForm.video=data.video;
        this.ruleForm.cover= (data.cover != null)? `${data.cover}` : '';
        this.imageUrl= (data.cover != null)? `http://prxopj1oi.bkt.clouddn.com/${data.cover}` : '';
      }
      await this.getSchoolList();
    }

  }
</script>


<style scoped lang="scss">
  @import "../../../assets/common";
  .el-input__inner{
    width: 432px;
  }
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
  .recruitmentTitle /deep/ .el-input__inner{
      width: 200px;
    }
    .Title /deep/ .el-input__inner{
      width: 600px !important;
    }
    .Title /deep/ .el-textarea__inner{
      width: 600px !important;
    }
  }
</style>
