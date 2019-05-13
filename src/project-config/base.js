const isDev = true;
const publishUrl = "http://120.27.16.130:8830";

const assetPath = 'http://120.27.16.130/';///
const ImgPath = 'http://120.27.16.130/';///
const backendPath = isDev ? 'http://192.168.31.232:8830' : 'http://120.27.16.130:8830';  ///


const backendBasePath = isDev ? 'http://192.168.31.102:8830' : publishUrl;
const uploadPath = "city/api/common/apiUpload";
export {
  assetPath, backendPath,  uploadPath,backendBasePath,ImgPath
}
