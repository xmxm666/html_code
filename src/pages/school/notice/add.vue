<template>
  <div id="ADD" v-loading="loading">
    <header-bar legend="添加"/>
    <body-container>
      <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="通知公告名称" >
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="选择学校" >
          <el-select v-model="schoolName" placeholder="请选择学校" @change="selectSchool">
            <el-option :label="item.schoolName" :value="item.schoolId" v-for="(item,i) in schoolData" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面图片">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="ruleForm.dialogVisible">
            <img width="100%" :src="ruleForm.dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="是否置顶">
          <el-switch v-model="ruleForm.istop" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="是否置顶" >
          <el-switch v-model="ruleForm.ispublic" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <!--        1-通知公告, 3-校园介绍, 4-联盟资讯, 5-政策法规-->
        <el-form-item label="文章类型" >
          <el-radio-group v-model="ruleForm.type">
            <el-radio :label="1">通知公告</el-radio>
            <el-radio :label="3">校园介绍</el-radio>
            <el-radio :label="4">联盟资讯</el-radio>
            <el-radio :label="5">政策法规</el-radio>
          </el-radio-group>
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


  export default {
    name: "ADD",
    data() {
      return {
        loading: false,
        isChange:false,
        schoolName:null,
        dialogImageUrl: '',
        dialogVisible: false,
        ruleForm: {
          schoolId:null,
          type:null,
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
          ...this.ruleForm
        });
        if(code==='200'){
          this.$message.success(msg);
          this.$pushRoute("/school/notice/list")
        }else{
          this.$message.error(msg);
        }
				this.loading = false;

      },
      handleRemove(file, fileList) {
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
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
      const id = this.$route.query.id;
      if (id) {
        this.isChange=true;
        const {data} = await this.getArticlDetails({id});
        this.id=data.id;
        this.schoolName=data.schoolName;
        this.ruleForm.schoolId=data.schoolId;
        this.ruleForm.type=data.type*1;
        this.ruleForm.title=data.title;
        this.ruleForm.istop=data.istop*1;
        this.ruleForm.ispublic=data.ispublic*1;
        this.ruleForm.content=data.content;
        this.ruleForm.url=data.url;
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
  }
</style>
