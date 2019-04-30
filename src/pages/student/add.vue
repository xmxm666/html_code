<template>
  <div id="CarouselMap">
    <header-bar legend="添加课程"/>
    <body-container v-loading="loading">
      <el-row type="flex">
        <el-form  class="c-form" inline size="small">
           <el-form-item label="学校名称" >
        <!--<location-select style="margin-left: 30px"/>-->
        <el-select   v-model="schoolname" placeholder="请选择添加到哪个学校" @change="selectSchool">
          <el-option
            v-for="item in schoolData"
            :key="item.schoolId"
            :label="item.schoolName"
            :value="item.schoolId">
          </el-option>
        </el-select>
        </el-form-item>
        </el-form>
      </el-row>
      <el-row type="flex">
        <el-form  class="c-form" inline size="small">
          <el-form-item label="老师名称" >
            <!--<location-select style="margin-left: 30px"/>-->
            <el-select   v-model="teacherName" placeholder="请选择授课教师" @change="selectTeacher">
              <el-option
                v-for="item in teacherData"
                :key="item.adminId"
                :label="item.name"
                :value="item.adminId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row type="flex" >
        <el-form  class="c-form" inline size="small">
          <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="13">
              <el-form-item label="课程名" class="c-form__item">
                <el-input placeholder="请输入" v-model="form.courseName"/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="课程费用" class="c-form__item">
                <el-input-number v-model="form.coursePrice" controls-position="right" :min="1" :max="100000"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="40" class="l-row">
            <el-col :span="24">
              <el-form-item label="开课地点" class="c-form__item">
                <el-input placeholder="请输入" v-model="form.placeClass"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="上课人数" class="c-form__item">
                <el-input placeholder="请输入" v-model="form.peopleNumber"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="l-row">
            <el-col :span="24">
                     
              <el-form-item label="时间范围" class="c-form__item">
                <div>
                  <el-date-picker
                   value-format="yyyy-MM-dd"
                    v-model="timeRange"
                    type="daterange"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="l-row">
            <el-col :span="24">
              <el-form-item label="选择星期" >
                <!--<location-select style="margin-left: 30px"/>-->
                <el-select size="small"  v-model="selectWeek" placeholder="请选择星期" @change="weekSelect">
                  <el-option
                    v-for="item in WEEK"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span class="sing-time">上课时间</span>
              <el-time-select
                placeholder="起始时间"
                v-model="form.classList[0].startTime"
                :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
              }">
              </el-time-select>
              <el-time-select
                placeholder="结束时间"
               
                v-model="form.classList[0].endTime"
                :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30',
                minTime: form.classList[0].startTime
              }">
              </el-time-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <footer class="c-footer">
        <el-button size="small" type="primary" style="width: 120px" @click="submitForm">提交</el-button>
      </footer>
    </body-container>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../components/header-bar";
  import LocationSelect from "../../components/location-select";
  import BodyContainer from "../../components/body-container";
  import RegionSelect from "../../components/region-select";
  import ImgUpload from "../../components/img-upload";
  import {WEEK} from "../../enum";
  import {convertUTCTimeToLocalTime,excludeEmpty,getWeek, getTowWeek} from '../../utils'
  import _ from 'lodash'


  export default {
    name: "CarouselMap",
    components: {ImgUpload, RegionSelect, BodyContainer, LocationSelect, HeaderBar},
    data() {
      return {
        WEEK,
        selectWeek:null,
        loading: false,
        timeRange:[],
        schoolname:null,
        teacherName:null,
        form: {
          courseName:null,
          coursePrice:null,
          placeClass:null,
          peopleNumber:null,
          schoolId:null,
          courseTeacher:null,
          courseId:'',
          classList:[
            {
              week:null,
              startTime:null,
              endTime:null
            },
          ]
        },
        startTime: '',
        endTime: ''
      }
    },
    methods: {
      ...mapActions("lesson", ['addLesson', 'getLessonDetails']),
      ...mapActions('common',["getTeacherList","getSchoolList"]),
      async submitForm() {
				if(!this.timeRange){
					this.$message.error('没有选择时间');
				}
        this.loading = true;
        const form = {
          ...this.form,
          startDate: this.timeRange[0],
          endDate: this.timeRange[1],
        };

        const {code, msg} = await this.addLesson(form);
        if (code === '200') {
          this.$message.success("操作成功");
          this.$pushRoute("/page/lesson/list");
        } else {
          this.$message.error(msg);
        }
        this.loading = false;
      },
      weekSelect(value){
        this.form.week=value;
        this.selectWeek=getTowWeek(value);
        console.log(getTowWeek(value))

      },
      selectSchool(value){
        this.form.schoolId=value;
        this.getTeacherList({schoolId:value});
      },
      selectTeacher(value){
        console.log(this.timeRange)
         this.form.courseTeacher=value;
      }
			
    },
    computed: {
  
      ...mapState('common',{
        schoolData:state=>state.schoolList||[],
        teacherData:state=>state.teacherList||[]
      }),
    },
    async created() {
      const courseId = this.$route.query.courseId;
      if (courseId) {
        const {data} = await this.getLessonDetails({courseId});
        console.log(data)
        this.getTeacherList({schoolId:data.schoolId});
        this.schoolname=data.schoolName;
        this.teacherName=data.teacherName;
        this.timeRange=[];
        this.timeRange.push(data.startDate);
        this.timeRange.push(data.endDate);
        this.selectWeek=getTowWeek(data.classList[0].week*1);
    

       this.form = {
          courseName:data.courseName,
          coursePrice:data.coursePrice,
          placeClass:data.placeClass,
          peopleNumber:data.peopleNumber,
          schoolId:data.schoolId,
          courseTeacher:data.courseTeacher,
          courseId:data.courseId,
          classList:[
            {
              week:data.classList[0].week,
              startTime:data.classList[0].startTime,
              endTime:data.classList[0].endTime
            },
          ]
        }
      }
      if(!this.schoolData){
        await this.getSchoolList();
      }
    }
  }
</script>
<style lang="scss">
  #CarouselMap .el-form-item__content {
    flex: 1;

  }
  .el-form-item__label{
    width: 70px !important;
    text-align: left;
  }
</style>
<style scoped lang="scss">
  @import "../../assets/common";

  #CarouselMap {
.sing-time{
  padding: 0 20px;
	
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
  }
</style>
