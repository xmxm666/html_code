<template>
  <div id="List">
    <header-bar legend="添加缴费信息">
      <div slot="left">
        <el-button type="primary" size="small" style="margin-left: 20px" @click="$pushRoute('/trade/school/add')">
          添加缴费信息
        </el-button>
      </div>
        <selectSchool :disabled='disabled' ></selectSchool>  
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
        style="width: 500%">
        <el-table-column
          type="selection"
          >
        </el-table-column>
        <el-table-column
          align="center"
          prop="id"
          label="ID"
          width="80"/>
        <el-table-column
        show-overflow-tooltip
          label="学校名称"
          align="center"
          prop="schoolName"
        >
        </el-table-column>
        <el-table-column
        show-overflow-tooltip
          label="缴费地点"
          align="center"
          prop="paymentAddress"
        >
        </el-table-column>
        <el-table-column
          label="开始时间"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.paymentStarttime}}
          </template>
        </el-table-column>
         <el-table-column
          label="结束时间"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.paymentEndtime}}
          </template>
        </el-table-column>
        <el-table-column label="快捷操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="tableDataEdit(scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="tableDataInvalid(scope.row)">删除
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
          :total="tableDataTotal">
        </el-pagination>
      </div>
    </body-container>
    <!-- <el-dialog :visible.sync="imageDialogVisible">
      <img width="100%" :src="imageDialogImageUrl" alt="我是一张图片">
    </el-dialog> -->
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
        table:[],
        total:null,
        dialogFormVisible:false,
        imageDialogVisible: false,
        imageDialogImageUrl: '',
        value: '',
        disabled:false,
        loading: false,
        pageNum: 1,
        pageSize: 10,
        //默认搜索条件
        searchForm: {
          schoolId: null,
        },
      }
    },
    methods: {
      ...mapActions("trade", ['delActivity','getActivityList']),
      
      async getTableData(pageNum, pageSize) {
        this.loading = true;
        const res = await this.getActivityList({
          pageNum,
          pageSize,
          schoolId:(localStorage.getItem('schoolId')=='null')?'':localStorage.getItem('schoolId')
        })   
        this.loading = false;
      },
      //详情
      tableDataEdit(row) {
        this.$router.push({path: `/trade/school/add`, query: {id: row.id}})
      },
      //删除
      tableDataInvalid(row) {
        this.$confirm('确认删除该条活动？')
          .then(async () => {
            const {code} = await this.delActivity({
              id : row.id
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
      //一页多少个
      pageSizeChange(size) {
        this.pageSize = size;
        this.getTableData(this.pageNum, this.pageSize);
      },
      //第几页
      pageNumChange(num) {
        this.pageNum = num;
        this.getTableData(this.pageNum, this.pageSize);
      },
    },
    computed: {
      ...mapState("trade", {
        tableData: state => state.tableDataList.results||[],
        tableDataTotal: state => state.tableDataList.total||0,
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
  #List {
    .c-form-pagination {
      text-align: center;
      margin-top: 30px;
    }
    .balance{
      cursor: pointer;
    }
  }
</style>
