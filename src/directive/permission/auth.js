import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const { funAuth } = store.state.user

    if (value && !funAuth[value]) {
      el.parentNode && el.parentNode.removeChild(el)
    } else {
      // throw new Error('请填写权限名称')
    }
  }
}
