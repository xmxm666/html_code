<template>
  <div id="CarouselMapList">
    <header-bar legend="课程列表">
      <div slot="left">
        <el-button type="primary" size="small" style="margin-left: 20px" @click="$pushRoute('/page/lesson/add')">
          添加课程
        </el-button>
        <el-button type="primary" size="small" style="margin-left: 20px" @click="dialogVisible=true">
          设置时间
        </el-button>
      </div>
      <el-date-picker
        :style="{marginRight:'10px'}"
        v-model="timer"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-select v-model="searchForm.isenable" placeholder="请选择状态" :style="{marginRight:'10px',height:'32px'}">
        <el-option
          v-for="item in lessonStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input class="search-input" v-model="searchForm.search" placeholder="请输入课程名"></el-input>
      <selectSchool :disabled='disabled' ></selectSchool>  
      <el-button type="success" @click="getTableData(1,10)" size="small" style="width: 80px;margin-left: 20px">搜索 </el-button>
      <el-button type="primary" @click="upData" size="small"  style="width: 80px;margin-left: 20px">导出数据 </el-button>
      <el-upload
          class="avatar-uploader"
          :action="`${backendPath}/server/fileDown/courseListImport`"
          :headers="headers"
          :show-file-list="false"
          :on-error="error"
          name='file'
          :on-success="handleAvatarSuccess2"
          :before-upload="beforeAvatarUpload2">
          <el-button type="primary" size="small"  style="width: 80px;margin-left: 20px">导入数据 </el-button>
      </el-upload>

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
          >
        </el-table-column>
        <el-table-column
          label="课程ID"
          align="center"
          prop="courseId"
         >
        </el-table-column>
        <el-table-column
          prop="schoolName"
          label="学校"
          align="center"
          width="170"
         >
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="teacherName"
          label="老师"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="placeClass"
          label="上课地址"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="startDate"
          label="开课时间"
          align="center"
          :formatter="formatterGenerator('dateTime')"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="endDate"
          label="结束时间"
          align="center"
          :formatter="formatterGenerator('dateTime')"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="coursePrice"
          label="课程价钱"
          align="center"
          show-overflow-tooltip>
          <template  slot-scope="scope">
            {{scope.row.coursePrice}}元
          </template>
        </el-table-column>
        <el-table-column
          prop="nowtotal"
          label="可报名人数"
          align="center"
          >
          <template  slot-scope="scope">
            {{scope.row.nowtotal}}人
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          >
          <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.isenable*1===0?`danger`:scope.row.isenable*1===-1?'info':'success'">{{scope.row.isenable*1===0?`未启用`:scope.row.isenable*1===-1?'下架':'正常'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="快捷操作"
        width="300px"
                         align="center">
          <template slot-scope="scope">
             <el-button
              size="mini"
              v-if="scope.row.isenable*1!==-1"
              :type="scope.row.isenable*1===0?'success':'warning'"
              @click="changeStatus(scope.$index, scope.row)">{{scope.row.isenable*1===0?'启用':'停用'}}
              
            </el-button>
            <el-button
              size="mini"
              v-if="scope.row.isenable*1!==-1"
              @click="carouselMapEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="carouselMapInvalid(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="c-form-pagination">
        <div>
          <el-button type="success" @click="changeStatusMore(1)">一键启用</el-button>
          <el-button type="warning" @click="changeStatusMore(0)">一键停用</el-button>
          <el-button type="danger" @click="deleteLessonMore">一键删除</el-button>
          <el-button type="success" @click="downdowndown">下载课程模版</el-button>
        </div>
        <el-pagination
          :style="{flex:1,display:'flex',justifyContent:'center'}"
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
    <!-- 设置时间弹窗 -->
    <el-dialog
      title="设置全部课程时间"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <section :style="{marginBottom:'10px'}"><span>选择学校：</span>
       <el-select v-model="schoolId" :disabled='disabled' placeholder="请选择状态" :style="{marginRight:'10px',height:'32px'}">
        <el-option
          v-for="item in schoolData"
          :key="item.schoolId"
          :label="item.schoolName"
          :value="item.schoolId">
        </el-option>
      </el-select>
      </section>
      <section :style="{display:'flex',alignItems:'center'}">
        <p :style="{minWidth:'70px'}">选择时间：</p>
        <el-date-picker
        
        v-model="allTime"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
      </section>
       
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="settingTime">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../components/header-bar";
  import BodyContainer from "../../components/body-container";
  import {excludeEmpty,getBool,convertUTCTimeToLocalTime} from "../../utils";
  import RegionSelect from "../../components/region-select";
  import selectSchool from "../../components/select-school";
  import {backendPath,ImgPath} from "../../project-config/base";

  export default {
    name: "CarouselMapList",
    components: {RegionSelect, BodyContainer, HeaderBar,selectSchool},
    data() {
      return {
        dialogVisible: false,
        imageDialogVisible: false,
        imageDialogImageUrl: '',
        value: '',
        backendPath,
        allTime:null,
        schoolId:null,
        headers: {
          'token' : sessionStorage.getItem("token")
        },
        loading: false,
        multipleSelection: [],
        categories: [],
        pageNum: 1,
        pageSize: 10,
        pieChart: null,
        barChart: null,
        disabled:false,
        timer:null,
         pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        lessonStatus:[
          {label:'全部',value:null},
          {label:'未启用',value:0},
          {label:'已启用',value:1},
          {label:'下架',value:-1}
        ],
        status:0,
        //根据是否失效来切换按钮
        featureBtnState: 0,
        //默认搜索条件
        searchForm: {
          schoolId: null,
          search:null,
          isenable:null,
          startDate:null,
          endDate:null,
        },
      }
    },
    methods: {
      showBigPicture(url) {
        this.imageDialogImageUrl = url;
        this.imageDialogVisible = true;
      },
      ...mapActions("lesson", ['getLessonList','deleteLesson','changeLessonStatus','settingTimer']),
      ...mapActions('common',['getSchoolList']),
      isPriceReduction(specifications) {
        return specifications.some((s) => s["isPriceReduction"]);
      },
      async getTableData(pageNum, pageSize) {
        if(this.timer){
          this.searchForm.startDate=convertUTCTimeToLocalTime(this.timer[0],'y-m-d');
          this.searchForm.endDate=convertUTCTimeToLocalTime(this.timer[1],'y-m-d');
        }
        this.searchForm=excludeEmpty(this.searchForm)
        this.loading = true;
        let res;
        console.log(pageNum!=undefined&&pageSize!=undefined)
        if(pageNum!=undefined&&pageSize!=undefined){
          res = await this.getLessonList({
            ...this.searchForm,
            pageNum,
            pageSize,
            schoolId:localStorage.getItem('schoolId')
          });
        }else
          res = await this.getLessonList({...this.searchForm})
        this.loading = false;
        return res;
      },
      //多条状态修改
     async changeStatusMore(type){
         if(this.$refs.multipleTable.selection.length===0){
              this.$message.error("你没有选择任何课程!");
              return false
        }
          await this.changeLessonStatus({
          courseIds:this.$refs.multipleTable.selection.map(item=>{ return item.courseId }),
          isenable:type
        })
          this.getTableData(this.pageNum, this.pageSize);
      },
      //多条删除
      deleteLessonMore(){
        if(this.$refs.multipleTable.selection.length===0){
              this.$message.error("你没有选择任何课程!");
              return false
        }
         this.$confirm('确认删除选中课程？')
          .then(async () => {
            const {code} = await this.deleteLesson({
              courseIds:this.$refs.multipleTable.selection.map(item=>{ return item.courseId }),
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
      //设置时间
      async settingTime(){
        if(this.allTime){
          if(!this.schoolId){
             this.$message.error("您还未选择学校");
             return false
          }
          let timeForm={}
          timeForm.startDate=convertUTCTimeToLocalTime(this.allTime[0],'y-m-d');
          timeForm.endDate=convertUTCTimeToLocalTime(this.allTime[1],'y-m-d');
         const {data,code,msg} =  await this.settingTimer({
            ...timeForm,
            schoolId:this.schoolId
        })
        if(code==='200'){
           this.$message.success(msg);
           this.dialogVisible=false;
           this.getTableData(this.pageNum, this.pageSize);
        }else{
           this.$message.error(msg);
           this.dialogVisible=false;
           this.getTableData(this.pageNum, this.pageSize);
        }
        }else{
          this.dialogVisible=false
          return false
        }
      },
     async changeStatus(index,row){
       if(row.isenable*1===0){
         this.status=1
       }else{
        this.status=0
       }
        await this.changeLessonStatus({
          courseIds:[row.courseId],
          isenable:this.status
        })
          this.getTableData(this.pageNum, this.pageSize);
      },
      carouselMapEdit(index, row) {
        this.$router.push({path: `/page/lesson/add`, query: {courseId: row.courseId}})
      },
     upData(){
         this.$confirm('是否下载该课表？')
          .then(async () => {
            const {code,data} = await this.getTableData();
            for(let i = 0;i < data.length; i++){
              data[i].isenable = (data[i].isenable) == -1? '下架':(data[i].isenable == 0)? '未启用':(data[i].isenable == 1)? '启用':'';
            }
            if (code === '200') {
              require.ensure([], () => {
                const {export_json_to_excel} = require('../../vendor/Export2Excel');
                const tHeader = ['课程ID','学校名称','教师名称', '课程名称', '上课地址', '开课时间', '结束时间', '课程价钱', '状态'];
                const filterVal = ['courseId','schoolName','teacherName', 'courseName', 'placeClass', 'startDate', 'endDate', 'coursePrice','isenable'];
                const jsonData = this.formatJson(filterVal, data);
                console.log(jsonData)
                export_json_to_excel(tHeader, jsonData, '列表excel');
              })
              this.$message.success("下载成功!");
              this.getTableData(this.pageNum, this.pageSize);
            } else {
              this.$message.error("下载失败,请联系开发人员检查!");
            }
          })
          .catch(async () => {
            console.log(this.tableData)
            this.$message("操作已取消");
          });
      },
      handleAvatarSuccess2(res, file) {
        if(res.code==200){
          this.$message.success("上传成功");
          this.getTableData(this.pageNum, this.pageSize);
        } else this.$message.error(res.msg);
      },
      error(res){
        this.$message.error(res.msg);
      },
      beforeAvatarUpload2(file) {
        const isJPG = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'||'application/vnd.ms-excel';
        if (!isJPG) {
          this.$message.error('上传表格格式不符!');
        }
        return isJPG;
      },
      downdowndown(){
        window.open('http://prxopj1oi.bkt.clouddn.com/%E8%AF%BE%E7%A8%8B%E6%A8%A1%E6%9D%BF2.xls')
      },
      formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]))
			},
      carouselMapInvalid(index, row) {
        this.$confirm('确认删除该课程？')
          .then(async () => {
            const {code} = await this.deleteLesson({
              courseIds: [row.courseId],
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
      ...mapState("lesson", {
        tableData: state => state.lessonList.list||[],
        tableTotal: state => state.lessonList.total|| 0
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
      this.getSchoolList();
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
      display: flex;
      justify-content: space-between;
    }
    .sImg{
      width: 34px;
      height: 34px;
    }
    .search-input{
      height: 32px;
      margin-right: 10px;
      width: 200px;
    }
   & /deep/ .el-input__icon{
      display: flex;
      align-items: center;
      justify-content: center;
    }
   & /deep/ .el-input__inner{
      height: 32px;
    }
    & /deep/ .el-range-separator{
    display: flex;
    align-items: center;
  
  }
   
  }
</style>
