import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { message } from 'ant-design-vue'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 12000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  if (error.message.includes('timeout')) {
    // 处理超时
    console.log('error.message', error.message)
    // Message({
    //   message: '请求超时',
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    message.error('请求超时,请刷新页面')
    // const res = ''
    // return res && Promise.reject(error)
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  console.warn(`REQUESTING...[${config.method.toUpperCase()}]`, { url: config.url, params: config.params, payload: config.data })
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers[ACCESS_TOKEN] = 'Bearer ' + token
  }
  return {
    ...config,
    validateStatus: function (status) {
      return status >= 200 && status <= 400
    }
  }
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
