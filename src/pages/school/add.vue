<template>
  <div id="ADD" v-loading="loading">
    <header-bar legend="添加/修改学校"/>
    <body-container>
      <el-form size="small" style="width: 600px" label-width="120px" label-position="left">
        <el-form-item label="学校名称" >
          <el-input placeholder="请输入" v-model="form.schoolName" class="userName"/>
        </el-form-item>
          <el-form-item label="学校校徽" >
          <el-upload
          class="avatar-uploader"
          name='file'
          action="http://120.27.16.130:8830/pic/uploadSchoolImages"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        </el-form-item>
           <el-form-item label="学校首页轮播图" >
          <el-upload
            :multiple='true'
            :limit='4'
            action="http://120.27.16.130:8830/pic/uploadSchoolImages"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            name="file"
            :on-success="handleADSuccess"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <p>提示：上传一次后，数据库存有数据，不必重复传</p>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
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
  import _ from 'lodash'


  export default {
    name: "ADD",
    components: {},
    data() {
      return {
        loading: false,
        isChange:false,
        imageUrl:'',
        dialogImageUrl: '',
        dialogVisible: false,
        slideshow:[],
        disabled:false,
        form: {
          schoolId:null,
          schoolName:null,
          longitude:null,
          latitude:null,
          image:null,
          slideshow:'',
        },

      }
    },
    components: { HeaderBar,bodyContainer},

    methods: {
      ...mapActions("teacher", ["getAllJob"]),
      ...mapActions('school',['addSchool','getSchoolDetails','upDataSchool']),
      async submitForm() {
        this.loading = true;
        this.form.slideshow=this.slideshow.join(',');
        if(this.isChange){
          const {data,code,msg} = await this.upDataSchool({
            ...this.form
          });
          if(code==='200'){
            this.$message.success(msg);
            this.$pushRoute("/school/list");
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

      },
      //校徽
       handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.form.image=res.url
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return   isLt2M;
      },
      //多图
       handleRemove(file, fileList) {
        _.pull(this.slideshow,file.response.url)
      },
      handlePictureCardPreview(file) {
        console.log(1)
        console.log(file)
        console.log(this.dialogImageUrl)
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleADSuccess(res,file,fileList){
        this.slideshow.push(res.url)
        console.log(this.slideshow)
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
        this.form.image=data.image;
        this.slideshow=[]
        this.imageUrl=`http://120.27.16.130/${data.image}`
      }
    }
  }
</script>

<style>
  #ADD .el-form-item__content {
    flex: 1;
  }
  
</style>
<style>
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
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
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
