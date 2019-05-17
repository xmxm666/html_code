<template>
  <div id="List">
    <header-bar legend="投稿列表">
      <div slot="left">
        <el-button type="primary" size="small"  style="margin-left: 20px" @click="$pushRoute('/shop/teaching/add')">
          添加投稿
        </el-button>
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
          label="ID"
          align="center"
          prop="adminId"
          show-overflow-tooltip
          width="120">
        </el-table-column>
           <el-table-column
          label="类别"
          align="center"
          prop="schoolName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="教材名"
          align="center"
          prop="booksName"
          show-overflow-tooltip
         >
        </el-table-column>
           <el-table-column
          label="作者"
          align="center"
          prop="booksAuthor"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          prop="shopPrice"
          label="价格"
           align="center"
          >
        </el-table-column>
          <el-table-column
          prop="storeCount"
          label="库存"
           align="center"
          >
        </el-table-column>
        <el-table-column
          label="学校"
          align="center"
          prop="schoolName"
          show-overflow-tooltip
          >
        </el-table-column>
         <el-table-column
          label="上架时间"
          align="center"
          prop="onTime"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="是否上架"
          align="center">
          <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.status?`success`:`info`">{{scope.row.status?`上架`:`待上架`}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否包邮"
          align="center">
          <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.status?`success`:`info`">{{scope.row.status?`包邮`:`不包邮`}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="快捷操作"
                          width="200"
                         align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="tableDataEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="tableDataInvalid(scope.$index, scope.row)">删除
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
    <el-dialog :visible.sync="imageDialogVisible">
      <img width="100%" :src="imageDialogImageUrl" alt="我是一张图片">
    </el-dialog>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../../components/header-bar";
  import BodyContainer from "../../../components/body-container";
  import {excludeEmpty,getBool} from "../../../utils";
  import RegionSelect from "../../../components/region-select";
  import selectSchool from "../../../components/select-school";
  

  export default {
    name: "List",
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
        disabled:false,
        pageSize: 10,
        pieChart: null,
        barChart: null,
        //根据是否失效来切换按钮
        featureBtnState: 0,
        //默认搜索条件
        searchForm: {
          role:1,
        },
      }
    },
    methods: {
      ...mapActions("common", ['getTeacherList','getSchoolList']),
      ...mapActions("teacher", ['deleteTeacher']),

      async getTableData(pageNum, pageSize) {
        this.loading = true;
        const res = await this.getTeacherList({
          ...this.searchForm,
          pageNum,
          pageSize,
          schoolId:localStorage.getItem('schoolId')
        });
        this.loading = false;
        return res;
      },
      tableDataEdit(index, row) {
        this.$router.push({path: `/admin/add`, query: {id: row.adminId}})
      },
      tableDataInvalid(index, row) {
        this.$confirm('确认删除该管理员？')
          .then(async _ => {
            //如果row有值就是表格中的按钮 否则就是下面的工具栏
            const {code} = await this.deleteTeacher({
              adminId: row.adminId
            });
            if (+code === 200) {
              this.$message.success("删除成功!");
              this.getTableData(this.pageNum, this.pageSize);
            } else {
              this.$message.error("删除失败,请联系开发人员检查!");
            }
          })
          .catch(_ => {
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
      ...mapState("common", {
        tableData: state => state.teacherList.list||[],
        tableTotal: state => state.teacherList.total|| 0
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
          this.searchForm.schoolId=localStorage.getItem('schoolName');
        }
    }
  }
</script>

<style scoped lang="scss">
  #List {
    .c-form-pagination {
      text-align: center;
      margin-top: 30px;
    }
  }
</style>
