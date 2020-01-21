// 兼容ie
// import 'babel-polyfill'
import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '../static/web-fonts-with-css/css/fontawesome-all.css'
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

import * as filters from './filters' // global filters

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

// 滚动加载表格
Vue.use(ScrollTable)

Vue.prototype.$http = Http

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

for (const key in numberUtil) {
  if (numberUtil.hasOwnProperty(key)) {
    Vue.prototype[key] = numberUtil[key]
  }
}

for (const key in stringUtil) {
  if (stringUtil.hasOwnProperty(key)) {
    Vue.prototype[key] = stringUtil[key]
  }
}

for (const key in fileUtil) {
  if (fileUtil.hasOwnProperty(key)) {
    Vue.prototype[key] = fileUtil[key]
  }
}

// 按钮级别鉴权
Vue.prototype.hasPermission = function(key) {
  return false
}

// 删除后获取分页位置
Vue.prototype.getPageIndexAfterDelete = function(pageIndex, size, total, deleteNum) {
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

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
