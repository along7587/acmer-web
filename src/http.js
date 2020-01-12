import axios from 'axios'
import qs from 'qs'
import router from './router'

// axios 配置
axios.defaults.timeout = 8000
axios.defaults.baseURL = 'http://localhost:8080/'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.data = qs.stringify(config.data)
    }
    if (localStorage.token) {
      config.headers.Authorization = localStorage.token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // console.log(response)
    return response
  },
  error => {
    // console.log(error)
    if (error.response) {
      switch (error.response.status) {
        case 203:
          router.replace('/Auth/Login')
      }
    }
    return Promise.reject(error.response)
  }
)
export default axios
