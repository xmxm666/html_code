import axios from 'axios'
import router from "./router";
import {showDialog} from "./util";

export function initHttpInterceptor() {
// http request 拦截器
//   axios.interceptors.request.use(
//     config => {
//       if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
//         config.headers.Authorization = `token ${store.state.token}`;
//       }
//       return config;
//     },
//     err => {
//       return Promise.reject(err);
//     });

// http response 拦截器
  axios.interceptors.response.use(
    async response => {
      if (response.data.black) {
        await showDialog("您的账户存在异常,已被拉黑", "提示", false);
        router.push("/notFound")
        return response;
      } else {
        return response;
      }
    }
  )
}


