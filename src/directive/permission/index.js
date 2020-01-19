import permission from './permission'
import auth from './auth'
// 按钮级别鉴权

const install = function(Vue) {
  Vue.directive('permission', permission)
  Vue.directive('auth', auth)
}

if (window.Vue) {
  window['permission'] = permission
  window['auth'] = auth

  Vue.use(install); // eslint-disable-line
}

export default install
