<template>
  <div id="ADD" v-loading="loading">
    <header-bar legend="添加/编辑活动"/>
    <body-container>
      <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" >
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="选择学校" >
          <el-select v-model="schoolName" placeholder="请选择学校" @change="selectSchool">
            <el-option :label="item.schoolName" :value="item.schoolId" v-for="(item,i) in schoolData" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动图片">
          <el-upload
            class="avatar-uploader"
            :action="`http://120.27.16.130:8830/pic/uploadSchoolImages`"
            :show-file-list="false"
            name='file'
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="ruleForm.image" :src="`${ImgPath}/${ruleForm.image}`" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-dialog :visible.sync="ruleForm.dialogVisible">
            <img width="100%" :src="`${ImgPath}/${ruleForm.image}`" alt="">
          </el-dialog>
        </el-form-item>
           <el-form-item label="活动类型" >
          <el-radio-group v-model="ruleForm.type">
            <el-radio :label="2">本校活动</el-radio>
            <el-radio :label="1">联盟活动</el-radio>
          </el-radio-group>
        </el-form-item>
          <el-form-item label="活动地点">
            <el-input v-model="ruleForm.place"></el-input>
        </el-form-item>
        <el-form-item label="参与人数">
             <el-input-number v-model="ruleForm.number"  :min="1" :max="1000" label="描述文字"></el-input-number>
        </el-form-item>
         <el-form-item label="人员类别">
            <el-select v-model="people" multiple placeholder="请选择" filterable allow-create default-first-option>
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
            <el-form-item label="活动起止时间">
             <el-date-picker
              v-model="startTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>
          <el-form-item label="报名起止时间">
             <el-date-picker
              v-model="registStartTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>
          <el-form-item label="参与年龄范围">
             <el-input-number v-model="ruleForm.startAge"  :min="1" :max="99" label="描述文字"></el-input-number>
            <el-input-number v-model="ruleForm.endAge"  :min="1" :max="100" label="描述文字"></el-input-number>
        </el-form-item>
          
          <el-form-item label="活动内容">
          <rich-text v-model="ruleForm.content"></rich-text>
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
import { convertUTCTimeToLocalTime } from '../../../utils';
  import {backendPath,ImgPath} from "../../../project-config/base";


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
        id:null,
        startTime:[],
        registStartTime:[],
        options:['教师','学员','管理员'],
        
        people:[],
        ruleForm: {
          id:null,
          schoolId:null,
          type:null,
          title:null,
          content:'',
          image:null,
          number:null,
          place:null,
          startTime:null,
          endTime:null,
          registStartTime:null,
          registEndTime:null,
          startAge:null,
          endAge:100,
          category:null,
        },
      }
    },
    components: { HeaderBar,bodyContainer,richText},

    methods: {
      ...mapActions('school',['addActivity','getActivityDetails']),
      ...mapActions('common',['getSchoolList']),
      async submitForm() {
        if(this.startTime.length!==0){
          this.ruleForm.startTime=convertUTCTimeToLocalTime(this.startTime[0],'y-m-d')
          this.ruleForm.endTime=convertUTCTimeToLocalTime(this.startTime[1],'y-m-d')
        }
        if(this.registStartTime.length!==0){
         this.ruleForm.registStartTime=convertUTCTimeToLocalTime(this.registStartTime[0],'y-m-d')
        this.ruleForm.registEndTime=convertUTCTimeToLocalTime(this.registStartTime[1],'y-m-d')
        }
        this.ruleForm.category=this.people.join(',')
        this.loading = true;
        if(this.isChange){
          this.ruleForm.id= this.id;
        }
        const {data,code,msg} = await this.addActivity({
          ...this.ruleForm
        });
        if(code==='200'){
          this.$message.success(msg);
          this.$router.back();
        }else{
          this.$message.error(msg);
        }
				this.loading = false;

      },
       handleAvatarSuccess(res, file) {
        this.ruleForm.image=res.url
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
      const id = this.$route.query.id;
      if (id) {
        this.isChange=true;
        const {data} = await this.getActivityDetails({activitiesId:id});
        console.log(data)
        this.id=data.id;
        this.schoolName=data.schoolName;
        this.ruleForm=data;
        this.ruleForm.id=data.id;
        this.startTime.push(data.startTime)
        this.startTime.push(data.endTime)
        this.registStartTime.push(data.registStartTime)
        this.registStartTime.push(data.registEndTime)
        this.ruleForm.type=data.type*1;
        console.log(data.category)
        if(data.category){this.people=data.category.split(',')}
        

        console.log(this.ruleForm.title)
      }
      await this.getSchoolList();
    }

  }
</script>


<style scoped lang="scss">
  @import "../../../assets/common";

  #ADD {
   .select-people{
     margin-left: 0;
   }
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
