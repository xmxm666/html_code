<template>
    <div id="Agreement">
  
    <!--中间80%-->
    <div class="middle">
        <div class="top">用户注册协议</div>
        <div :style="{padding:'15px'}">
            <p>一、总则</p>
                <span class="item"> 在此特别提醒您（用户）在注册成为咱爸咱妈老年大学用户之前，请认真阅读本《咱爸咱妈老年大学用户服务协议》（以下简称“协议”），确保您充分理解本协议中各条款。请您审慎阅读并选择接受或不接受本协议。除非您接受本协议所有条款，否则您无权注册、登录或使用本协议所涉服务。您的注册、登录、使用等行为将视为对本协议的接受，并同意接受本协议各项条款的约束。  本协议约定咱爸咱妈老年大学与用户之间关于“咱爸咱妈老年大学”服务（以下简称“服务”）的权利义务。“用户”是指注册、登录、使用本服务的个人。本协议可由咱爸咱妈老年大学随时更新，更新后的协议条款一旦公布即代替原来的协议条款，恕不再另行通知，用户可在本APP中查阅最新版协议条款。在修改协议条款后，如果用户不接受修改后的条款，请立即停止使用咱爸咱妈老年大学提供的服务，用户继续使用咱爸咱妈老年大学提供的服务将被视为接受修改后的协议。</span> 
            <p>二、账号注册</p>
                <span class="item">1、用户在使用本服务前需要注册一个“咱爸咱妈老年大学”账号。“咱爸咱妈老年大学”账号应当使用手机号码绑定注册，请用户使用尚未与“咱爸咱妈老年大学”账号绑定的手机号码，以及未被咱爸咱妈老年大学根据本协议封禁的手机号码注册“咱爸咱妈老年大学”账号。咱爸咱妈老年大学可以根据用户需求或产品需要对账号注册和绑定的方式进行变更，而无须事先通知用户。 </span> 
                <span class="item">2、如果注册申请者有被咱爸咱妈老年大学封禁的先例或涉嫌虚假注册及滥用他人名义注册，及其他不能得到许可的理由， 咱爸咱妈老年大学将拒绝其注册申请。</span> 
                <span class="item">3、鉴于“咱爸咱妈老年大学”账号的绑定注册方式，您同意咱爸咱妈老年大学在注册时将允许您的手机号码及手机设备识别码等信息用于注册。</span> 

            <p>三、用户安全</p>
                <span class="item"> 1、用户一旦注册成功，成为咱爸咱妈老年大学的用户，将得到一个用户名和密码，并有权利使用自己的用户名及密码随时登陆咱爸咱妈老年大学。</span> 
                <span class="item last">最终解释权归武汉优效云科技有限公司所有</span>
            

        </div>
    
    </div>
</div>
  
</template>

<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    name: "Agreement",
    data() {
      return {
        userNameFocus: false,
        passWordFocus: false,
        form: {
          phone: "",
          password: ""
        }
      }
    },
    computed: {},
    methods: {
     
    },
    watch: {},
    components: {}
  }
</script>

<style lang="scss" scoped>
  #Agreement {
p{
    font-size: 18px;
    font-weight: bold;
    text-indent: 10px;
    margin:10px;
}
a{
    font-size: 30px;
    line-height: 50px;
    padding-left: 20%;
}
.left{
    height: 800px;
    width: 10%;
    float: left;
}
.middle{
    height: 800px;
    width: 100%;
    float: left;
}
.right{
    height: 800px;
    width: 10%;
    float: left;
}
.middle .top{
    width: 100%;
    height: 30px;
    background-color: rgb(205, 63, 63);
    text-align: center;
    line-height: 30px;
    font-weight: bolder;
    color: #fff;
}
.middle .agree{
    width: 100%;
    height: 40px;
}
.middle .agree input{
    width: 10%;
    height: 40px;
    font-size: 20px;
    color: white;
    background-color: lightseagreen;
    font-weight: bolder;
    cursor: pointer;
}
.item{
    line-height: 30px;
    display: block;
    text-indent: 2em;
}
.last{
    font-size: 12px;
    color: rgb(134, 130, 130);
    text-align: center;
}

  }
</style>
