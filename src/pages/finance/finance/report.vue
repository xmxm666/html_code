<template>
  <div id="LIST">
    <header-bar legend="财务报表">
      <div slot="left">
        <el-button :type="time==0?'primary':'info'" size="small" style="margin-left: 20px" @click="changeTime(0)">
          日报表
        </el-button>
         <el-button :type="time==0?'info':'primary'" size="small" style="margin-left: 20px" @click="changeTime(1)">
          月报表
        </el-button>
      </div>
      <div class="block">
        <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>
      <el-button type="success" size="small" style="width: 80px;margin-left: 20px">搜索</el-button>
    </header-bar>
    <body-container>
      <el-table
        stripe
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        v-loading="loading"
        border
        height="600px"
        style="width: 100%"
      >
      <!--日期  -->
        <el-table-column label="日期" align="center" >
          <template slot-scope="scope">
           <p v-if="scope.row.beginDay">{{ scope.row.beginDay.split(' ')[0]}}</p> 
           <p v-else>{{ scope.row.beginMonth.split(' ')[0].split('-')[0]+'-'+scope.row.beginMonth.split(' ')[0].split('-')[1]}}</p> 
          </template>
          

        </el-table-column>
        <!--总营业额-->
        <el-table-column label="总营业额" align="center" >
          <template slot-scope="scope">{{ scope.row.totalIncome }}</template>
        </el-table-column>
        <!--应该支出  -->
        <el-table-column prop="name" label="应该支出" align="center">
          <template slot-scope="scope">{{ scope.row.totalIncome }}</template>
        </el-table-column>
        <!--实际支出  -->
        <el-table-column prop="date" label="实际支出" align="center" >
          <template slot-scope="scope">{{ scope.row.totalIncome }}</template>
        </el-table-column>
        <!-- 盈利 -->
        <el-table-column prop="address" label="盈利" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.totalProfit }}</template>
        </el-table-column>
        <!--操作  -->
        <el-table-column label="操作" align="center" width="260">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-show="!scope.row.invalid"
              @click="View_record(scope.$index, scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--  -->
      <el-row class="pagination-block">
        <el-col :lg="12" :md="12" :xs="12" :sm="12" class="table-toolbar">
          <el-button-group>
            <el-button icon="el-icon-edit" @click="$router.push({path:'/product/add'})"></el-button>
            <el-button icon="el-icon-edit-outline" @click="productEdit"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="productDelete"></el-button>
          </el-button-group>
        </el-col>
        <el-col :lg="12" :md="12" :xs="12" :sm="12">
          <el-pagination
            @size-change="pageSizeChange"
            @current-change="pageNumChange"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableDataTotal"
            @prev-click='prevPage'
            @next-click='nextPage'
          ></el-pagination>
        </el-col>
      </el-row>
    </body-container>
    <!-- 财务信息详情 -->
    <el-dialog
    title="财务详情"
    :visible.sync="dialogVisible"
    width="30%"
    >
    <el-table :data="formatTableData" style="width: 100%">
      <el-table-column prop="totalIncome" label="总收入" width="180">

      </el-table-column>
      <el-table-column
        prop="totalExpenditure"
        label="总支出"
        width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型">
      </el-table-column>
    </el-table>
  </el-dialog>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../../components/header-bar";
  import {excludeEmpty,convertUTCTimeToLocalTime} from "../../../utils";
  import BodyContainer from "../../../components/body-container";

  export default {
    name: "LIST",
    components: {BodyContainer, HeaderBar},
    data() {
      return {
        detail:null,
        dialogVisible:false,
        loading:false,
        pageNum:1,
        pageSize:10,
        value: '',
        multipleSelection: [],
        //举报详情信息
        reportDetails:{
          content:null,
          certificatePictures:[]
        },
        //搜索条件
        searchForm: {
          time:[]
        },
        
        time:0,
      }
    },
    methods: {
      //上下页
      prevPage(){
        this.pageNum--;
        this.getTableData(this.pageNum, this.pageSize);

      },
      nextPage(){
        this.pageNum++
        this.getTableData(this.pageNum, this.pageSize);
      },
      productEdit(){},
      productDelete(){},
      ...mapActions("finance/money", ['getFinancialDailyReport','getFinancialMonthReport','getFinancialReportByDateRange']),
      //请求数据列表
      async getTableData(pageNum, pageSize) {
        this.loading = true;
        if(this.time==0){
          const res = await this.getFinancialDailyReport({
          pageNum,
          pageSize,
          ...this.searchForm
        });
        this.loading = false;
        return res;
        }else{
           const res = await this.getFinancialMonthReport({
          pageNum,
          pageSize,
        });
         this.loading = false;
        return res;
        }
        
        
        
      },
      //删除
      productDeleteOrInvalid(index,row){
        this.$confirm('确认删除这条记录？')
          .then(async _ => {
            //如果row有值就是表格中的按钮 否则就是下面的工具栏
            const {code} = await this.deleteRepostCustomer({
              id: row.id
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
      //查看
     async View_record(index,row){
        await this.getFinancialReportByDateRange({
          beginDate:row.beginDay||row.beginMonth,
          endDate:row.endDay||row.endMonth,
        })
        this.dialogVisible=true;
      },
      //翻页
      pageSizeChange(size) {
        this.pageSize = size;
        this.getTableData(this.pageNum, this.pageSize);
      },
      pageNumChange(num) {
        this.pageNum = num;
        this.getTableData(this.pageNum, this.pageSize);
      },
      //日月切换
      changeTime(val){
        this.time=val;
        this.getTableData(this.pageNum, this.pageSize);
      },
      getType(type){
            switch(type){
          case 0:
              return '商家认证'
          case 1:
            return '企业认证'
          case 2:
            return '查看简历'
          case 3:
            return '简历发布'
          case 4:
            return '招聘发布'
          case 5:
            return '简历刷新'
          default:
              return '其他'
          }
        },
    },
    computed: {
      ...mapState("finance/money", {
        tableData: state => state.dailyDataList.rows || [],
        tableDataTotal: state => state.dailyDataList.count,
        detailtableData: state => state.detailDataList || [],
        detailtableDataTotal: state => state.detailDataList.count,
      }),
       formatTableData() {
        return  this.detailtableData.map((item) => ({
            ...item,
          totalIncome:item.totalIncome+'元',
          totalExpenditure:item.totalExpenditure+'元',
          type:this.getType(item.type)
          }))
      },
    },
    async created() {
       this.getTableData(this.pageNum, this.pageSize);
    }
  }
</script>

<style scoped lang="scss">
#LIST {
  .c-form-pagination {
    text-align: center;
    margin-top: 30px;
  }
  .pagination-block {
    padding: 20px 0;
    text-align: center;
    .table-toolbar {
      text-align: left;
      padding-left: 20px;
    }
  }
  .evidence {
    width: 100px;
    height: 60px;
  }
  .evidence_box{
  }
  .reportPictures{
    float: left;
    padding: 10px;
  }
  .block {
    float: left;
    margin-right: 5px;
    margin-left: 0;
  }
  .block
    /deep/
    .el-date-editor.el-range-editor.el-input__inner.el-date-editor--daterange {
    height: 32px;
    width: 353px;
  }
  .block /deep/ .el-range-separator {
    line-height: 24px;
  }
}
</style>
