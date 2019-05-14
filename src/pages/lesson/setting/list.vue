<template>
  <div id="CarouselMapList">
     <header-bar legend="报条件设置列表">
      <div slot="left">
        <el-button type="primary" size="small" style="margin-left: 20px" @click="$pushRoute('/page/lesson/setting/add')">
          添加设置
        </el-button>
      </div>
                 <selectSchool :disabled='disabled' ></selectSchool>  

      <el-button type="success" @click="getTableData(1,10)" size="small" :disabled='disabled' style="width: 80px;margin-left: 20px">搜索
      </el-button>
    </header-bar>
    <body-container :style="{minHeight:0}">
      <el-table
        stripe
        ref="multipleTable"
        :data="allLessonList"
        tooltip-effect="dark"
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
              <el-table-column
          label="学校名称"
          align="center"
        >
        <template  slot-scope="scope">
            {{scope.row.schoolName?scope.row.schoolName:'暂无信息'}}
          </template>
        </el-table-column>
        <el-table-column
          label="课程名"
          align="center"
        >
          <template  slot-scope="scope">
            {{scope.row.courseName?scope.row.courseName:'暂无信息'}}
          </template>
        </el-table-column>
  
        <el-table-column
          prop="registstartTime"
          label="开始时间"
          align="center"
          :formatter="formatterGenerator('dateTime')"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="registendTime"
          label="结束时间"
          align="center"
          :formatter="formatterGenerator('dateTime')"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="startAge"
          label="最小年龄"
          align="center"
          :formatter="formatterGenerator('dateTime')"
          show-overflow-tooltip>
          <template  slot-scope="scope">
            {{scope.row.startAge?scope.row.startAge+'岁':'暂无信息'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="coursePrice"
          label="最大年龄"
          align="center"
          show-overflow-tooltip>
          <template  slot-scope="scope">
            {{scope.row.endAge?scope.row.endAge+'岁':'暂无信息'}}
          </template>
        </el-table-column>
          <el-table-column
          prop="coursePrice"
          label="学员类别"
          align="center"
          show-overflow-tooltip>
          <template  slot-scope="scope">
            {{scope.row.registCategoryOne}} {{scope.row.registCategoryTwo}} {{scope.row.registCategoryThree}}
             {{scope.row.registCategoryFive}}  {{scope.row.registCategoryFour}} {{scope.row.registCategorySix}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.invalid?`danger`:`success`">{{scope.row.invalid?`失效`:`正常`}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="快捷操作"
                         width="200"
                         align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
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
        <el-pagination
          @size-change="pageSizeChange"
          @current-change="pageNumChange"
          :current-page.sync="pageNum"
          :page-sizes="pageSizeOption"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="allLessonListTotal">
        </el-pagination>
      </div>
    </body-container >
    <header-bar legend="报条件设置列表">
      <div slot="left">
         <el-button :type="all?'primary':'info'" size="small" style="margin-left: 20px" @click="selectAll(1)">
          全部
        </el-button>
        <el-button :type="!all?'primary':'info'" size="small" style="margin-left: 20px" @click="selectAll(0)">
          特别设置
        </el-button>
      </div>
                 <selectSchool :disabled='disabled' ></selectSchool>  

      <el-button type="success" @click="getTableData(1,10)" size="small" :disabled='disabled' style="width: 80px;margin-left: 20px">搜索
      </el-button>
    </header-bar>
    <body-container :style="{minHeight:0}">
      <el-table
        stripe
        ref="multipleTable"
        :data="specialLessonList"
        tooltip-effect="dark"
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
              <el-table-column
          label="学校名称"
          align="center"
        >
        <template  slot-scope="scope">
            {{scope.row.schoolName?scope.row.schoolName:'暂无信息'}}
          </template>
        </el-table-column>
        <el-table-column
          label="课程名"
          align="center"
        >
          <template  slot-scope="scope">
            {{scope.row.courseName?scope.row.courseName:'暂无信息'}}
          </template>
        </el-table-column>
  
        <el-table-column
          prop="registstartTime"
          label="开始时间"
          align="center"
          :formatter="formatterGenerator('dateTime')"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="registendTime"
          label="结束时间"
          align="center"
          :formatter="formatterGenerator('dateTime')"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="startAge"
          label="最小年龄"
          align="center"
          :formatter="formatterGenerator('dateTime')"
          show-overflow-tooltip>
          <template  slot-scope="scope">
            {{scope.row.startAge?scope.row.startAge+'岁':'暂无信息'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="coursePrice"
          label="最大年龄"
          align="center"
          show-overflow-tooltip>
          <template  slot-scope="scope">
            {{scope.row.endAge?scope.row.endAge+'岁':'暂无信息'}}
          </template>
        </el-table-column>
          <el-table-column
          prop="coursePrice"
          label="学员类别"
          align="center"
          show-overflow-tooltip>
          <template  slot-scope="scope">
            {{scope.row.registCategoryOne}} {{scope.row.registCategoryTwo}} {{scope.row.registCategoryThree}}
             {{scope.row.registCategoryFive}}  {{scope.row.registCategoryFour}} {{scope.row.registCategorySix}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.invalid?`danger`:`success`">{{scope.row.invalid?`失效`:`正常`}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="快捷操作"
                         width="200"
                         align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="carouselMapEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="carouselMapInvalid(scope.$index, scope.row)">{{all?'删除':'移除'}}
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
          :total="specialLessonListTotal">
        </el-pagination>
      </div>
    </body-container>

  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../../components/header-bar";
  import BodyContainer from "../../../components/body-container";
  import {excludeEmpty,getTrue,getBool} from "../../../utils";
  import RegionSelect from "../../../components/region-select";
  import selectSchool from "../../../components/select-school";
  import _ from 'lodash'

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
        all:true,
        pieChart: null,
        barChart: null,
        disabled:false,
        //根据是否失效来切换按钮
        featureBtnState: 0,
        //默认搜索条件
        searchForm: {
          schoolId: null,
        },
      }
    },
    methods: {
      showBigPicture(url) {
        this.imageDialogImageUrl = url;
        this.imageDialogVisible = true;
      },
      ...mapActions("lesson", ['getLessonSettingList','deleteLessonSetting','showSpecial','removeLesson']),
      ...mapActions('common',['getSchoolList']),
      isPriceReduction(specifications) {
        return specifications.some((s) => s["isPriceReduction"]);
      },
      async getTableData(pageNum, pageSize) {
        this.searchForm=excludeEmpty(this.searchForm)
        this.loading = true;
        const res = await this.getLessonSettingList({
          ...this.searchForm,
          pageNum,
          pageSize,
           schoolId:localStorage.getItem('schoolId')||'2'
        });
        this.loading = false;
        return res;
      },
      selectAll(type){
        if(type===1){
          this.all=true
          this.getTableData(1,10)
        }else{
          this.all=false
          this.getSpecialData(1,10)
        }
      },
      carouselMapEdit(index, row) {
        this.$router.push({path: `/page/lesson/setting/add`, query: {id: row.id}})
      },
      carouselMapInvalid(index, row) {
        if(this.all){
          this.$confirm('确认删除该设置？')
          .then(async () => {
            //如果row有值就是表格中的按钮 否则就是下面的工具栏
            const {code} = await this.deleteLessonSetting({
              id: row.id,
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
        }else{
            this.$confirm('确认移除该设置？')
          .then(async () => {
            //如果row有值就是表格中的按钮 否则就是下面的工具栏
            const {code} = await this.removeLesson({
              id: row.id,
            });
            if (code === '200') {
              this.$message.success("移除成功!");
              this.getTableData(this.pageNum, this.pageSize);
            } else {
              this.$message.error("移除失败,请联系开发人员检查!");
            }
          })
          .catch(() => {
            this.$message("操作已取消");
          });
        }
        
      },
      pageSizeChange(size) {
        this.pageSize = size;
        this.getTableData(this.pageNum, this.pageSize);
      },
      pageNumChange(num) {
        this.pageNum = num;
        this.getTableData(this.pageNum, this.pageSize);
      },
      //
    //  async getSpecialData(){
    //      this.searchForm=excludeEmpty(this.searchForm)
    //     this.loading = true;
    //     const res = await this.showSpecial({
    //       ...this.searchForm,
    //       pageNum,
    //       pageSize,
    //        schoolId:localStorage.getItem('schoolId')||'2'
    //     });
    //     this.loading = false;
    //     return res;
    //   }


    },
    computed: {
      ...mapState("lesson", {
        tableData: state => state.lessonSettingList.results||[],
        tableTotal: state => state.lessonSettingList.total|| 0,
        specialList:state=>state.lessonSpecialList.results||[],
        specialTotal:state=>state.lessonSpecialList.total||0
      }),
      ...mapState("common", {
        schoolData: state => state.schoolList||[],
      }),
      ...mapState("platform", {
        appPages: s => s.appPages
      }),
       allLessonList(){
        return _.compact(this.tableData.map(item=>{
          if(item.courseId===0){
            return item
          }
        }))
      },
       allLessonListTotal(){
          return this.allLessonList.length
        },
      specialLessonList(){
        return _.compact(this.tableData.map(item=>{
          console.log(this.all)
          if(this.all){
           if(item.courseId!==0){
            return item
          }
          }else{
            if(item.registPriority==='1'){
              return item
            }
          }
        
        }))
      },
       specialLessonListTotal(){
          return this.specialLessonList.length
        },
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
    }
    .sImg{
      width: 34px;
      height: 34px;
    }
  }
</style>
