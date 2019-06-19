<template>
  <div id="List">
    <header-bar legend="教材列表">
      <div slot="left">
        <el-button type="primary" size="small"  style="margin-left: 20px" @click="$pushRoute('/shop/teaching/add')">
          上架新教材
        </el-button>
      </div>
      <el-input
        placeholder="请输入作者"
        prefix-icon="el-icon-search"
        v-model="searchForm.booksAuthor"
        style="margin-right:10px">
      </el-input>
      <el-input
        placeholder="请输入教材编号"
        prefix-icon="el-icon-search"
        v-model="searchForm.booksSn"
        style="margin-right:10px">
      </el-input>
      <el-select size="small" v-model="searchForm.isOnSale" placeholder="请选择是否上架" style="margin-right:10px">
            <el-option label="已上架" :value="1"></el-option>
            <el-option label="未上架" :value="2"></el-option>
          </el-select>
      <selectSchool :disabled='disabled' style="margin-right:20px"></selectSchool>    
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
          label="学校名称"
          align="center"
          prop="schoolName"
          width="180"
          show-overflow-tooltip
         >
        </el-table-column>
        <el-table-column
          label="主分类"
          align="center"
          prop="catId"
          show-overflow-tooltip
          width="120">
          <template slot-scope="scope">
            {{scope.row.catId==1?'教材购买':(scope.row.catId==2)?'辅助教材':''}}
          </template>
        </el-table-column>
           <el-table-column
          label="次分类"
          align="center"
          prop="extendCatId"
          width="80"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            {{scope.row.extendCatId==1?'文史':(scope.row.extendCatId==2)?'音体':(scope.row.extendCatId==3)?'理工':(scope.row.extendCatId==4)?'综合':(scope.row.extendCatId==5)?'内部讲义':''}}
          </template>
        </el-table-column>
        <el-table-column
          label="商品编号"
          align="center"
          prop="booksSn"
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
          prop="booksName"
          label="教材名称"
           align="center"
           width="150"
          >
        </el-table-column>
          <el-table-column
          prop="storeCount"
          label="库存"
           align="center"
           width="80"
          >
          <template slot-scope="scope">
            {{scope.row.storeCount}}件
          </template>
        </el-table-column>
        <el-table-column
          label="价格"
          align="center"
          prop="shopPrice"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            {{scope.row.shopPrice}}元
          </template>
        </el-table-column>
         <el-table-column
          label="上架时间"
          align="center"
          prop="updateTime"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="邮费"
          align="center"
          prop="sendPrice"
          width="80">
          <template slot-scope="scope">
            {{scope.row.sendPrice}}元
          </template>
        </el-table-column>
        <el-table-column
          label="是否上架"
          align="center">
          <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.isOnSale==1?`success`:`info`">{{scope.row.isOnSale==1?`已上架`:`待上架`}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="快捷操作" width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="upType(1, scope.row)" v-if="scope.row.isOnSale==2">上架</el-button>
            <el-button size="mini" type="warning" @click="upType(2, scope.row)" v-if="scope.row.isOnSale==1">下架</el-button>
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
        <div>
          <el-button type="success" @click="changeStatusMore(1)">一键上架</el-button>
          <el-button type="warning" @click="changeStatusMore(2)">一键下架</el-button>
        </div>
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
          schoolId:null,
          isOnSale:null,
          booksAuthor:null,
          booksSn:null
        },
      }
    },
    methods: {
      ...mapActions("common", ['getTeacherList','getSchoolList']), 
      ...mapActions("shop", ['textbooklist','DeleteTextbook','selectType','AllselectType']),

      async getTableData(pageNum, pageSize) {
        this.loading = true;
        this.searchForm.schoolId = (localStorage.getItem('schoolId')=='null')? '':localStorage.getItem('schoolId')
        //this.searchForm=excludeEmpty(this.searchForm)
        const res = await this.textbooklist({
          ...this.searchForm,
          pageNum,
          pageSize
        });
        console.log(res)
        this.loading = false;
        return res;
      },
      tableDataEdit(index, row) {
        this.$router.push({path: `add`, query: {id: row.id}})
      },
      tableDataInvalid(index, row) {
        this.$confirm('确认删除该教材？')
          .then(async _ => {
            console.log(111)
            //如果row有值就是表格中的按钮 否则就是下面的工具栏
            const {code} = await this.DeleteTextbook({
              id: row.id
            });
            if (code == 200) {
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
      async changeStatusMore(type){
        //  if(this.$refs.multipleTable.selection.length===0){
        //       this.$message.error("你没有选择任何课程!");
        //       return false
        // }
        const {code} = await this.AllselectType({
          // id:this.$refs.multipleTable.selection.map(item=>{ return item.id }),
          isOnSale:type
        })
        if (code == 200) {
          this.$message.success("操作成功!");
          this.getTableData(this.pageNum, this.pageSize);
        } else {
          this.$message.error("操作失败,请联系开发人员检查!");
        }
      },
      async upType(type,row){
        const {code} = await this.selectType({
          id:row.id,
          isOnSale:type
        })
        if (code == 200) {
          this.$message.success("操作成功!");
          this.getTableData(this.pageNum, this.pageSize);
        } else {
          this.$message.error("操作失败,请联系开发人员检查!");
        }
      }
    },
    computed: {
      ...mapState("shop", {
        tableData: state => state.textbookList.results||[],
        tableTotal: state => state.textbookList.total|| 0
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
      display: flex;
      justify-content: space-between;
    }
    .el-input{
      width: 200px !important;
    }
    .el-input--prefix /deep/ .el-input__inner{
      width: 200px;
      height: 34px;
    }
    .el-input--prefix /deep/ .el-input__icon{
      line-height: 34px;
    }
  }
</style>
