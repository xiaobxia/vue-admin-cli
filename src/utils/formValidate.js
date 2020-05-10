export default {
  validatePhone(rule, value, callback) {
    const re = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (!re.test(value)) {
      callback(new Error('格式不正确!'))
    } else {
      callback()
    }
  },
  validateTelephone(rule, value, callback) {
    const re = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
    if (!re.test(value)) {
      callback(new Error('格式不正确!'))
    } else {
      callback()
    }
  },
  validateIdCard(rule, value, callback) {
    const re = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/
    if (!re.test(value)) {
      callback(new Error('格式不正确!'))
    } else {
      callback()
    }
  },
  validateEmail(rule, value, callback) {
    const re = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
    if (!re.test(value)) {
      callback(new Error('格式不正确!'))
    } else {
      callback()
    }
  },
  // 只能是数字,可以00001这样
  validateNumberText(rule, value, callback) {
    const re = /^\d+$/g
    if (!re.test(value)) {
      callback(new Error('必须为数字值!'))
    } else {
      callback()
    }
  }
}
