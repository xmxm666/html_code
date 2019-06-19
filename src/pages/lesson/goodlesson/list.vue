<template>
  <div id="goodlessonList">
    <header-bar legend="精品课程列表">
        <div slot="left">
            <el-button type="primary" size="small" style="margin-left: 20px" @click="$pushRoute('/page/lesson/goodlesson/add')">
            添加精品课程
            </el-button>
        </div>
        <!-- <el-select v-model="searchForm.isenable" placeholder="请选择状态" :style="{marginRight:'10px',height:'32px'}">
            <el-option
            v-for="item in lessonStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select> -->
        <el-input class="search-input" v-model="searchForm.search" placeholder="请输入课程标题" :style="{marginRight:'10px',height:'32px'}"></el-input>
        <!-- <el-input class="search-input" v-model="searchForm.teacher" placeholder="请输入课程老师" :style="{marginRight:'10px',height:'32px'}"></el-input> -->
        <el-button type="success" @click="getTableData(1,10)" size="small" style="width: 80px;margin-left: 20px">搜索 </el-button>
    </header-bar>
    <body-container>
        <el-table
        stripe
        ref="multipleTable"
        :data="lessonData"
        tooltip-effect="dark"
        border
        v-loading="loading"
        height="600px"
        style="width: 100%">
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          label="课程ID"
          align="center"
          prop="fineId"
         >
        </el-table-column>
        <el-table-column
          prop="teacher"
          label="教师"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="title"
          label="课程名称"
          align="center"
          width="300px"
         >
        </el-table-column>
        <el-table-column
          prop="introduce"
          label="课程介绍"
          align="center"
          width="300px"
          show-overflow-tooltip>
          <template  slot-scope="scope">
            {{scope.row.introduce}}
          </template>
        </el-table-column>
        <el-table-column
          label="封面图片"
          align="center"
          prop="cover"
          >
          <template slot-scope="scope" style="{width:150px;height:50px;}">
            <div style="{width:150px;height:50px;}">
              <img-wrapper v-show="scope.row.cover!=null&&scope.row.cover!=''" size="medium" :src="qnypath+scope.row.cover" style="{width:50px;height:50px;}"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="课程视频"
          align="center"
          prop="video"
          width="200px"
         >
        </el-table-column>
        <el-table-column
          prop="visits"
          label="浏览数"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="thumbup"
          label="点赞数"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="快捷操作" width="200px">
          <template slot-scope="scope"  align="center">
            <el-button
              size="mini"
              @click="carouselMapEdit(scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="carouselMapInvalid(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="c-form-pagination">
        <el-pagination
          @size-change="pageSizeChange"
          @current-change="pageNumChange"
          :current-page.sync="pageNum"
          :page-sizes="pageSizeOption"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="lessonData.length">
        </el-pagination>
      </div>
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
  import selectSchool from "../../../components/select-school";
  import imgWrapper from "../../../components/img-wrapper";
  import {qnypath} from '../../../project-config/base';
  import {WEEK} from "../../../enum";
  import {convertUTCTimeToLocalTime,excludeEmpty,getWeek, getTowWeek, getBool} from '../../../utils'
  import _ from 'lodash'


  export default {
    name: "goodlessonList",
    components: {ImgUpload, RegionSelect, BodyContainer, LocationSelect, HeaderBar,selectSchool,imgWrapper},
    data() {
      return {
        WEEK,
        qnypath,
        selectWeek:null,
        loading: false,
        timeRange:[],
        people:[],
        disabled:false,
        pageNum: 1,
        pageSize: 10,
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
          offlineRegist: '1'
        },
        options:['本单位职工','本单位职工家属','其他','本社区居民'],
        startTime: '',
        endTime: '',
        searchForm: {
          schoolId: null,
          search:null
        },
        lessonStatus:[
          {label:'全部',value:null},
          {label:'未启用',value:0},
          {label:'已启用',value:1},
          {label:'下架',value:-1}
        ],
        timer:null,
        pickerOptions: {
        shortcuts: [{
            text: '最近一周',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    computed: {
        ...mapState('lesson',{
            lessonData:state=>state.goodlessonList.list||[]
        }),
        pageSizeOption: _ => [10, 20, 30, 40],
    },
    methods: {
      ...mapActions("lesson", ['addLessonSetting', 'deleteGoodLesson','getLessonList','upDataLessonSetting','getgoodlesson']),
      ...mapActions('common',["getSchoolList"]),
      async getTableData(pageNum, pageSize) {
        this.searchForm=excludeEmpty(this.searchForm)
        this.loading = true;
        const res = await this.getgoodlesson({
          ...this.searchForm,
          pageNum,
          pageSize
        });
        console.log(res)
        this.loading = false;
        return res;
      },
      carouselMapInvalid(row) {
        this.$confirm('确认删除该学生？')
          .then(async () => {
            //如果row有值就是表格中的按钮 否则就是下面的工具栏
            const {code} = await this.deleteGoodLesson({
              fineId: row.fineId,
            });
            if (code === '200') {
              this.$message.success("删除成功!");
              this.getTableData(this.pageNum, this.pageSize);
            } else {
              this.$message.error("删除失败,请联系开发人员检查!");
            }
          })
          .catch(() => {
            this.$message("操作已取消");
          });
      },
      carouselMapEdit(row) {
        this.$router.push({path: `/page/lesson/goodlesson/add`, query: {id: row.fineId}})
      },
      pageSizeChange(size) {
        this.pageSize = size;
        const res = this.getTableData(this.pageNum, this.pageSize);
        console.log(this.tableData)
      },
      pageNumChange(num) {
        this.pageNum = num;
        const res = this.getTableData(this.pageNum, this.pageSize);
        setTimeout(()=>{
          console.log(this.tableData)
        },1000)
        
      },
    },
    async created() {
      const res = await this.getTableData(this.pageNum, this.pageSize);
      console.log(res)
         if(getBool()){
          this.disabled=true;
         }
    }
  }
  
</script>
<style scoped lang="scss">
  #goodlessonList {
    .c-form-pagination {
      text-align: center;
      margin-top: 30px;
      display: flex;
      justify-content: center;
    }
    .sImg{
      width: 34px;
      height: 34px;
    }
    .search-input{
      height: 32px;
      margin-right: 10px;
      width: 200px;
    }
   & /deep/ .el-input__icon{
      display: flex;
      align-items: center;
      justify-content: center;
    }
   & /deep/ .el-input__inner{
      height: 32px;
    }
    & /deep/ .el-range-separator{
    display: flex;
    align-items: center;
  
  }
   
  }
</style>
