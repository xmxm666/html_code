<template>
  <div id="ADD" v-loading="loading">
    <header-bar legend="添加/编辑缴费信息"/>
    <body-container>
      <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="选择学校"  class="recruitmentTitle">
            <el-select v-model="schoolName" placeholder="请选择添加到哪个学校" @change="selectSchool">
                <el-option
                    v-for="item in schoolData"
                    :key="item.schoolId"
                    :label="item.schoolName"
                    :value="item.schoolName+'-'+item.schoolId">
                </el-option>
            </el-select>
        </el-form-item>
        <el-row type="flex">
          <el-form-item label="输入地点"  class="recruitmentTitle">
            <el-input v-model="ruleForm.paymentAddress"/>
          </el-form-item>
        </el-row>
        <el-form-item label="活动起止时间">
            <el-date-picker
            v-model="startTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
            </el-date-picker>
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
  import { convertUTCTimeToLocalTime } from '../../../utils';
  import {backendPath,ImgPath} from "../../../project-config/base";
  import _ from 'lodash'

  export default {
    name: "ADD",
    data() {
      return {
        backendPath,
        ImgPath,
        loading: false,
        isChange:false,
        id: null,
        schoolName:null,
        dialogImageUrl: '',
        dialogVisible: false,
        startTime:[],
        ruleForm: {
          id:null,
          schoolId:null,
          paymentStarttime: null,
          paymentEndtime: null,
          paymentAddress: ''
        },
      }
    },
    components: { HeaderBar,bodyContainer},

    methods: {
      ...mapActions('trade',['addActivity','addActivity2','getActivityDetails']),
      ...mapActions('common',['getSchoolList']),
      async submitForm() {
        if(this.startTime.length!==0){
          this.ruleForm.paymentStarttime=convertUTCTimeToLocalTime(this.startTime[0],'y-m-d') + ' 00:00:00';
          this.ruleForm.paymentEndtime=convertUTCTimeToLocalTime(this.startTime[1],'y-m-d') + ' 00:00:00';
        }
        this.loading = true;
        console.log(this.ruleForm)
        var res;
        if(this.isChange==true)
         res =  await this.addActivity2({...this.ruleForm});
        else 
         res =  await this.addActivity({...this.ruleForm});
        console.log(res)
        if(res.code==='200'){
          this.$message.success(res.msg);
          this.$router.back();
        }else{
          this.$message.error(res.msg);
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
        this.ruleForm.schoolName=value.split('-')[0];
        this.ruleForm.schoolId=value.split('-')[1];
      }
    },
    computed: {
      ...mapState("common", {
        schoolData: state => state.schoolList||[],
      }),
    },
    async created() {
      const id = this.$route.query.id;
      await this.getSchoolList();
      if (id) {
        this.isChange=true;
        const {data} = await this.getActivityDetails({id});
        console.log(data)
        this.ruleForm.id=data.id;
        this.ruleForm.schoolId=data.schoolId;
        this.ruleForm.paymentStarttime = data.paymentStarttime;
        this.ruleForm.paymentEndtime = data.paymentEndtime;
        this.startTime = [this.ruleForm.paymentStarttime,this.ruleForm.paymentEndtime]
        this.ruleForm.paymentAddress = data.paymentAddress;
        this.schoolName = this.schoolData[_.findIndex(this.schoolData,['schoolId',this.ruleForm.schoolId])].schoolName
        // this.registStartTime.push(data.registStartTime)
        // this.registStartTime.push(data.registEndTime)

      }
      
      
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
  .recruitmentTitle /deep/ .el-input__inner{
      width: 300px;
    }
  }
</style>
