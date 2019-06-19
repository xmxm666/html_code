const isDev = true;    //是否是开发环境
const publishUrl = "http://120.27.16.130:8830/";  //上传图片地址

const assetPath = 'http://120.27.16.130/';///    //线上静态资源地址
const ImgPath = 'http://120.27.16.130/';///     //线上静态资源地址
const qnypath = 'http://prxopj1oi.bkt.clouddn.com/'  //七牛云地址
const backendPath = isDev ? 'http://192.168.31.200:8830' : 'http://120.27.16.130:8830';  ///120.27.16.130
          //本地测试地址：102-组长  232-小夏  200-张姐   ···分割····   //线上接口地址


 //弃用
const backendBasePath = isDev ? 'http://192.168.31.102:8830' : publishUrl;
//本地测试上传文件地址····弃用
const uploadPath = "city/api/common/apiUpload";
//本地测试上传图片地址····弃用



export {
  assetPath, backendPath,  uploadPath,backendBasePath,ImgPath,publishUrl,qnypath
}
