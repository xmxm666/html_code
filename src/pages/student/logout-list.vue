<template>
  <div id="CarouselMapList">
    <header-bar legend="注销申请列表">
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
          prop="wid"
          width="100">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="请求人"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="school"
          label="请求学校"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="content"
          label="注销原因"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
         
        <el-table-column
          label="状态"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.checkin!==2?`info`:`danger`">{{scope.row.checkin!==2?`待审核`:`已拒绝`}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="快捷操作"
                         align="center">
          <template slot-scope="scope">
             <el-button
              size="mini"
              type="success"
              @click="passBtn(scope.$index, scope.row)">通过
            </el-button>
               <el-button
              size="mini"
              type="danger"
              @click="refuseBtn(scope.$index, scope.row)">拒绝
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
      ...mapActions("student", ['getLogoutList','passStudentLogout']),
      ...mapActions('common',['getSchoolList']),
      isPriceReduction(specifications) {
        return specifications.some((s) => s["isPriceReduction"]);
      },
      async getTableData(pageNum, pageSize) {
        this.searchForm=excludeEmpty(this.searchForm)
        this.loading = true;
        const res = await this.getLogoutList({
          ...this.searchForm,
          pageNum,
          pageSize,
           schoolId:localStorage.getItem('schoolId')
        });
        this.loading = false;
        return res;
      },
       async passBtn(index, row){
       const {code,msg} = await this.passStudentLogout({
          checkin:0,
          wid:row.wid,
          uid:row.uid,
          userItemId:row.userItemId
        })
        if(code==='200'){
           this.$message({
          message: '操作成功',
          type: 'success'
        });
          this.getTableData(this.pageNum, this.pageSize);
        }else{
          this.$message.error(msg);
        }
      },
      async refuseBtn(index, row){
       const {code,msg} = await this.passStudentLogout({
          checkin:2,
          wid:row.wid,
          uid:row.uid,
          userItemId:row.userItemId
        })
        if(code==='200'){
           this.$message({
          message: '操作成功',
          type: 'success'
        });
          this.getTableData(this.pageNum, this.pageSize);
        }else{
          this.$message.error(msg);
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


    },
    computed: {
      ...mapState("student", {
        tableData: state => state.logoutList.list||[],
        tableTotal: state => state.logoutList.total|| 0
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
     console.log(this.tableData)
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
