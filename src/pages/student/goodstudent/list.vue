<template>
  <div id="CarouselMapList">
    <header-bar legend="学员风采">
      <div slot="left">
          <el-button type="primary" size="small" style="margin-left: 20px" @click="$pushRoute('/student/goodsubmission/add')">
            添加学员展示
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
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="学校"
          align="center"
          prop="schoolName"
          width="200">
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="content"
          label="正文"
          align="center"
          show-overflow-tooltip>
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
          prop="visits"
          label="浏览量"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          label="是否公开"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.ispublic==1?`danger`:`success`">{{scope.row.ispublic==1?`公开`:`不公开`}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="快捷操作"
                         width="200"
                         align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="tableDataEdit(scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="carouselMapInvalid(scope.row)">删除
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
  import HeaderBar from "../../../components/header-bar";
  import BodyContainer from "../../../components/body-container";
  import {excludeEmpty,getBool} from "../../../utils";
  import RegionSelect from "../../../components/region-select";
  import selectSchool from "../../../components/select-school";
  import imgWrapper from "../../../components/img-wrapper";
  import {ImgPath} from '../../../project-config/base';

  export default {
    name: "CarouselMapListt",
    components: {RegionSelect, BodyContainer, HeaderBar,selectSchool,imgWrapper},
    data() {
      return {
        ImgPath,
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
      ...mapActions("student", ['getGoodList','deletestudent']),
      ...mapActions('common',['getSchoolList']),
      isPriceReduction(specifications) {
        return specifications.some((s) => s["isPriceReduction"]);
      },
      async getTableData(pageNum, pageSize) {
        this.searchForm=excludeEmpty(this.searchForm)
        //this.loading = true;
        const res = await this.getGoodList({
          ...this.searchForm,
          pageNum,
          pageSize,
          schoolId:localStorage.getItem('schoolId')
        });
        console.log(res)
        this.loading = false;
        return res;
      },
      carouselMapEdit(index, row) {
        this.$router.push({path: `/page/lesson/add`, query: {courseId: row.vacateId}})
      },
      carouselMapInvalid(row) {
          console.log(row)
        this.$confirm('确认删除该条记录？')
          .then(async()=>{
            const res = await this.deletestudent({
              id: row.id,
            });
            if (res.code === '200') {
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
      tableDataEdit(row){
          this.$router.push({path: `/student/goodsubmission/add`, query: {id: row.id,userId:row.userId}})
      }

    },
    computed: {
      ...mapState("student", {
        tableData: state => state.tableDatagoodList.list||[],
        tableTotal: state => state.tableDatagoodList.total|| 0
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
      this.getTableData(this.pageNum, this.pageSize);
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
