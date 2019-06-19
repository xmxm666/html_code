<template>
  <div id="List">
    <header-bar legend="投稿列表">
      <div slot="left">
        
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
          label="ID"
          align="center"
          prop="cid"
          show-overflow-tooltip
          width="120">
        </el-table-column>
        <el-table-column
          label="请求人"
          align="center"
          prop="userName"
          show-overflow-tooltip
          width="120">
        </el-table-column>
        <el-table-column
          prop="image"
          label="封面"
          align="center"
          :formatter="formatterGenerator('dateTime')"
          show-overflow-tooltip>
          <template slot-scope="scope" style="{width:150px;height:50px;}">
            <div style="{width:150px;height:50px;}">
              <img-wrapper v-show="scope.row.image!=null" size="medium" :src='"http://prxopj1oi.bkt.clouddn.com/"+scope.row.image' style="{width:50px;height:50px;}"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="标题"
          align="center"
          prop="title"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="正文"
          align="center"
          prop="content"
          show-overflow-tooltip
         >
        </el-table-column>
           <el-table-column
          label="时间"
          align="center"
          prop="createtime"
          show-overflow-tooltip
          >
        </el-table-column>
        </el-table-column>
           <el-table-column
          label="栏目类型"
          align="center"
          prop="typeName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="审核状态"
          align="center">
          <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.checkin*1===0?`success`:scope.row.checkin*1===1?'info':'danger'">
              {{scope.row.checkin==0?`已通过`:(scope.row.checkin==1)?'待审核':'已拒绝'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="快捷操作"
                          width="300"
                          align="right"
                         >
          <template slot-scope="scope">
               <el-button
              size="mini"
              type="success"
              v-if="scope.row.checkin*1===1"
              @click="passStatus(scope.$index, scope.row,{type:0})">通过
            </el-button>
               <el-button
              size="mini"
              type="danger"
              v-if="scope.row.checkin*1===1"
              @click="passStatus(scope.$index, scope.row,{type:2})">拒绝
            </el-button>
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
  import imgWrapper from "../../../components/img-wrapper";

  export default {
    name: "List",
    components: {RegionSelect, BodyContainer, HeaderBar,selectSchool,imgWrapper},
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
      ...mapActions("student", ['getContributeList','passStudentContribute','deleteStudentUp']),

      async getTableData(pageNum, pageSize) {
        this.loading = true;
        const res = await this.getContributeList({
          ...this.searchForm,
          pageNum,
          pageSize,
          schoolId:localStorage.getItem('schoolId')
        });
        this.loading = false;
        return res;
      },
      tableDataEdit(index, row) {
        this.$router.push({path: `/student/submission/add`, query: {id: row.cid}})
      },
      tableDataInvalid(index, row) {
        this.$confirm('确认删除该投稿？',{
          confirmButtonText: '通过',
          cancelButtonText: '再想想'
        }).then(async () => {
            //如果row有值就是表格中的按钮 否则就是下面的工具栏
            const {code} = await this.deleteStudentUp({cid:row.cid});
            if (code == 200) {
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
      passStatus(index,row,type){
        console.log(type.type)
        console.log(type==0)
        if(type.type==2){
          this.$prompt('请输入拒绝理由',{
            confirmButtonText: '拒绝',
            cancelButtonText: '再想想'
          }).then(async ({ value }) => {
            const {data,code,msg} = await this.passStudentContribute({cid:row.cid,rejectReason:value,checkin:2})
            if(code==='200'){
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.getTableData(this.pageNum, this.pageSize);
            }else this.$message.error("更改状态失败,请联系开发人员检查!");            
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            }); 
          });      
        }else if(type.type==0){
          this.$confirm('是否通过该投稿?', {
            confirmButtonText: '通过',
            cancelButtonText: '再想想'
          }).then(async () => {
            const {data,code,msg} = await this.passStudentContribute({...row,checkin:0})
            if(code==='200'){
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.getTableData(this.pageNum, this.pageSize);
            }else this.$message.error("更改状态失败,请联系开发人员检查!");
          }).catch(() => {
            console.log(111)
            this.$message({
              type: 'info',
              message: '操作取消'
            });          
          });
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
        tableData: state => state.tableDataList.list||[],
        tableTotal: state => state.tableDataList.total|| 0
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
