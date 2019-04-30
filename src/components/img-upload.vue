<template>
  <div id="ImgUpload">
    <el-upload
      v-if="!multiple"
      class="avatar-uploader"
      :action="`${backendBasePath}/fileUpload`"
      :show-file-list="false"
      :on-error="productUploadAvatarError"
      :on-success="productPictureUpload"
      :before-upload="beforeAvatarUpload">
      <img-wrapper alt="暂无图片" v-if="picture" :src="getPathByAssetPath(picture)"
                   class="upload-show-image"/>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <aside class="extra">上传图片</aside>
    </el-upload>
    <el-upload
      v-else
      multiple
      :limit="max"
      :file-list="fileList"
      :action="`${backendBasePath}/fileUpload`"
      :on-success="productPictureUpload"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :before-remove="beforeRemoveHandle"
      :on-exceed="exceedUploadHandle"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img-wrapper width="100%" :src="dialogImageUrl" alt=""/>
    </el-dialog>
  </div>
</template>

<script>
  import {backendBasePath} from "../project-config/base";
  import _ from 'lodash'
  import ImgWrapper from "./img-wrapper";

  export default {
    name: "ImgUpload",
    components: {ImgWrapper},
    props: {
      multiple:[String,Number,Array],
       max:[String,Number,Array], 
       min:[String,Number,Array], 
    default:[String,Number,Array]
    },
    data() {
      return {
        backendBasePath,
        picture: "",
        dialogImageUrl: '',
        dialogVisible: false,
        fileList: []
      }
    },
    methods: {
      //上传相关
      productPictureUpload({data}, file) {
        this.fileList.push && this.fileList.push(file);
        this.picture = data[0];
        this.$emit("uploadSuccess", data[0]);
      },
      productUploadAvatarError() {
        this.$message.error('上传失败,请联系开发人员检查服务器!');
      },
      beforeRemoveHandle(file, fileList) {
        if (fileList.length <= this.min) {
          this.$message.error(`至少保留${this.min}张图片！`);
          return false;
        }
        return true;
      }, exceedUploadHandle() {
        this.$message.error(`最多可上传${this.max}张图片！`);
      },
      beforeAvatarUpload(file) {
        const imageType = ['image/jpeg', 'image/png', 'image/gif'];
        const isJPG = imageType.some(type => file.type === type);
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isJPG) {
          this.$message.error('只能上传JPG,PNG,GIF格式的图片!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 10MB!');
        }
        return isJPG && isLt2M;
      },
      handleRemove(file, fileList) {
        const removeIndex = _.findIndex(this.fileList, {uid: file.uid});
        this.fileList.splice(removeIndex, 1);
        this.$emit("onRemove", removeIndex);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    },
    computed: {},
    watch: {
      default(newVal) {
        const data = _.cloneDeep(newVal);
        this.picture = data;
        this.fileList = data || [];
      }
    },
    created() {
      const data = _.cloneDeep(this.default);
      this.picture = data;
      this.fileList = data || [];
    }
  }
</script>

<style lang="scss">
  @import "../assets/common";

  #ImgUpload {
    .upload-show-image {
      width: 200px;
      height: 200px;
    }

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      line-height: 0;
    }
    .avatar-uploader .extra {
      @include absoluteFull;
      top: auto;
      background-color: #EC4E4E;
      height: 24px;
      @include flex-center;
      color: #FFFFFF;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .is-error .avatar-uploader .el-upload {
      border-color: #db273d;
    }
    .is-success .avatar-uploader .el-upload {
      border-color: #05db49;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      @include flex-center;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }

  }
</style>
