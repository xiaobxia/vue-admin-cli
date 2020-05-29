import store from '../store/index'
const commonData = store.state.common
// 最原始的金额格式化函数
function formatMoneyRaw(str, decimal) {
  let newStr = ''
  let count = 0
  let startCode = ''
  decimal = decimal || 2
  let zero = ''
  for (let i = 0; i < decimal; i++) {
    zero += '0'
  }
  str = str ? '' + str : '0'
  if (str.charAt(0) === '-') {
    str = str.slice(1)
    startCode = '-'
  }
  // 当数字是整数
  if (str.indexOf('.') === -1) {
    for (let i = str.length - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
    str = newStr + `.${zero}`
    // 自动补小数点后两位
    return startCode + str
  } else {
    for (let i = str.indexOf('.') - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr // 逐个字符相接起来
      }
      count++
    }
    str = newStr + (str + zero).substr((str + zero).indexOf('.'), decimal + 1)
    return startCode + str
  }
}

// 转化为数字可以小数点可以负数
function clearToNumber(value) {
  return parseFloat(value) || ''
}

const numberUtil = {
  countRate: function(numerator, denominator) {
    denominator = denominator || 1
    return Math.round(10000 * (numerator / denominator)) / 100
  },
  countDifferenceRate: function(numerator, denominator) {
    denominator = denominator || 1
    numerator = numerator || 1
    return (
      Math.round(1000000 * ((numerator - denominator) / denominator)) / 10000
    )
  },
  keepTwoDecimals: function(number) {
    return Math.round(100 * number) / 100
  },
  toTwoDecimals: function(number) {
    let newNumber = parseFloat(number)
    if (isNaN(newNumber)) {
      newNumber = 0
    }
    return newNumber.toFixed(2)
  },
  keepFourDecimals: function(number) {
    return Math.round(10000 * number) / 10000
  },
  ifAround: function(number, target) {
    const step = 100
    return number >= target - step && number <= target + step
  },
  formatMoneyRaw,
  // 创造金额格式化函数
  createMoneyFormat: function(len) {
    return function(value) {
      return formatMoneyRaw(value, len)
    }
  },
  // 数字转大写
  digitUppercase(n) {
    const fraction = ['角', '分']
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
    const head = n < 0 ? '欠' : ''
    n = Math.abs(n)
    let s = ''
    for (let i = 0; i < fraction.length; i++) {
      s += (
        digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
      ).replace(/零./, '')
    }
    s = s || '整'
    n = Math.floor(n)
    for (let i = 0; i < unit[0].length && n > 0; i++) {
      let p = ''
      for (let j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p
        n = Math.floor(n / 10)
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
    }
    return (
      head +
      s
        .replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整')
    )
  },
  // 转化为数字可以小数点可以负数
  clearToNumber,
  //  转化为数字可以小数点可以负数
  replaceToNumber(row, key) {
    row[key] = clearToNumber(row[key])
  },
  // 转化为数字文本
  clearToTextNumber(value) {
    return value.replace(/[^\d]/g, '')
  },
  // 输入保留设定的小数位数  key：currency:本币  foreign：外币
  handleInputChangeNumber(data, key) {
    let decimalNum = 2
    if (key === 'currency') {
      decimalNum = commonData.sysParam.standardCurrencyDig
    }
    if (key === 'foreign') {
      decimalNum = commonData.sysParam.foreignCurrencyDig
    }
    // 先把非数字的都替换掉(空)，除了数字和.
    data = data.replace(/[^\d.]/g, '')
    // 必须保证第一个为数字而不是.
    data = data.replace(/^\./g, '')
    // 保证只有出现一个.而没有多个.
    data = data.replace(/\.{3,}/g, '')
    // 保证.只出现一次，而不能出现两次以上
    data = data
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
    // 限制几位小数
    data = data
      ? (
        Math.round(data * Math.pow(10, decimalNum)) / Math.pow(10, decimalNum)
      ).toFixed(decimalNum)
      : ''
    return data
  }
}

export default numberUtil
