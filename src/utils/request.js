import axios from "axios";
import {backendPath, uploadPath} from "../project-config/base";
import { Message, MessageBox } from 'element-ui'
import store from '../store'

const service = axios.create({
  baseURL: 'http://192.168.31.200:8830', // api 的 base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
// service.interceptors.request.use(
//   config => {
//     if (store.getters.token) {
//       config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
//     }
//     return config
//   },
//   error => {
//     // Do something with request error
//     console.log(error) // for debug
//     Promise.reject(error)
//   }
// )

// response 拦截器
service.interceptors.response.use(
  response => {

    /**
     * code为非200是抛错 可结合自己业务进行修改
     */
    const res = response.data

    if (res.code !== '200') {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === '50008' || res.code === '50012' || res.code === '50014') {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
            sessionStorage.removeItem('token')
            window.location.href=`http://120.27.16.130`
        })
      }
      return response;
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)


/***
 * 上传文件地址固定
 * @param formData
 * @returns {Promise<*>}
 */
async function requestByUpload(formData) {
  const res = await service.post(`${backendPath}/${uploadPath}`, formData, {
    headers: {
      ...defaultHeaders(),
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
}

/////////////////

const defaultHeaders = () => {
  const token = sessionStorage.getItem("token");
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
  const res = await service.get(`${backendPath}/${url}`, {
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
  const res = await service.post(`${backendPath}/${url}`, params, {
    headers: {
      ...defaultHeaders()
    }
  });
  return res.data;
}

export {
  requestByGet, requestByPost, requestByUpload, service
}




