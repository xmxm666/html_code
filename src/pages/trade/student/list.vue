<template>
  <div id="CarouselMapList">
    <header-bar legend="缴费列表">
      <div slot="left">
      </div>
      <!-- <el-date-picker
        :style="{marginRight:'10px'}"
        v-model="searchForm.payStatus"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker> -->
      <el-select size="small" v-model="searchForm.payStatus" placeholder="支付状态" style="margin-right:20px">
          <el-option label="已支付" :value="1"></el-option>
          <el-option label="未支付" :value="2"></el-option>
      </el-select>
      <el-input class="search-input" v-model="searchForm.telephone" placeholder="手机号码"></el-input>
      <selectSchool :disabled='disabled'></selectSchool> 
      <el-button type="success" @click="getTableData(1,10)" size="small" style="width: 80px;margin-left: 20px">搜索 </el-button>
      <el-button type="primary" @click="upData" size="small"  style="width: 80px;margin-left: 20px">导出数据 </el-button>
      
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
          label="ID"
          align="center"
          prop="id"
         >
        </el-table-column>
        <el-table-column
          prop="schoolName"
          label="学校名称"
          align="center"
          width="200"
         >
        </el-table-column>
        <el-table-column
          prop="userName"
          label="学员姓名"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="offlineNums"
          label="报名课程"
          align="center"
          width="350"
          show-overflow-tooltip>
          <template  slot-scope="scope">
            <el-row v-for="(item,index) in scope.row.offlineNums" :key="index">
              <div style="display:flex;align-items:center;justify-content:center;margin-bottom:5px">
                <p style="height:28px;">
                  <span>【{{item.courseName}}】</span>
                  <span>:￥{{item.coursePrice}}元</span>
                  <span style="color: red">({{(item.payStatus=='1')?'已支付':(item.payStatus=='2')?'未支付':''}})</span>
                </p>
                <!-- <el-button
                  size="mini"
                  style="width: 56px;height: 28px;margin-left:5px;"
                  type="success"
                  v-if="item.payStatus=='2'"
                  @click="changeStatus2(1, scope.row,scope.$index)">缴费
                </el-button> -->
                <el-button
                  size="mini"
                  style="width: 56px;height: 28px;margin-left:5px;"
                  type="danger"
                  @click="changeStatus2(2, scope.row,item)">删除
                </el-button>
              </div>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          prop="accountAllMoney"
          label="学费总计"
          align="center"
          show-overflow-tooltip>
          <template  slot-scope="scope">
            {{scope.row.accountAllMoney}}元
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="支付更新"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="支付状态"
          align="center"
          >
          <template slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.payStatus==1"></i>
            <i class="el-icon-error" v-if="scope.row.payStatus==2"></i>
          </template>
        </el-table-column>
        <el-table-column label="快捷操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              v-if="scope.row.isenable*1!==-1"
              @click="changeStatus(1, scope.row)">缴费
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="changeStatus(2, scope.row)">取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="c-form-pagination">
        <div>
          <el-button type="success" @click="changeStatusMore(1)">一键缴费</el-button>
          <el-button type="warning" @click="changeStatusMore(2)">一键取消</el-button>
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
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../../components/header-bar";
  import BodyContainer from "../../../components/body-container";
  import {excludeEmpty,getBool,convertUTCTimeToLocalTime} from "../../../utils";
  import RegionSelect from "../../../components/region-select";
  import selectSchool from "../../../components/select-school";
  import {backendPath,ImgPath} from "../../../project-config/base";

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
        status:0,
        //根据是否失效来切换按钮
        featureBtnState: 0,
        //默认搜索条件
        searchForm: {
          schoolId: localStorage.getItem("schoolId"),
          payStatus: null,
          phone: null
        },
      }
    },
    methods: {
      showBigPicture(url) {
        this.imageDialogImageUrl = url;
        this.imageDialogVisible = true;
      },
      ...mapActions("trade", ['getLessonList','deleteorder','thatdeleteorder','Alldeleteorder','updata']),
      ...mapActions('common',['getSchoolList']),
      isPriceReduction(specifications) {
        return specifications.some((s) => s["isPriceReduction"]);
      },
      async getTableData(pageNum, pageSize) {
        this.searchForm.schoolId = (localStorage.getItem("schoolId")=='null')? '0':localStorage.getItem("schoolId");
        //this.searchForm=excludeEmpty(this.searchForm)
        this.loading = true;
        let res;
        // if(this.searchForm.payStatus){
        //   this.searchForm.payStatus[0]=convertUTCTimeToLocalTime(this.searchForm.payStatus[0],'y-m-d')+' 00:00:00';
        //   this.searchForm.payStatus[1]=convertUTCTimeToLocalTime(this.searchForm.payStatus[1],'y-m-d')+' 00:00:00';
        // }
        if(pageNum!=undefined&&pageSize!=undefined){
          res = await this.getLessonList({
            ...this.searchForm,
            pageNum,
            pageSize
          });
        }else
          res = await this.updata({...this.searchForm})
        this.loading = false;
        return res;
      },
      //多条状态修改
     async changeStatusMore(type){
        // if(this.$refs.multipleTable.selection.length===0){
        //     this.$message.error("你没有选择任何课程!");
        //     return false
        // }
        const res = await this.Alldeleteorder({
          //userId:userId,//this.$refs.multipleTable.selection.map(item=>{ return item.id}),
          payStatus:type
        })
        console.log(this.$refs.multipleTable.selection.map(item=>{ return item.id}))
        if(res.code==200){
          this.$message.success(res.msg);
        }else{
          this.$message.error(res.msg);
        }
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
       console.log(row)
        const res = await this.deleteorder({
          payStatus:index,
          id:row.id,
          userId:row.userId
        })
        if(res.code==200){
          this.$message.success(res.msg);
        }else{
          this.$message.error(res.msg);
        }
        this.getTableData(this.pageNum, this.pageSize);
      },
      async changeStatus2(type,row,item){
        const res = await this.thatdeleteorder({
          payStatus:type,
          id:item.id,
          userId: item.userId,
          courseId:item.courseId
        })
        if(res.code==200){
          this.$message.success(res.msg);
        }else{
          this.$message.error(res.msg);
        }
        this.getTableData(this.pageNum, this.pageSize);
      },
     upData(){
         this.$confirm('是否下载该课表？')
          .then(async () => {
            const {code,data} = await this.getTableData();
            for(let i = 0;i < data.length; i++){
              let course = "";
              data[i].payStatus = (data[i].payStatus) == 1? '已支付':(data[i].payStatus == 2)? '未支付':'';
              if(data[i].offlineNums){
                for(let j = 0;j < data[i].offlineNums.length;j++){
                  data[i].offlineNums[j].payStatus=data[i].offlineNums[j].payStatus=='1'?'已支付':data[i].offlineNums[j].payStatus=='2'?'未支付':''
                  course += "【"+data[i].offlineNums[j].courseName+"】"+":￥"+data[i].offlineNums[j].coursePrice+"元("+data[i].offlineNums[j].payStatus+")";
                }
              }  
              data[i].offlineNums = course;
            }
            if (code === '200') {
              require.ensure([], () => {
                const {export_json_to_excel} = require('../../../vendor/Export2Excel');
                const tHeader = ['ID', '学校名称', '学员姓名', '手机号码', '报名课程', '学费总计', '支付更新','支付状态'];
                const filterVal = ['id', 'schoolName', 'userName', 'phone', 'offlineNums', 'accountAllMoney','updateTime','payStatus'];
                const jsonData = this.formatJson(filterVal, data);
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
      ...mapState("trade", {
        tableData: state => state.lessonList.results||[],
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
