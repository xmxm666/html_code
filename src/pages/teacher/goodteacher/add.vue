<template>
  <div id="ADD" v-loading="loading">
    <header-bar legend="添加/编辑"/>
    <body-container>
      <el-form  v-loading="loading" :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row type="flex">
          <el-form-item label="学校名称">
            <el-select size="small" v-model="ruleForm.schoolId" :disabled="isChange" @change="selectSchool" placeholder="请选择学校">
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
            <el-input v-model="ruleForm.author"/>
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
                    <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-dialog :visible.sync="ruleForm.dialogVisible">
                    <img width="100%" :src="ruleForm.dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <!-- <el-form-item label="选择视频">
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
                </el-upload>
                <el-dialog :visible.sync="ruleForm.dialogVisible">
                    <img width="100%" :src="ruleForm.dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item> -->
            <el-form-item label="设置音乐">
                <el-upload
                    class="avatar-uploader"
                    :action="`${backendPath}/qiniuyun/videoImport`"
                    :show-file-list="false"
                    name='file'
                    :on-success="handleAvatarSuccess3"
                    :on-progress="audioloding"
                    :before-upload="beforeAvatarUpload3">
                    <audio  v-if="audioUrl" controls="controls" height="100" width="100">
                        <source :src="audioUrl" type="audio/mp3" />
                        <source :src="audioUrl" type="audio/ogg" />
                        <embed height="100" width="100" :src="audioUrl" />
                    </audio>
                    <el-button type="primary" plain v-else size="small" style="width: 120px">点击上传</el-button>
                    <p style="margin-top:80px;">提示：上传一次后，数据库存有数据，不必重复传</p>
                </el-upload>
                <el-dialog :visible.sync="ruleForm.dialogVisible">
                    <img width="100%" height="20%" :src="ruleForm.dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item v-if='mp3' :label="mp3">
                <i class="el-icon-check"></i>   
            </el-form-item>
        </el-row>
        <el-form-item label="文章正文">
<!--          <el-input type="textarea" v-model="ruleForm.content"></el-input>-->
          <rich-text v-model="ruleForm.content"></rich-text>
        </el-form-item>
      </el-form>
      
      <footer class="c-footer">
        <el-button size="small" type="primary" style="width: 120px;margin-left: 100px" @click="submitForm">提交</el-button>
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
        schoolName:null,
        dialogImageUrl: '',
        dialogVisible: false,
        disabled:false,
        imageUrl: '',
        videoUrl: '',
        audioUrl: '',
        topTime:[],
        type:[],
        mp3:null,
        ruleForm: {
          type: '8',
          schoolId:null,
          title: null,
          content: null,
          image: null,
          audio: null,
          author: null
        },
      }
    },
    components: { HeaderBar,bodyContainer,richText},

    methods: {
      ...mapActions('teacher',['addArticle','getArticlDetails2']),
      ...mapActions('common',['getSchoolList']),
      async submitForm() {
        this.loading = true;
        let res;
          if(this.id){
              res = await this.addArticle({
                ...this.ruleForm,id:this.id
            })
          }else{
              res = await this.addArticle({
                ...this.ruleForm
              })
          }
          if(res.code==200){
            this.$message.success(res.msg);
            this.$pushRoute("list")
          } else {
          this.$message.error(res.msg)
        }
				this.loading = false;
      },
      handleAvatarSuccess(res, file) {
        this.ruleForm.image=res.data
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'||'image/png';
        if (!isJPG) {
          this.$message.error('上传图片格式不符!');
        }
        return isJPG;
      },
      handleAvatarSuccess2(res, file) {
        this.ruleForm.vedio=res.data
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
      handleAvatarSuccess3(res, file) {
        this.ruleForm.audio=res.data;
        this.mp3 = file.name
        this.audioUrl = URL.createObjectURL(file.raw);
        this.$message.success("上传成功");
      },
      beforeAvatarUpload3(file) {
        const isJPG = file.type === 'audio/mp3'||'audio/ogg';
        if (!isJPG) {
          this.$message.error('上传音频格式不符!');
        }
        return isJPG;
      },
      selectSchool(value){
        this.ruleForm.schoolId=value;
      },
      videoloding(file){
         this.$message.info("正在上传,请耐心等待");
      },
      audioloding(file){
         this.$message.info("正在上传,请耐心等待");
      }
    },
    computed: {
      ...mapState("common", {
        schoolData: state => state.schoolList||[],
      }),
    },
    async created() {
        await this.getSchoolList();
      const id = this.$route.query.id;
      console.log(id)
      if (id) {
        this.isChange=true;
        const {data} = await this.getArticlDetails2({id});
        this.id=data.id;
        this.ruleForm.schoolId = data.schoolId;
        this.ruleForm.author = data.author;
        this.ruleForm.title=data.title;
        this.ruleForm.content=data.content;
        this.ruleForm.image=data.image;
        this.ruleForm.vedio=data.vedio;
        this.ruleForm.audio=data.audio; 
        this.mp3 = data.audio;
        this.imageUrl= (data.image != null)? `http://prxopj1oi.bkt.clouddn.com/${data.image}` : '';
      }
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
    border: 1px dashed #f0f0f0;
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
  }
</style>
