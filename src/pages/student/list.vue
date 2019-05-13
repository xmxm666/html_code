<template>
  <div id="CarouselMapList">
    <header-bar legend="学员列表">
      <div slot="left">
        <el-button type="primary" size="small" style="margin-left: 20px" @click="$pushRoute('/student/add')">
          添加学员
        </el-button>
      </div>
       <el-select size="small" v-model="searchForm.checkin" placeholder="请选择状态">
        <el-option label="全部" :value="null"></el-option>
        <el-option label="未审核" :value="1"></el-option>
        <el-option label="已通过" :value="0"></el-option>
      </el-select>
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
        empty-text='暂无数据'
        border
        v-loading="loading"
        height="700px"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="ID"
          align="center"
          prop="userId"
          width="100">
        </el-table-column>
         <el-table-column
          label="用户头像"
          align="center"
          prop="courseId"
          width="100">
           <template slot-scope="scope">
            <img-wrapper size="medium" :src="ImgPath+scope.row.image" style="{width:50px;height:50px;}"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户名称"
          align="center"
         >
        </el-table-column>
         <el-table-column
          prop="phone"
          label="手机号"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="area"
          label="居住地"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="address"
          label="详细地址"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="employer"
          label="分类"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="retired"
          label="退休状态"
          align="center"
          show-overflow-tooltip>
          <template  slot-scope="scope">
            {{scope.row.retired}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.checkin===1?`info`:`success`">{{scope.row.checkin===1?`待审核`:`正常`}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="快捷操作"
                         width="200"
                         align="center">
          <template slot-scope="scope">
                <el-button
              size="mini"
              type="success"
              @click="passBtn(scope.$index, scope.row)" v-if='scope.row.checkin===1'>通过
            </el-button>
                <el-button
              size="mini"
              type="danger"
              @click="carouselMapInvalid(scope.$index, scope.row)" v-if='scope.row.checkin===1'>拒绝
            </el-button>
            <el-button
              size="mini"
              @click="carouselMapEdit(scope.$index, scope.row)" v-if='scope.row.checkin!==1'>编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="carouselMapInvalid(scope.$index, scope.row)" v-if='scope.row.checkin!==1'>删除
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
  import imgWrapper from "../../components/img-wrapper";
  import BodyContainer from "../../components/body-container";
  import {excludeEmpty,getBool} from "../../utils";
  import RegionSelect from "../../components/region-select";
  import {ImgPath} from '../../project-config/base';
  import selectSchool from "../../components/select-school";

  export default {
    name: "CarouselMapList",
    components: {RegionSelect, BodyContainer, HeaderBar,imgWrapper,selectSchool},
    data() {
      return {
        ImgPath,
        imageDialogVisible: false,
        imageDialogImageUrl: '',
        value: '',
        disabled:false,
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
          schoolId: null,
          checkin:null,
        },
      }
    },
    methods: {
      showBigPicture(url) {
        this.imageDialogImageUrl = url;
        this.imageDialogVisible = true;
      },
      ...mapActions("student", ['getStudentList','deleteStudent','passStudent']),
      ...mapActions('common',['getSchoolList']),
      isPriceReduction(specifications) {
        return specifications.some((s) => s["isPriceReduction"]);
      },
      async getTableData(pageNum, pageSize) {
        this.searchForm=excludeEmpty(this.searchForm)
        this.loading = true;
        const res = await this.getStudentList({
          ...this.searchForm,
          pageNum,
          pageSize,
            schoolId:localStorage.getItem('schoolId')
        });
        this.loading = false;
        return res;
      },
      carouselMapEdit(index, row) {
        this.$router.push({path: `/student/add`, query: {userId: row.userId,schoolId:row.schoolId}})
      },
     async passBtn(index, row){
       const {code,msg} = await this.passStudent({
          checkin:0,
          userId:row.userId
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
       const {code,msg} = await this.passStudent({
          checkin:2,
          userId:row.userId
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
      carouselMapInvalid(index, row) {
        this.$confirm('确认删除该学生？')
          .then(async () => {
            //如果row有值就是表格中的按钮 否则就是下面的工具栏
            const {code} = await this.deleteStudent({
              userItemId: row.userItemId,
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
        tableData: state => state.studentList.list||[],
        tableTotal: state => state.studentList.total|| 0
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
