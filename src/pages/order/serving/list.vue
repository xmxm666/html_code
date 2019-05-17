<template>
  <div id="MerchantList">
        <header-bar legend="服务记录">
        <el-button type="success" size="small" style="width: 80px;margin-left: 20px" @click="getTableData(pageNum, pageSize)">搜索</el-button>
        <el-button type="primary" size="small" style="width: 80px;margin-left: 20px">导出</el-button>
        </header-bar>
    <body-container>
        <el-form :inline="true" class="searchBox">
            <el-form-item  class="money label" label="服务单号"  >
                <el-input v-model.number="searchForm.id"></el-input>
            </el-form-item>
            <el-form-item  class="money label" label="姓名"   >
                <el-input v-model.number="searchForm.name"></el-input>
            </el-form-item>
            <el-form-item  class="money label" label="手机"   >
                <el-input v-model.number="searchForm.phone"></el-input>
            </el-form-item>
        </el-form> 
        <el-radio-group v-model="radio3" @change='changeType'>
        <el-form :inline="true" >
             
            <el-form-item  class="money label"   >
                <el-radio-button label="全部"></el-radio-button>
            </el-form-item>
           <el-form-item  class="money label searchButton"   >
                <el-radio-button label="商家认证" :value='1'></el-radio-button>
            </el-form-item>
            <el-form-item  class="money label searchButton"   >
                <el-radio-button label="企业认证"></el-radio-button>
            </el-form-item>
            <el-form-item  class="money label searchButton"   >
                <el-radio-button label="查看简历"></el-radio-button>
            </el-form-item>
            <el-form-item  class="money label searchButton"   >
                <el-radio-button label="招聘发布"></el-radio-button>
            </el-form-item>
            <el-form-item  class="money label searchButton"   >
                <el-radio-button label="简历刷新"></el-radio-button>
            </el-form-item>
            <el-form-item  class="money label searchButton"   >
                <el-radio-button label="简历发布"></el-radio-button>
            </el-form-item>
         </el-form>  
    </el-radio-group >
       

      <el-table  stripe ref="multipleTable"  :data="formatTableData"  tooltip-effect="dark" v-loading="loading"  border  height="600px"  style="width: 100%">
         <el-table-column label="服务单号" align="center" >
          <template slot-scope="scope">
            {{ scope.row.customer.id }}
          </template>
        </el-table-column>
        <el-table-column label="服务项目" align="center" >
          <template slot-scope="scope">
            {{scope.row.type }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="消费金额" align="center">
          <template slot-scope="scope">
            {{ scope.row.expenditure }}
          </template>
        </el-table-column>
        <el-table-column prop="date" label="付费人" align="center" >
          <template slot-scope="scope">
            <p>{{ scope.row.customer.customerCertification.name }}</p>
            <p>{{ scope.row.customer.customerCertification.phone }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="付费时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.createTime }}
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
          <el-pagination  @size-change="pageSizeChange"  @current-change="pageNumChange" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"  :total="tableDataTotal"  @prev-click='prevPage'  @next-click='nextPage'></el-pagination>
        </el-col>
      </el-row>
    </body-container>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../../components/header-bar";
  import {excludeEmpty,convertUTCTimeToLocalTime} from "../../../utils";
  import BodyContainer from "../../../components/body-container";

  export default {
    name: "distributor",
    components: {BodyContainer, HeaderBar},
    data() {
      return {
          radio3:'全部',
         namePhone:null,
        dialogVisible:false,
        loading:false,
        pageNum:1,
        pageSize:10,
        //搜索条件
        searchForm: {
          id:null,
          name:null,
          phone:null,
          type:null,
          appPageId: null,
          selectedAddress: [],
        },
      }
    },
    methods: {
      //修改类型
      changeType(){
       this.searchForm.type=this.getType(this.radio3)
       this.getTableData(this.pageNum,this.pageSize)
      },
      //判断类型
      getType(type){
        switch(type){
          case '商家认证':
            return '0'
          case '企业认证':
            return '1'
          case '查看简历':
            return '2'
          case '简历发布':
            return '3'
          case '招聘发布':
            return '4'
          case '简历刷新':
            return '5'
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
            return null
          }
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
      //待开发
      productEdit(){},
      productDelete(){},
      View_record(index,row){},
      ...mapActions("order/serving", ['getServiceOrderByPage']),
      //获取列表
      async getTableData(pageNum, pageSize) {
        this.loading = true;
        const form = {...this.searchForm, city: this.searchForm.selectedAddress[1]};
        const condition = excludeEmpty(form);
        const res = await this.getServiceOrderByPage({
          pageNum,
          pageSize,
          ...condition,
        });
        this.loading = false;
        return res;
      },
      //删除
      productDeleteOrInvalid(index,row){
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
      //改变页数
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
      ...mapState("order/serving", {
        tableData: state => state.tableDataList.rows || [],
        tableDataTotal: state => state.tableDataList.count,
      }),
      //格式化数据
       formatTableData() {
           if(!this.tableData[0]){
               return []
           }
        return this.tableData.map((item) => ({
          ...item,
          type:this.getType(item.type),
          createTime:convertUTCTimeToLocalTime(item.createTime)
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
  .searchBox{
      margin-left: 18px;
  }
  .searchButton{
      margin: 0 20px;
      width: 120px;
      text-align: center;
  }
  .lastForm{
      margin-left: 80px;
      margin-bottom: 20px;
  }
}
</style>
