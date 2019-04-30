<template>
  <div id="List">
    <header-bar legend="学校列表">
        <div slot="left">
        <el-button type="primary" size="small" style="margin-left: 20px" @click="$pushRoute('/school/add')">
          添加学校
        </el-button>
      </div>
         <el-select size="small" v-model="searchForm.schoolId" placeholder="请选择学校">
        <el-option
          v-for="item in schoolData"
          :key="item.schoolId"
          :label="item.schoolName"
          :value="item.schoolId">
        </el-option>
      </el-select>
      <el-button type="success" @click="getTableData(1,10)" size="small" style="width: 80px;margin-left: 20px">搜索
      </el-button>
    </header-bar>
    <body-container>
      <el-table
        stripe
        ref="multipleTable"
        :data="formatTableData"
        tooltip-effect="dark"
        border
        v-loading="loading"
        height="600px"
        style="width: 100%">
        <el-table-column
          align="center"
          prop="schoolId"
          label="ID"
          width="80"/>
    
        <el-table-column
          label="学校名称"
          align="center"
          prop="schoolName"
          >
        </el-table-column>

        <el-table-column
          label="经度"
          align="center"
          >
           <template slot-scope="scope">
            {{scope.row.latitude}}
          </template>
        </el-table-column>
        <el-table-column
        
          label="纬度"
          align="center"
          
          >
          <template slot-scope="scope">
             {{scope.row.longitude}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
        
          align="center">
          <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.isUsing!==1?`danger`:`success`">{{scope.row.invalid?`冻结`:`正常`}}</el-tag>
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
            <el-button
              size="mini"
              :type="scope.row.invalid?`primary`:`info`"
              @click="tableDataUpData(scope.$index, scope.row)">{{scope.row.invalid?`启用`:`停用`}}
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
  import HeaderBar from "../../components/header-bar";
  import BodyContainer from "../../components/body-container";
  import {excludeEmpty} from "../../utils";
  import RegionSelect from "../../components/region-select";

  export default {
    name: "List",
    components: {RegionSelect, BodyContainer, HeaderBar},
    data() {
      return {
        dialogFormVisible:false,
        imageDialogVisible: false,
        imageDialogImageUrl: '',
        value: '',
        loading: false,
        pageNum: 1,
        pageSize: 10,
     
        //默认搜索条件
        searchForm: {
          appPageId: null,
          selectedAddress: [],
        },
      }
    },
    methods: {
      ...mapActions("common", ['getSchoolList', 'getTeacherList','updateUserMoney','freezeCustomer']),
      ...mapActions("school", ['deleteSchool']),

      async getTableData(pageNum, pageSize) {
        this.loading = true;
        const form = {...this.searchForm, city: this.searchForm.selectedAddress[1]};
        const condition = excludeEmpty(form);
        const res = await this.getSchoolList({
          pageNum,
          pageSize,
        });
        this.loading = false;
        return res;
      },
      //学校详情
      tableDataEdit(index, row) {
        this.$router.push({path: `/school/add`, query: {id: row.schoolId}})
      },
      //冻结/解冻学校
     async tableDataUpData(index,row){
      //  const {code} = await this.freezeCustomer({
      //         id: row.id
      //       });
      //   if (code == 200) {
      //     this.$message.success("冻结成功!");
      //     this.getTableData(this.pageNum, this.pageSize);
      //   } else {
      //     this.$message.error("冻结失败,请联系开发人员检查!");
      //   }
      },
      //删除学校
       tableDataInvalid(index, row) {
        this.$confirm('确认删除该学校？')
          .then( async () => {
            //如果row有值就是表格中的按钮 否则就是下面的工具栏
            const {code} = await this.deleteSchool({
              schoolId: row.schoolId
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
        tableData: state => state.schoolList.list || [],
        tableDataTotal: state => state.schoolList.total||0,
      }),
      formatTableData() {
        console.log(this.tableData)
        return this.tableData.map((item) => ({
          ...item,
          customerCertification: item.customerCertification || {}
        }))
      },
       ...mapState("common", {
        schoolData: state => state.schoolList.list||[],
      }),
      pageSizeOption: _ => [10, 20, 30, 40],
    },
    async created() {
      this.getTableData(this.pageNum, this.pageSize);
      if(this.schoolData){

      }else {
        await this.getSchoolList();
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
