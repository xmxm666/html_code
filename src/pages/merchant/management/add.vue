<template>
  <div id="ADD">
    <header-bar legend="添加商家"/>
    <body-container v-loading="loading">
      <el-form size="small" style="width: 600px" label-width="120px" label-position="left">
        <!-- 发布人 -->
        <el-form-item label="发布人">
          <el-input placeholder="请输入" v-model="form.customerId"/>
        </el-form-item>
        <!-- 企业名称 -->
        <el-form-item label="名称">
          <el-input placeholder="请输入" v-model="form.company.name"/>
        </el-form-item>
        <!-- 类型选择 -->
        <el-form-item label="类型">
          <el-select size="small" v-model="form.certification.type" placeholder="请选择类型">
            <el-option label="个人" :value="0"></el-option>
            <el-option  label="商家" :value="1"></el-option>
            <el-option label="企业" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <!-- 联系人 -->
        <el-form-item label="联系人" class="cl namePhone">
          <el-input placeholder="请输入" v-model="form.certification.name"/>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item label="电话" class="cl namePhone">
          <el-input placeholder="请输入" v-model="form.certification.phone"/>
        </el-form-item>
        <!-- 商家轮播图 -->
        <el-form-item  label="商家轮播图">
          <img-upload multiple="multiple" :default="adDufaults" @onRemove="uploadRemove($event,'ad')" @uploadSuccess="uploadSuccess($event,'ad')"/>
        </el-form-item>
        <!-- 商家详情图 -->
         <el-form-item  label="商家详情图">
          <img-upload multiple="multiple" :default="picturesDufalts" @onRemove="uploadRemove($event,'pictures')"  @uploadSuccess="uploadSuccess($event,'pictures')"/>
        </el-form-item>
        <!-- 身份证图片 -->
        <el-form-item  label="法人身份证正面">
           <img-upload  :default="form.certification.idFront" @onRemove="uploadRemove($event,'idFront')" @uploadSuccess="uploadSuccess($event,'idFront')"/>
        </el-form-item>
        <el-form-item label="法人身份证反面">
          <img-upload  :default="form.certification.idObverse" @onRemove="uploadRemove($event,'idObverse')" @uploadSuccess="uploadSuccess($event,'idObverse')"/>
        </el-form-item>
        <!-- 营业执照 -->
        <el-form-item  label="营业执照">
          <img-upload :default="form.certification.businessLicense" @onRemove="uploadRemove($event,'businessLicense')" @uploadSuccess="uploadSuccess($event,'businessLicense')"/>
        </el-form-item>
        <!-- 用户简介 -->
        <el-form-item label="用户简介" class="cl ">
          <el-input  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="form.company.information"> </el-input>
        </el-form-item>
        <!-- 日期选择 -->
        <el-form-item label="日期选择" class="cl ">
          <el-date-picker v-model="form.certification.createTime" type="date" @change="startTime" placeholder="开始日期"> </el-date-picker>
          <el-date-picker v-model="form.certification.invalidDate" type="date" placeholder="结束日期">     </el-date-picker>
        </el-form-item>
        <!-- 是否推荐 -->
        <el-form-item label="是否推荐" class="cl ">
          <el-radio v-model="form.company.isRecommend" :label="1">是</el-radio>
          <el-radio v-model="form.company.isRecommend" :label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <!-- 表单提交 -->
      <footer class="c-footer">
        <el-button size="small" type="primary" @click="submitForm" style="width: 120px">保存</el-button>
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
  import {excludeEmpty,randomNumber} from "../../../utils";

  export default {
    name: "ADD",
    components: {ImgUpload, RegionSelect, BodyContainer, LocationSelect, HeaderBar},
    data() {
      return {
        loading: false,
        adDufaults:[],
        picturesDufalts:[],
        form:{
          companyId:null,
          customerId:null,
          company:{
            name:null,
            ad:[],
            pictures:[],
            information:null,
            isRecommend:0
          },
          certification:{
            name:null,
            phone:null,
            type:null,
            idFront:null,
            idObverse:null,
            createTime:null,
            invalidDate:null,
            businessLicense:[]
          },
        },
        pageNum:1,
        pageSize:10,
        id:null
      }
    },
    methods: {
       ...mapActions("merchant/business", ['updateOrCreateCompany','getCompanyDetailById']),
       //获取详情信息
      async getTableData() {
        this.loading = true;
        const res = await this.getCompanyDetailById({
          id:this.id
        });
        this.loading = false;
        return res;
      },
      //提交表单
      async submitForm() {
        this.loading = true;
        const {code} = await this.updateOrCreateCompany(this.form);
        this.loading = false;
        if (code === 200) {
          this.$message.success("添加成功！");
          this.$pushRoute("list");
        } else {
          this.$message.success("添加失败！")
        }
      },
      //日期
      startTime(value){
        console.log(value) 
      },
       //添加图片
    uploadSuccess(file,site) {
        if(site=="ad"||site=="pictures"){
          this.form.company[site].push(file);
        }else{
          this.form.certification[site]=file;
        }
      }, 
        //删除图片
      uploadRemove(index,site) {
        console.log(index,site)
        if(site=="ad"||"pictures"){
          this.form.company[site].splice(index, 1);
        }else{
          this.form.certification[site].splice(index, 1);
        }
        console.log(this.form)
      },
      //给数组图片添加uid的函数
      pushUid(arr=[]){
        if(arr==null){
          arr=[]
        }
        const array=[]
          arr.map(url => (
           array.push({
            url: this.getPathByAssetPath(url),
            name: randomNumber(),
            uid: randomNumber()
          })
          ))
       return array
      }
    },
   
    
    computed: {
        ...mapState("merchant/business", {
        tableData: state => state.detailData || [],
        tableDataTotal: state => state.detailData.count,
      }),
    },
    async created() {
     //获取传参
      if(window.location.search){
          this.id=window.location.search.split('?')[1];
         await this.getTableData();

      }else{
        this.id=null
      }
       //回显
       console.log(this.tableData)
       if(this.tableData){
        const tableCertification=this.tableData.customer.customerCertification;
        const form={
          companyId:this.tableData.id,
          customerId:this.tableData.customerId,
          company:{
            name:tableCertification.companyName,
            ad:this.tableData.ad?this.tableData.ad:[],
            pictures:this.tableData.pictures?this.tableData.pictures:[],
            information:this.tableData.information,
            isRecommend:this.tableData.isRecommend
          },
          certification:{
            name:tableCertification.name,
            phone:tableCertification.phone,
            type:tableCertification.type,
            idFront:tableCertification.idFront,
            idObverse:tableCertification.idObverse,
            createTime:tableCertification.createTime,
            invalidDate:tableCertification.invalidDate,
            businessLicense:tableCertification.businessLicense
          },

      }
      console.log(this.tableData.pictures)
     this.adDufaults=this.pushUid(this.tableData.ad)
     this.picturesDufalts=this.pushUid(this.tableData.pictures)
      this.form=form;
       console.log(this.form)
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
    
    .detil{
        float: left;
        width: 243px;
        margin-left: 20px;
        height: 41px;
    }
    .detil /deep/ input{
        height: 41px;
    }
  }
</style>
