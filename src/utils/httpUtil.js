import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import urlUtil from './urlUtil'

let basePath = '/serviceBase/'

// 默认连接地址，只在调试时有用
if (process.env.NODE_ENV === 'development') {
  basePath = `/${urlUtil.getQueryStringArgs('pt') || 'main'}${basePath}`
}

axios.interceptors.request.use(function(config) {
  config.headers.token = localStorage.getItem('token') || ''
  return config
}, function(error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function(response) {
  if (response.data.status === false) {
    if (response.data.code === 401) {
      // 未登录
      // 有些接口可以不拦截
      if (!response.config.noAuth) {
        console.log('noAuth request')
      }
      Message({
        message: response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(new Error(response.data.message))
  }
  return response
}, function(error) {
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  console.log('interceptors error')
  return Promise.reject(error)
})

function makeUrl(url) {
  if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
    return url
  } else {
    return `${basePath}${url}`
  }
}

// 去除参数值前后的空格
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
// 去除参数前后空格
function trimParams(target) {
  // 定义一个变量
  let result
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === 'object') {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = [] // 将result赋值为一个数组，并且执行遍历
      for (const i in target) {
        // 递归克隆数组中的每一项
        result.push(trimParams(target[i]))
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if (target === null) {
      result = null
      // 判断如果当前的值是一个RegExp对象的话，直接赋值
    } else if (target.constructor === RegExp) {
      result = target
    } else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {}
      for (const i in target) {
        result[i] = trimParams(target[i])
      }
    }
    // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    if (typeof target === 'string') {
      result = trim(target)
    } else {
      result = target
    }
  }
  // 返回最终结果
  return result
}

const Http = {
  get(url, query, options) {
    let queryString = ''
    if (query) {
      query.timestamp = new Date().getTime()
    } else {
      query = { timestamp: new Date().getTime() }
    }
    queryString = qs.stringify(query)
    return axios.get(makeUrl(url + (queryString ? '?' + queryString : '')), options).then(data => data.data)
  },
  post(url, param, options) {
    return axios.post(makeUrl(url), param, options).then(data => data.data)
  },
  postJson(url, param, options) {
    param = param || {}
    return axios.post(makeUrl(url), qs.stringify(param), options).then(data => data.data)
  },
  makeUrl
}

export default Http
