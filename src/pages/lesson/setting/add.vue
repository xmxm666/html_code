<template>
  <div id="CarouselMap">
    <header-bar legend="添加/修改报名条件设置"/>
    <body-container v-loading="loading">
      <el-row type="flex">
        <el-form  class="c-form" inline size="small">
           <el-form-item label="学校名称" v-if="!disabled" >
        <!--<location-select style="margin-left: 30px"/>-->
        <el-select   v-model="form.schoolName" placeholder="请选择添加到哪个学校" @change="selectSchool">
          <el-option
            v-for="item in schoolData"
            :key="item.schoolId"
            :label="item.schoolName"
            :value="item.schoolName+'-'+item.schoolId">
          </el-option>
        </el-select>
        </el-form-item>
        </el-form>
      </el-row>
      <el-row type="flex">
        <el-form  class="c-form" inline size="small">
          <el-form-item label="课程名称" >
            <!--<location-select style="margin-left: 30px"/>-->
            <el-select   v-model="form.courseName" placeholder="请选择课程名称" @change="selectTeacher">
               <el-option
                label="全部"
                value="全部-0">
              </el-option>
              <el-option
                v-for="item in lessonData"
                :key="item.courseId"
                :label="item.courseName"
                :value="item.courseName+'-'+item.courseId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row type="flex" >
        <el-form  class="c-form" inline size="small">
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
              <el-form-item label="年龄范围" class="c-form__item">
                <div>
              <el-input-number v-model="form.startAge" :min="1" :max="100" label="描述文字"></el-input-number>
              至
              <el-input-number v-model="form.endAge"  :min="1" :max="100" label="描述文字"></el-input-number>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row type="flex" class="l-row">
            <el-col :span="24">
              <el-form-item label="人员类别" class="c-form__item">
                <div>
                     <el-select v-model="people" multiple placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <footer class="c-footer">
        <el-button size="small" type="primary" style="width: 120px" @click="submitForm">保存</el-button>
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
  import {WEEK} from "../../../enum";
  import {convertUTCTimeToLocalTime,excludeEmpty,getWeek, getTowWeek, getBool} from '../../../utils'
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
       
        people:[],
        disabled:false,
        form: {
          schoolId:null,
          courseId:null,
          startAge:null,
          endAge:null,
          schoolName:null,
          courseName:null,
          registCategoryOne:null,
          registCategoryTwo:null,
          registCategoryThree:null,
          registCategoryFour:null,
          registCategoryFive:null,
          registCategorySix:null,
        },
        options:['本单位职工','本单位职工家属','其他','本社区居民'],
        startTime: '',
        endTime: ''
      }
    },
    methods: {
      ...mapActions("lesson", ['addLessonSetting', 'getLessonSettingDetails','getLessonList','upDataLessonSetting']),
      ...mapActions('common',["getSchoolList"]),
      async submitForm() {
      
       this.people = _.compact(this.people);

        this.form.registCategoryOne=this.people[0]
        this.form.registCategoryTwo=this.people[1]
        this.form.registCategoryThree=this.people[2]
        this.form.registCategoryFour=this.people[3]
        this.form.registCategoryFive=this.people[4]
        this.form.registCategorySix=this.people[5]
				if(!this.timeRange){
					this.$message.error('没有选择时间');
        }
        this.loading = true;
        const form = {
          ...this.form,
          registstartTime: this.timeRange[0]+' 00:00:00',
          registendTime: this.timeRange[1]+' 00:00:00',
        };
         const id = this.$route.query.id;
          if (id) {
          const {code, msg} = await this.upDataLessonSetting({
            ...form,
            id
          });
            if (code === '200') {
            this.$message.success("操作成功");
              this.$pushRoute("/page/lesson/setting/list");
            } else {
              this.$message.error(msg);
            }
          }else{
          const {code, msg} = await this.addLessonSetting(form);
          if (code === '200') {
            this.$message.success("操作成功");
            this.$pushRoute("/page/lesson/setting/list");
          } else {
            this.$message.error(msg);
          }
       }
        this.loading = false;
      },
      weekSelect(value){
        this.form.week=value;
        this.selectWeek=getTowWeek(value);

      },
      selectSchool(value){
        this.form.schoolName=value.split('-')[0];
        this.form.schoolId=value.split('-')[1];
        this.getLessonList({schoolId:this.form.schoolId});
      },
      selectTeacher(value){
        this.form.courseName=value.split('-')[0];
        this.form.courseId=value.split('-')[1];
      }
			
    },
    computed: {
  
      ...mapState('common',{
        schoolData:state=>state.schoolList||[],
      }),
       ...mapState('lesson',{
        lessonData:state=>state.lessonList||[],
      }),
     
    },
    async created() {
      this.disabled=getBool()
      this.getLessonList({schoolId:localStorage.getItem('schoolId')});
      const id = this.$route.query.id;
      if (id) {
        const {data} = await this.getLessonSettingDetails({id});
        const result = await this.getLessonList({schoolId:data.schoolId});
      console.log(data)
        this.teacherName=data.teacherName;
        this.timeRange=[];
        this.timeRange.push(data.registstartTime.split(' ')[0]);
        this.timeRange.push(data.registendTime.split(' ')[0]);
        this.people.push(data.registCategoryOne);
        this.people.push(data.registCategoryTwo);
        this.people.push(data.registCategoryThree);
        this.people.push(data.registCategoryFour);
        this.people.push(data.registCategoryFive);
        this.people.push(data.registCategorySix);

       this.form = {
            schoolId:data.schoolId,
            courseId:data.courseId,
            startAge:data.startAge,
            endAge:data.endAge,
            courseName:data.courseName,
            schoolName:data.schoolName,
         
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
  @import "../../../assets/common";

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
