const isDev = false;
const publishUrl = "http://www.zhyos.com/m520";
const assetPath = 'http://120.27.16.130/';
const backendPath = isDev ? 'http://192.168.31.102:8840' : 'http://120.27.16.130:8830';
const backendBasePath = isDev ? 'http://192.168.31.200:8850' : publishUrl;
const uploadPath = "city/api/common/apiUpload";
export {
  assetPath, backendPath,  uploadPath,backendBasePath
}
