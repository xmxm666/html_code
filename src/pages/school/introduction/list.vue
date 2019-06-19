<template>
  <div id="List">
    <header-bar legend="校园介绍列表">
      <div slot="left">
        <el-button type="primary" size="small" style="margin-left: 20px" @click="$pushRoute('/school/legal/add')">
          添加校园介绍
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
        :data="table"
        tooltip-effect="dark"
        border
        v-loading="loading"
        height="600px"
        style="width: 100%">
        <el-table-column
          align="center"
          prop="id"
          label="ID"
          width="80"/>

        <el-table-column
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

          label="创建时间"
          align="center"

        >
          <template slot-scope="scope">
            {{scope.row.updatetime}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"

          align="center">
          <template slot-scope="scope">
           <el-tag size="medium" :type="scope.row.istop!=='1'?`success`:`success`">{{scope.row.istop!=='1'?`正常`:`置顶`}}</el-tag>
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
          :total="total">
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
      ...mapActions("common", ['getSchoolList', 'getTeacherList','updateUserMoney','freezeCustomer']),
      ...mapActions("school", ['deleteArticle','getSchoolNoticeList']),

      async getTableData(pageNum, pageSize) {
        this.loading = true;
        const res = await this.getSchoolNoticeList({
          pageNum,
          pageSize,
          type:'3',
          ...this.searchForm,
           schoolId:localStorage.getItem('schoolId')
        });
        this.table=res.data.list;
        this.total=res.data.total;
        this.loading = false;
      },
      //详情
      tableDataEdit(index, row) {
        this.$router.push({path: `/school/legal/add`, query: {id: row.id}})
      },
      //删除
      tableDataInvalid(index, row) {
        this.$confirm('确认删除该条通知？')
          .then( async () => {
            //如果row有值就是表格中的按钮 否则就是下面的工具栏
            const {code} = await this.deleteArticle({
              id: row.id
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
      ...mapState("common", {
        schoolData: state => state.schoolList||[],
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
