<template>
  <div id="List">
    <header-bar legend="活动列表">
      <div slot="left">
        <el-button type="primary" size="small" style="margin-left: 20px" @click="$pushRoute('/school/activity/add')">
          添加活动
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
        style="width: 100%">
        <el-table-column
          align="center"
          prop="activitiesId"
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
          label="标题"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.title}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="正文"
          align="center"

        >
          <template slot-scope="scope">
            {{scope.row.content}}
          </template>
        </el-table-column>
        <el-table-column

          label="开始时间"
          align="center"

        >
          <template slot-scope="scope">
            {{scope.row.startTime}}
          </template>
        </el-table-column>
         <el-table-column

          label="结束时间"
          align="center"

        >
          <template slot-scope="scope">
            {{scope.row.endTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"

          align="center">
          <template slot-scope="scope">
           <el-tag size="medium" :type="scope.row.type!=='1'?`success`:`success`">{{scope.row.type!=='1'?`本校活动`:`联盟活动`}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="快捷操作"

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
      ...mapActions("school", ['delActivity','getActivityList']),
      async getTableData(pageNum, pageSize) {
        this.loading = true;
        const res = await this.getActivityList({
          pageNum,
          pageSize,
          ...this.searchForm,
          //  schoolId:localStorage.getItem('schoolId')==='null'?null:schoolId
        });
       console.log(res)
        this.loading = false;
      },
      //详情
      tableDataEdit(index, row) {
        this.$router.push({path: `/school/activity/add`, query: {id: row.activitiesId}})
      },
      //删除
      tableDataInvalid(index, row) {
        this.$confirm('确认删除该条活动？')
          .then( async () => {
            //如果row有值就是表格中的按钮 否则就是下面的工具栏
            const {code} = await this.delActivity({
              activitiesId: row.activitiesId
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
      ...mapState("school", {
        tableData: state => state.tableDataList.list||[],
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
