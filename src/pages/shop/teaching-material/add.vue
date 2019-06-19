<template>
  <div id="ADD">
    <header-bar legend="添加/编辑教材"/>
    <body-container>
      <el-form size="small" style="width: 600px" label-width="120px" label-position="left">
        <el-form-item label="学校名称">
          <el-select v-model="form.schoolId" placeholder="请选择添加到哪个学校" @change="selectSchool">
            <el-option
              v-for="item in schoolData"
              :key="item.schoolId"
              :label="item.schoolName"
              :value="item.schoolId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主分类">
          <el-select v-model="form.catId" placeholder="请选择添加到哪个分类">
            <el-option label="主要教材" :value="1"></el-option>
            <el-option label="辅助教材" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="次分类">
          <el-select v-model="form.extendCatId" placeholder="请选择添加到哪个分类">
            <el-option
              v-for="item in bookType"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row type="flex">
          <el-form-item label="封面图片">
            <el-upload
                class="avatar-uploader"
                :action="`${backendPath}/pic/uploadSchoolImages`"
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
        </el-row>
        <el-form-item label="作者" class="recruitmentTitle2">
          <el-input placeholder="请输入" v-model="form.booksAuthor"/>
        </el-form-item>
        <el-form-item label="商品编号"  class="recruitmentTitle">
          <el-input placeholder="请输入" v-model="form.booksSn"/>
        </el-form-item>
        <el-form-item label="教材名称" class="recruitmentTitle">
          <el-input placeholder="请输入" v-model="form.booksName"/>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="form.shopPrice" controls-position="right" :precision="2" :step="0.01" :max="100000" style="margin-right:10px"></el-input-number>元
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="form.storeCount"  :min="1" label="描述文字" style="margin-right:10px"></el-input-number>件
        </el-form-item>
        <el-form-item label="是否上架">
          <el-radio-group v-model="form.isOnSale" size="small">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
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

  export default {
    name: "ADD",
    components: {ImgUpload, RegionSelect, BodyContainer, LocationSelect, HeaderBar},
    data() {
      return {
        backendPath,
        ImgPath,
        isChange:false,
        isEdit: false,
        schoolName:null,
        imageUrl:null,
        form: {
          catId:null,
          schoolId:null,
          booksSn:null,
          booksAuthor:null,
          shopPrice:null,
          storeCount:null,
          originalImg:null,
          extendCatId:null,
          booksName:null,
          isOnSale:null
        },
        bookType:[
          {
            id:1,
            label:'文史'
          },
          {
            id:2,
            label:'音体'
          },
          {
            id:3,
            label:'理工'
          },
          {
            id:4,
            label:'综合'
          },
          {
            id:5,
            label:'内部讲义'
          }
        ]
      }
    },
    methods: {
      ...mapActions("shop", [ 'addTextbook', "textbookID","selectTextbook"]),
      ...mapActions('common',["getSchoolList"]),
      async submitForm() {
        let res;
				this.loading = true;
        if(this.isChange){
          res = await this.selectTextbook({...this.form,id:this.$route.query.id})
        }else{
          res = await this.addTextbook({...this.form})
        }
        if(res.code==200){
          this.$message.success(res.msg);
          this.$pushRoute("list");
        }else{
          this.$message.error(res.msg)
        }
        console.log(res)
				this.loading = false;
      },
      toString(val){
        return val.toString()
      },
      selectSchool(value){
        this.form.schoolId=value
      },
      handleAvatarSuccess(res, file) {
        console.log(res)
        this.form.originalImg=res.url
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'||'image/png';
        if (!isJPG) {
          this.$message.error('上传图片格式不符!');
        }
        return isJPG;
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
        const {data,code,msg} = await this.textbookID({id});
        console.log(code,data)
        this.form.booksSn=data.booksSn;
        this.form.booksAuthor=data.booksAuthor;
        this.form.schoolId=parseInt(data.schoolId);
        this.form.shopPrice=data.shopPrice;
        this.form.storeCount=data.storeCount;
        this.form.originalImg=data.originalImg;
        this.form.extendCatId=data.extendCatId;
        this.form.catId=data.catId;
        this.form.booksName=data.booksName;
        this.form.isOnSale=data.isOnSale;
        console.log(this.form.schoolId)
        this.imageUrl= (data.originalImg != null)? ImgPath+data.originalImg : '';
        
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
    .recruitmentTitle2 /deep/ .el-input__inner{
      width: 300px;
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
   
  }
</style>
