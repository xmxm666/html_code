<template>
  <div id="CarouselMapList">
    <header-bar legend="课程列表">
      <div slot="left">
        <el-button type="primary" size="small" style="margin-left: 20px" @click="$pushRoute('/page/lesson/add')">
          添加课程
        </el-button>
      </div>
       <el-date-picker
       :style="{marginRight:'10px'}"
      v-model="timer"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions">
    </el-date-picker>
      <el-select v-model="searchForm.isenable" placeholder="请选择状态" :style="{marginRight:'10px',height:'32px'}">
        <el-option
          v-for="item in lessonStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
       <el-input class="search-input" v-model="searchForm.search" placeholder="请输入课程名"></el-input>
       <selectSchool :disabled='disabled' ></selectSchool>  
      <el-button type="success" @click="getTableData(1,10)" size="small" :disabled="disabled"  style="width: 80px;margin-left: 20px">搜索 </el-button>
      <!-- <el-button type="primary" @click="downData" size="small" :disabled="disabled"  style="width: 80px;margin-left: 20px">导出数据 </el-button> -->
    </header-bar>
    <body-container>
      <el-table
        stripe
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        border
        v-loading="loading"
        height="600px"
        style="width: 100%">
        <el-table-column
          type="selection"
          >
        </el-table-column>
        <el-table-column
          label="课程ID"
          align="center"
          prop="courseId"
         >
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="placeClass"
          label="上课地址"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="startDate"
          label="开课时间"
          align="center"
          :formatter="formatterGenerator('dateTime')"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="endDate"
          label="结束时间"
          align="center"
          :formatter="formatterGenerator('dateTime')"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="coursePrice"
          label="课程价钱"
          align="center"
          show-overflow-tooltip>
          <template  slot-scope="scope">
            {{scope.row.coursePrice}}元
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          >
          <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.isenable*1===0?`danger`:scope.row.isenable*1===-1?'info':'success'">{{scope.row.isenable*1===0?`未启用`:scope.row.isenable*1===-1?'下架':'正常'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="快捷操作"
        width="300px"
                         align="center">
          <template slot-scope="scope">
             <el-button
              size="mini"
              v-if="scope.row.isenable*1!==-1"
              :type="scope.row.isenable*1===0?'success':'warning'"
              @click="changeStatus(scope.$index, scope.row)">{{scope.row.isenable*1===0?'启用':'停用'}}
              
            </el-button>
            <el-button
              size="mini"
              v-if="scope.row.isenable*1!==-1"
              @click="carouselMapEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="carouselMapInvalid(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="c-form-pagination">
        <div>
         <el-button type="success" @click="changeStatusMore(1)">一键启用</el-button>
         <el-button type="warning" @click="changeStatusMore(0)">一键停用</el-button>
        <el-button type="danger" @click="deleteLessonMore">一键删除</el-button>
        </div>
        <el-pagination
        :style="{flex:1,display:'flex',justifyContent:'center'}"
          @size-change="pageSizeChange"
          @current-change="pageNumChange"
          :current-page.sync="pageNum"
          :page-sizes="pageSizeOption"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableTotal">
        </el-pagination>
      </div>
    </body-container>

  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../components/header-bar";
  import BodyContainer from "../../components/body-container";
  import {excludeEmpty,getBool,convertUTCTimeToLocalTime} from "../../utils";
  import RegionSelect from "../../components/region-select";
  import selectSchool from "../../components/select-school";


  export default {
    name: "CarouselMapList",
    components: {RegionSelect, BodyContainer, HeaderBar,selectSchool},
    data() {
      return {
        imageDialogVisible: false,
        imageDialogImageUrl: '',
        value: '',
        loading: false,
        multipleSelection: [],
        categories: [],
        pageNum: 1,
        pageSize: 10,
        pieChart: null,
        barChart: null,
        disabled:false,
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
        lessonStatus:[
          {label:'全部',value:null},
          {label:'未启用',value:0},
          {label:'已启用',value:1},
          {label:'下架',value:-1}
        ],
        status:0,
        //根据是否失效来切换按钮
        featureBtnState: 0,
        //默认搜索条件
        searchForm: {
          schoolId: null,
          search:null,
          isenable:null,
          startDate:null,
          endDate:null,
        },
      }
    },
    methods: {
      showBigPicture(url) {
        this.imageDialogImageUrl = url;
        this.imageDialogVisible = true;
      },
      ...mapActions("lesson", ['getLessonList','deleteLesson','changeLessonStatus','downLessonData']),
      ...mapActions('common',['getSchoolList']),
      isPriceReduction(specifications) {
        return specifications.some((s) => s["isPriceReduction"]);
      },
      async getTableData(pageNum, pageSize) {
        if(this.timer){
          this.searchForm.startDate=convertUTCTimeToLocalTime(this.timer[0],'y-m-d');
          this.searchForm.endDate=convertUTCTimeToLocalTime(this.timer[1],'y-m-d');
        }
        this.searchForm=excludeEmpty(this.searchForm)
        this.loading = true;
        const res = await this.getLessonList({
          ...this.searchForm,
          pageNum,
          pageSize,
           schoolId:localStorage.getItem('schoolId')
        });
        this.loading = false;
        return res;
      },
      //多条状态修改
     async changeStatusMore(type){
         if(this.$refs.multipleTable.selection.length===0){
              this.$message.error("你没有选择任何课程!");
              return false
        }
          await this.changeLessonStatus({
          courseIds:this.$refs.multipleTable.selection.map(item=>{ return item.courseId }),
          isenable:type
        })
          this.getTableData(this.pageNum, this.pageSize);
      },
      //多条删除
      deleteLessonMore(){
        if(this.$refs.multipleTable.selection.length===0){
              this.$message.error("你没有选择任何课程!");
              return false
        }
         this.$confirm('确认删除选中课程？')
          .then(async () => {
            const {code} = await this.deleteLesson({
              courseIds:this.$refs.multipleTable.selection.map(item=>{ return item.courseId }),
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
     async changeStatus(index,row){
       if(row.isenable*1===0){
         this.status=1
       }else{
        this.status=0
       }
        await this.changeLessonStatus({
          courseIds:[row.courseId],
          isenable:this.status
        })
          this.getTableData(this.pageNum, this.pageSize);
      },
      carouselMapEdit(index, row) {
        this.$router.push({path: `/page/lesson/add`, query: {courseId: row.courseId}})
      },
     async downData(){
         this.$confirm('是否下载该课表？')
          .then(async () => {
            const {code} = await this.downLessonData({
              ...this.searchForm
            });
            if (code === '200') {
              this.$message.success("下载成功!");
              this.getTableData(this.pageNum, this.pageSize);
            } else {
              this.$message.error("下载失败,请联系开发人员检查!");
            }
          })
          .catch(() => {
            this.$message("操作已取消");
          });
      },
      carouselMapInvalid(index, row) {
        this.$confirm('确认删除该课程？')
          .then(async () => {
            const {code} = await this.deleteLesson({
              courseIds: [row.courseId],
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
      pageSizeChange(size) {
        this.pageSize = size;
        this.getTableData(this.pageNum, this.pageSize);
      },
      pageNumChange(num) {
        this.pageNum = num;
        this.getTableData(this.pageNum, this.pageSize);
      },


    },
    computed: {
      ...mapState("lesson", {
        tableData: state => state.lessonList.list||[],
        tableTotal: state => state.lessonList.total|| 0
      }),
      ...mapState("common", {
        schoolData: state => state.schoolList||[],
      }),
      ...mapState("platform", {
        appPages: s => s.appPages
      }),
      pageSizeOption: _ => [10, 20, 30, 40],
    },
    async created() {
     await this.getTableData(this.pageNum, this.pageSize);

        if(getBool()){
          this.disabled=true;
        }
    }
  }
</script>

<style scoped lang="scss">
  #CarouselMapList {
    .c-form-pagination {
      text-align: center;
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
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
  .el-range-separator{
    display: flex;
    align-items: center;
  }
  }
</style>
