<template>
  <div id="MerchantList">
    <header-bar legend="商家列表">
      <div slot="left">
        <el-button type="primary" size="small" style="margin-left: 20px" @click="$pushRoute('add')">
          添加商家
        </el-button>
      </div>
        <el-input v-model="namePhone" placeholder="请输入姓名或电话" class="srechInput"></el-input>
      <el-button type="success" size="small" style="width: 80px;margin-left: 20px">搜索</el-button>
      <el-button type="primary" size="small" style="width: 80px;margin-left: 20px">导出</el-button>
    </header-bar>
    <body-container>
      <el-table
        stripe
        ref="multipleTable"
        :data="formatTableData"
        tooltip-effect="dark"
        v-loading="loading"
        border
        height="600px"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
         <el-table-column label="名称" align="center" width="250">
          <template slot-scope="scope">{{ scope.row.customer.customerCertification.companyName }}</template>
        </el-table-column>
        <el-table-column label="入住时间" align="center" width="150">
          <template slot-scope="scope">{{ scope.row.customer.customerCertification.createTime?scope.row.customer.customerCertification.createTime.split('T')[0]:'' }}</template>
        </el-table-column>
        <el-table-column prop="name" label="到期时间" align="center" width="150">
          <template slot-scope="scope">{{ scope.row.customer.customerCertification.invalidDate?scope.row.customer.customerCertification.invalidDate.split('T')[0]:'' }}</template>
        </el-table-column>
        <el-table-column prop="date" label="联系人" align="center" >
          <template slot-scope="scope">{{ scope.row.customer.customerCertification.name?scope.row.customer.customerCertification.name:'' }}</template>
        </el-table-column>
        <el-table-column prop="address" label="电话" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.customer.customerCertification.phone }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-show="!scope.row.invalid"
              @click="View_record(scope.$index, scope.row)"
            >查看</el-button>
            <el-button
              size="mini"
              type="danger"
              v-show="!scope.row.invalid"
              @click="productDeleteOrInvalid(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../../components/header-bar";
  import {excludeEmpty} from "../../../utils";
  import BodyContainer from "../../../components/body-container";

  export default {
    name: "distributor",
    components: {BodyContainer, HeaderBar},
    data() {
      return {
         namePhone:null,
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
          invalid: 0,
          appPageId: null,
          selectedAddress: [],
          name:null,
          phone:null,
        },
      }
    },
    methods: {
      sortChange(a){
        console.log(a)
        console.log(2)
      },
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
      ...mapActions("merchant/business", ['getCompanyListByPage']),
      async getTableData(pageNum, pageSize) {
        this.loading = true;
        this.loading = true;
         if(/^1\d{10}$/.test(this.namePhone)){
          this.searchForm.name=null;
          this.searchForm.phone=this.namePhone;
        }else{
          this.searchForm.name=this.namePhone;
          this.searchForm.phone=null;
        }
        const form = {...this.searchForm, city: this.searchForm.selectedAddress[1]};
        const condition = excludeEmpty(form);
        const res = await this.getCompanyListByPage({
          pageNum,
          pageSize,
          ...condition,
        });
        this.loading = false;
        return res;
      },
      //删除
      productDeleteOrInvalid(index,row){
        console.log(row)
        this.$confirm('确认删除这条记录？')
          .then(async _ => {
            //如果row有值就是表格中的按钮 否则就是下面的工具栏
            const {code} = await this.deleteConsumer({
              id: row.customer.customerCertification.id
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
      View_record(index,row){
        this.$pushRoute(`add?${row.id}`)
      },
      pageSizeChange(size) {
        this.pageSize = size;
        this.getTableData(this.pageNum, this.pageSize);
      },
      pageNumChange(num) {
        this.pageNum = num;
        this.getTableData(this.pageNum, this.pageSize);
      }
    },
    computed: {
      ...mapState("merchant/business", {
        tableData: state => state.tableDataList.rows || [],
        tableDataTotal: state => state.tableDataList.count,
      }),
       formatTableData() {
         console.log(this.tableData)
           if(!this.tableData[0]){
               return []
           }
        return this.tableData.map((item) => ({
          ...item,
          customerCertification: item.customerCertification || {}
        }))
      },
    },
    async created() {
       this.getTableData(this.pageNum, this.pageSize);
    }
  }
</script>

<style scoped lang="scss">
#MerchantList {
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
   .srechInput{
    float: left;
    width: 200px;
    height: 34px;
  }
  .srechInput /deep/ input{
    height: 34px;
  }
}
</style>
