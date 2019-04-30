import axios from "axios";
import {backendPath, uploadPath} from "../project-config/base";


/***
 * 上传文件地址固定
 * @param formData
 * @returns {Promise<*>}
 */
async function requestByUpload(formData) {
  const res = await axios.post(`${backendPath}/${uploadPath}`, formData, {
    headers: {
      ...defaultHeaders(),
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
}


const defaultHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    token,
  }
};
/***
 * get请求
 * @param url
 * @param params
 * @returns {Promise<*>}
 */
async function requestByGet(url, params) {
  if (!url) return;
  const res = await axios.get(`${backendPath}/${url}`, {
    params, headers: {
      ...defaultHeaders()
    }
  });
  return res.data;
}


/***
 * post请求
 * @param url
 * @param data
 * @returns {Promise<*>}
 */
async function requestByPost(url, params) {
  if (!url) return;
  const res = await axios.post(`${backendPath}/${url}`, params, {
    headers: {
      ...defaultHeaders()
    }
  });
  return res.data;
}

export {
  requestByGet, requestByPost, requestByUpload, _requestByUploadToTestServer
}

