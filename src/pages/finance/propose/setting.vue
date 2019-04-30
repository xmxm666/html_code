<template>
  <div id="FSetting">
    <header-bar legend="认证设置"/>
    <body-container v-loading="loading">
      <div class="setting_box">
       
      <div class="Certification_time">
        <el-form>
          <!--提现门栏  -->
            <el-form :inline="true">
                <el-form-item  class="money label" label="提现门栏"  >
                    <el-input v-model.number="form.minWithDraw"></el-input>
                </el-form-item>
                <el-form-item class="minWithDraw" >
                    <span class="sp">元</span>
                </el-form-item>
                <p class="Certification_time_tip">满多少钱可以提现，0为无限制。</p>
            </el-form>
                <!--提现间隔时间  --> 
            <el-form :inline="true" class="timeBox">
                <el-form-item  class="money" label="提现间隔时间" >
                    <el-input v-model.number="form.interval"></el-input>
                </el-form-item>
                <el-form-item class="money" >
                    <span class="sp">天</span>
                </el-form-item>
                <p class="Certification_time_tip">每隔多少天可以提现一次，0为无限制。</p>
            </el-form>
             <!-- 提现手续费 -->
            <el-form :inline="true" class="timeBox">
                <el-form-item  class="money" label="提现手续费" >
                    <el-input v-model.number="form.protocol"></el-input>
                </el-form-item>
                <el-form-item class="money" >
                   <span class="sp">%</span>
                </el-form-item>
                  <p class="Certification_time_tip">用户提现扣除的手续费，0为不扣除手续费。</p>
            </el-form>
            <!-- 提交表单 -->
        </el-form>
      </div>
      <el-button type="primary" class="submit" @click="submitForm">保存</el-button>
        </div>
    </body-container>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import HeaderBar from "../../../components/header-bar";
  import BodyContainer from "../../../components/body-container";
  import { Message } from 'element-ui';

  export default {
    name: "Setting",
    components: { BodyContainer, HeaderBar},
    data() {
      return {
          loading:false,
        form:{
            minWithDraw:null,
            interval:null,
            protocol:null
        }
      }
    },
    methods: {
      ...mapActions("finance/money", ["updateOrCreateWithDrawSetting",'getWithDrawSetting']),
        async getTableData(){
          this.loading=true;
          await this.getWithDrawSetting()
          this.loading=false;
          },
         async submitForm() {
        this.loading = true;
        const {code} = await this.updateOrCreateWithDrawSetting(this.form);
        this.loading = false;
        if (code === 200) {
          this.$message.success("设置成功！");
        } else {
          this.$message.success("设置失败！")
        }
      },
       
    },
    computed: {
    ...mapState("finance/money", {
      tableData: state => state.tableDataList,
      tableDataTotal: state => state.tableDataList.count
    }),
  },
   async created() {
      
        if(this.tableData){
           await this.getTableData()
          this.form.minWithDraw=this.tableData.minWithDraw
          this.form.interval=this.tableData.interval
          this.form.protocol=this.tableData.protocol
        }
    }
  }
</script>

<style scoped lang="scss">
  #FSetting {
    .c-form {
      margin-top: 30px;

      &__item {
        margin-bottom: 40px;
      }
    }
    .setting_box /deep/ .el-form-item{
        margin-bottom: 0;
    }
    .setting_box{
      width: 800px;
      padding: 50px 50px;
      
    .Certification_time_tip{
    height: 20px;
    color: rgba(16, 16, 16, 0.43);
    font-size: 14px;
    text-align: left;
    font-family: SourceHanSansSC-regular;
    margin-left: 120px;
    }
    .label /deep/ .el-form-item__label{
        text-align: left;
        width: 110px;
    }
   .timeBox /deep/ .el-form-item__label{
     width: 110px;
     text-align: left;
   }
  
    }
  }
</style>
