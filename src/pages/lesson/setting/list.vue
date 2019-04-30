<template>
  <div id="CarouselMapList">
    <header-bar legend="课程设置列表">
      <div slot="left">
        <el-button type="primary" size="small" style="margin-left: 20px" @click="$pushRoute('/page/lesson/setting/add')">
          添加设置
        </el-button>
      </div>
      <el-select size="small" v-model="searchForm.schoolId" placeholder="请选择学校">
        <el-option
          v-for="item in schoolData"
          :key="item.schoolId"
          :label="item.schoolName"
          :value="item.schoolId">
        </el-option>
      </el-select>
      <el-button type="success" @click="getTableData(1,10)" size="small" style="width: 80px;margin-left: 20px">搜索
      </el-button>
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
          width="55">
        </el-table-column>
        <el-table-column
          label="课程ID"
          align="center"
          prop="courseId"
          width="100">
        </el-table-column>
        <el-table-column
          prop="schoolId"
          label="学校ID"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="registstartTime"
          label="开始时间"
          align="center"
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
            {{scope.row.startAge}}岁
          </template>
        </el-table-column>
        <el-table-column
          prop="coursePrice"
          label="最大年龄"
          align="center"
          show-overflow-tooltip>
          <template  slot-scope="scope">
            {{scope.row.endAge}}岁
          </template>
        </el-table-column>
          <el-table-column
          prop="coursePrice"
          label="报名条件"
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
          :total="tableTotal">
        </el-pagination>
      </div>
    </body-container>
  
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../../components/header-bar";
  import BodyContainer from "../../../components/body-container";
  import {excludeEmpty,getTrue} from "../../../utils";
  import RegionSelect from "../../../components/region-select";

  export default {
    name: "CarouselMapList",
    components: {RegionSelect, BodyContainer, HeaderBar},
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
      ...mapActions("lesson", ['getLessonSettingList','deleteLessonSetting']),
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
        });
        this.loading = false;
        return res;
      },
      carouselMapEdit(index, row) {
        this.$router.push({path: `/page/lesson/setting/add`, query: {id: row.id}})
      },
      carouselMapInvalid(index, row) {
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
        tableData: state => state.lessonSettingList.results||[],
        tableTotal: state => state.lessonSettingList.total|| 0
      }),
      ...mapState("common", {
        schoolData: state => state.schoolList.list||[],
      }),
      ...mapState("platform", {
        appPages: s => s.appPages
      }),
      pageSizeOption: _ => [10, 20, 30, 40],
    },
    async created() {
      this.getTableData(this.pageNum, this.pageSize);
    
        await this.getSchoolList();
      
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
