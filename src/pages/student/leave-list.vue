<template>
  <div id="CarouselMapList">
    <header-bar legend="请假列表">
      <div slot="left">

      </div>
      <selectSchool :disabled='disabled' ></selectSchool>  
      <el-button type="success" @click="getTableData(1,10)" :disabled='disabled' size="small" style="width: 80px;margin-left: 20px">搜索
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
          label="ID"
          align="center"
          prop="vacateId"
          width="100">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="vacateName"
          label="请假人"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="vacateCause"
          label="请假原因"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
          <el-table-column
          prop="vacateTime"
          label="请假时间"
          align="center"
          :formatter="formatterGenerator('dateTime')"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="contacts"
          label="联系人"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
         <el-table-column
          prop="contactsPhone"
          label="联系方式"
          align="center"
          show-overflow-tooltip>
        </el-table-column>


        <el-table-column
          label="请假类型"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.vacateTypeName?`danger`:`success`">{{scope.row.vacateTypeName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="快捷操作"
                         width="200"
                         align="center">
          <template slot-scope="scope">
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
  import HeaderBar from "../../components/header-bar";
  import BodyContainer from "../../components/body-container";
  import {excludeEmpty,getBool} from "../../utils";
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
        disabled:false,
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
      ...mapActions("student", ['getLeaveList','deleteLeave']),
      ...mapActions('common',['getSchoolList']),
      isPriceReduction(specifications) {
        return specifications.some((s) => s["isPriceReduction"]);
      },
      async getTableData(pageNum, pageSize) {
        this.searchForm=excludeEmpty(this.searchForm)
        this.loading = true;
        const res = await this.getLeaveList({
          ...this.searchForm,
          pageNum,
          pageSize,
          schoolId:localStorage.getItem('schoolId')
        });
        console.log()
        this.loading = false;
        return res;
      },
      carouselMapEdit(index, row) {
        this.$router.push({path: `/page/lesson/add`, query: {courseId: row.vacateId}})
      },
      carouselMapInvalid(index, row) {
        this.$confirm('确认删除该条记录？')
          .then(async () => {
            //如果row有值就是表格中的按钮 否则就是下面的工具栏
            const {code} = await this.deleteLeave({
              vacateId: row.vacateId,
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
      ...mapState("student", {
        tableData: state => state.leaveList.list||[],
        tableTotal: state => state.leaveList.total|| 0
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
      this.getTableData(this.pageNum, this.pageSize);
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
