<template>
  <div id="List">
    <header-bar legend="认证中心">
      <el-input class="namePhone" style="width: 115px;height:32px;" placeholder="姓名/电话" v-model="searchForm.name" clearable></el-input>

      <el-select size="small" v-model="searchForm.status" placeholder="审核状态" >
        <el-option label="审核状态" :value="null" />
        <el-option label="已线下打款"  :value="3" />
        <el-option label="未审核" :value="2" />
        <el-option label="已通过" :value="1" />
        <el-option label="未通过" :value="0" />
      </el-select>

      <el-button type="success"  @click="getTableData(pageNum,pageSize)" size="small" style="width: 80px;margin-left: 20px" >搜索 </el-button>
    </header-bar>
    <body-container>
      <el-table  stripe @selection-change="handleSelectionChange" ref="multipleTable"  :data="tableData" tooltip-effect="dark"  border  v-loading="loading"  height="600px"  style="width: 100%"  >
        <el-table-column  type="selection" width="55"  >  </el-table-column>

        <el-table-column label="ID" align="center"  type="index"  width="120"  >
          <template slot-scope="scope">
            <p>{{scope.row.id}}</p>
          </template>
        </el-table-column>

        <el-table-column label="提现人"  align="center"  width="130">
          <template slot-scope="scope">
            <p>{{scope.row.customer.customerInfo.name}}</p>
          </template>
        </el-table-column>


        <el-table-column label="电话" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{scope.row.customer.customerInfo.phone}}</p>
          </template>
        </el-table-column>

        <el-table-column label="金额" align="center" width="100" show-overflow-tooltip prop="fee"/>

        <el-table-column label="用户来源" align="center" width="160">
          <template slot-scope="scope">
            <!-- <p>{{scope.row.customerCertification.created_at.split('.')[0].split('T')[0]}}</p> -->
          </template>
        </el-table-column>

        <el-table-column  label="审核状态"  align="center">  
          <template slot-scope="scope">
            <el-tag  size="medium"  :type="scope.row.status?`success`:`danger`"  >
               {{scope.row.status?`已审核`:`待审核`}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="快捷操作"  align="center"  width="215">
          <template slot-scope="scope">
            <el-button  class='editBtn'  size="mini"  type="primary"  v-if="scope.row.status!=0"  @click="passCert(scope.$index, scope.row)"  >
              通过
            </el-button>

            <el-button class='editBtn' size="mini"  v-if="scope.row.status!=0"  type="danger"  @click="deleteCert(scope.$index, scope.row)"  >
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--  -->
      <div class="c-form-pagination">
        <el-pagination  @size-change="pageSizeChange"  @current-change="pageNumChange" :current-page.sync="pageNum" 
        :page-sizes="pageSizeOption"  :page-size="pageSize"  layout="total, sizes, prev, pager, next, jumper" :total="tableDataTotal">
        </el-pagination>
      </div>
      </body-container>
    <el-dialog :visible.sync="imageDialogVisible">
      <img width="100%" :src="imageDialogImageUrl" alt="我是一张图片">
    </el-dialog>
  </div>

</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import HeaderBar from "../../../components/header-bar";
import BodyContainer from "../../../components/body-container";
import { excludeEmpty } from "../../../utils";
import ImgUpload from "../../../components/img-upload";
import RegionSelect from "../../../components/region-select";

export default {
  name: "List",
  components: { RegionSelect, BodyContainer, HeaderBar, ImgUpload },
  data() {
    return {
      dialogComponeyVisible: false,
      dialogFormVisible: false,
      imageDialogVisible: false,
      imageDialogImageUrl: "",
      value: "",
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
        type: null,
        status: null,
        isPay: null,
        dateRange: null,
        name: null,
        phone: null
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    ...mapActions("finance/money", [
      "getWithDrawByPage",
      "passWithDraw",
      "rejectWithDraw"
    ]),
    async getTableData(pageNum, pageSize) {
      this.loading = true;
      const condition = excludeEmpty(this.searchForm);
      const res = await this.getWithDrawByPage({
        pageNum,
        pageSize,
        ...condition
      });
      this.loading = false;
      return res;
    },

    //通过审核
    async passCert(index, row) {
      this.loading = true;
      const {code,msg}= await this.passWithDraw({ id: row.id });
      this.loading = false;
      if(code==200){
          this.$message.success("审核通过");
      }else{
          this.$message.warning(msg);
      }
      
      this.getTableData(1, 10);
    },
    //拒绝提现
    async deleteCert(index, row) {
      this.loading = true;
     const {code,msg} = await this.rejectWithDraw({ id: row.id });
      this.loading = false;
      if(code==200){
        this.$message.success("审核已拒绝");
      }else{
          this.$message.warning(msg);
      }
      this.getTableData(1, 10);
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.getTableData(this.pageNum, this.pageSize);
    },
    pageNumChange(num) {
      this.pageNum = num;
      this.getTableData(this.pageNum, this.pageSize);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    }
  },
  computed: {
    ...mapState("finance/money", {
      tableData: state => state.tableDataList.rows,
      tableDataTotal: state => state.tableDataList.count
    }),
    pageSizeOption: _ => [10, 20, 30, 40]
  },
  async created() {
    this.getTableData(this.pageNum, this.pageSize);
    console.log(this.tableData)
  }
};
</script>

<style scoped lang="scss">
#List /deep/ .el-input__inner {
  width: 120px;
}
#List {
  .c-form-pagination {
    text-align: center;
    margin-top: 30px;
  }
  .namePhone.el-input.el-input--suffix /deep/ input {
    height: 32px;
  }

  .editBtn {
    float: left;
  }
  .idCardBox {
    width: 50%;
    float: left;
  }
  .changeInfoBox /deep/ input {
    width: 90%;
  }
  .block {
    float: left;
    margin-right: 5px;
    margin-left: 0;
  }
  .namePhone {
    float: left;
    margin-right: 10px;
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
