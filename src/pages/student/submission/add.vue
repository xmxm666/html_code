<template>
  <div id="ADD">
    <header-bar legend="添加/编辑投稿"/>
    <body-container>
      <el-form size="small" style="width: 600px" label-width="120px" label-position="left">
        <el-row type="flex">
          <el-form-item label="学员ID" class="recruitmentTitle">
            <el-input :disabled='true' v-model="form.cid"/>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="请求人"  class="recruitmentTitle">
            <el-input :disabled='true' v-model="form.userName"/>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="标题" class="Title">
            <el-input v-model="form.title"/>
          </el-form-item>
        </el-row>
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
            <el-dialog :visible.sync="form.dialogVisible">
                <img width="100%" :src="form.dialogImageUrl" alt="">
            </el-dialog>
        </el-form-item>
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
              <p style="margin-top:20px;">提示：上传一次后，数据库存有数据，不必重复传</p>
          </el-upload>
          <el-dialog :visible.sync="form.dialogVisible">
              <img width="100%" height="20%" :src="form.dialogImageUrl" alt="">
          </el-dialog>
      </el-form-item>
        <!-- <el-row type="flex">
          <el-form-item label="日期选择" >
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="timeRange"
              type="date"
              placeholder="选择日期">
            </el-date-picker> 
          </el-form-item>
        </el-row> -->
        <el-form-item label="文章正文">
<!--          <el-input type="textarea" v-model="ruleForm.content"></el-input>-->
          <rich-text v-model="form.content"></rich-text>
        </el-form-item>
      </el-form>
      <el-form  class="c-form" inline size="small">
        <el-form-item label="投稿状态" >
          <el-radio v-model="form.checkin" :label="0">通过</el-radio>
          <el-radio v-model="form.checkin" :label="2">拒绝</el-radio>
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
  import {backendPath,ImgPath} from "../../../project-config/base";
  import richText from  '../../../components/rich-text'

  export default {
    name: "ADD",
    components: {ImgUpload, RegionSelect, BodyContainer, LocationSelect, HeaderBar,richText},
    data() {
      return {
        backendPath,
        ImgPath,
        isChange:false,
        isEdit: false,
        schoolName:null,
        imageUrl: '',
        audioUrl: '',
        mp3:null,
        dialogImageUrl: '',
        dialogVisible: false,
        form: {
          cid:null,
          userName:null,
          title:'',
          checkin:null,
          content:'',
          image: null,
          audio: null,
        }
      }
    },
    methods: {
      ...mapActions("teacher", [ 'addTeacher', "getTeacherDetails",'upDataTeacher']),
      ...mapActions("student", [ "getStudentInfo","passStudentContriType"]),
      async submitForm() {
				this.loading = true;
        const {data,code,msg} = await this.passStudentContriType({
          ...this.form,
          role:1
        })
        
        if (code === '200') {
          this.$message.success(msg);
          this.$pushRoute("list")
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
      },
      handleAvatarSuccess(res, file) {
        this.form.image=res.data
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'||'image/png';
        if (!isJPG) {
          this.$message.error('上传图片格式不符!');
        }
        return isJPG;
      },
      handleAvatarSuccess3(res, file) {
        this.form.audio=res.data;
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
      audioloding(file){
         this.$message.info("正在上传,请耐心等待");
      }
    },
    computed: {
      ...mapState('common',{
        schoolData:state=>state.schoolList||[],
        teacherData:state=>state.teacherList||[]
      })
    },
    async created() {
      this.disabled=getBool()
      const id = this.$route.query.id;
      if (id) {
        this.isChange=true;
        const {data} = await this.getStudentInfo({cid:id});
        this.form = data
        // this.form.cid=data.cid;
        // this.form.userName=data.userName;
        // this.form.title=data.title;
        // this.form.content=data.content;
        // this.form.checkin=data.checkin;
        // this.form.audio=data.audio;
        // this.form.image = data.image; 
        this.mp3 = data.audio;
        this.imageUrl= (data.image != null)? `http://prxopj1oi.bkt.clouddn.com/${data.image}` : '';
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
      width: 200px;
    }
    .Title /deep/ .el-input__inner{
      width: 600px !important;
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
    width: 150px;
    height: 150px;
    line-height: 150px;
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
