import Permission from './permission'
// 按钮级别鉴权

const install = function(Vue) {
  Vue.directive('Permission', Permission)
}

if (window.Vue) {
  window.permission = Permission
  Vue.use(install); // eslint-disable-line
}

Permission.install = install

export default Permission
