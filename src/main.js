// 兼容ie
// import 'babel-polyfill'
import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '../static/web-fonts-with-css/css/font-awesome.css'
import 'element-ui/lib/theme-chalk/index.css'
import Element from 'element-ui'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './permission' // permission control
import ScrollTable from '@/directive/scrollTable'
import Http from '@/utils/httpUtil.js'
import numberUtil from '@/utils/numberUtil.js'
import stringUtil from '@/utils/stringUtil.js'
import fileUtil from '@/utils/fileUtil.js'

import typeValue from '@/common/typeValue' // global filters

import * as filters from './filters' // global filters
import domImage from '@/utils/domImage'
import uuid from 'uuid/v1'

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

// 滚动加载表格
Vue.use(ScrollTable)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// HTTP工具
Vue.prototype.$http = Http

function registerUtil(util) {
  for (const key in util) {
    if (util.hasOwnProperty(key)) {
      Vue.prototype['$' + key] = util[key]
    }
  }
}
// 数字工具
registerUtil(numberUtil)
// 字符串工具
registerUtil(stringUtil)
// 文件工具
registerUtil(fileUtil)
// 常量格式化
registerUtil(typeValue)

// 按钮级别鉴权
Vue.prototype.$hasPermission = function(key) {
  return false
}

// 删除后获取分页位置
Vue.prototype.$getPageIndexAfterDelete = function(pageIndex, size, total, deleteNum) {
  deleteNum = deleteNum || 1
  let res = total - deleteNum
  if (res < 0) {
    res = 0
  }
  const newAll = pageIndex * size
  if (newAll <= res) {
    return pageIndex
  } else {
    return Math.ceil(res / size)
  }
}

// 打印的方法
Vue.prototype.$print = function(cid) {
  document.getElementsByTagName('html')[0].classList.add('printing')
  domImage.convertToImage(
    document.getElementById(cid)
  ).then((res) => {
    document.getElementsByTagName('html')[0].classList.remove('printing')
    const div = document.createElement('div')
    const id = uuid()
    div.setAttribute('class', 'print-img-wrap')
    div.innerHTML = `<img id="${id}" src="${res}" alt="">`
    document.body.appendChild(div)
    this.$nextTick(() => {
      print({
        printable: id,
        type: 'html',
        targetStyles: ['*'],
        scanStyles: false
      })
      div.remove()
    })
  }).catch(() => {
    document.getElementsByTagName('html')[0].classList.remove('printing')
  })
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
