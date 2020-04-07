function formatNum(str, len) {
  let newStr = ''
  let count = 0
  let startCode = ''
  len = len || 2
  let zero = ''
  for (let i = 0; i < len; i++) {
    zero += '0'
  }
  str = '' + str
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
    str = newStr + (str + zero).substr((str + zero).indexOf('.'), len + 1)
    return startCode + str
  }
}
const numberUtil = {
  countRate: function(numerator, denominator) {
    denominator = denominator || 1
    return Math.round(10000 * (numerator / denominator)) / 100
  },
  countDifferenceRate: function(numerator, denominator) {
    denominator = denominator || 1
    numerator = numerator || 1
    return Math.round(1000000 * ((numerator - denominator) / denominator)) / 10000
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
    return (number >= (target - step)) && (number <= (target + step))
  },
  formatMoney(number) {
    return formatNum(number, 2)
  },
  // 数字转大写
  digitUppercase(n) {
    const fraction = ['角', '分']
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    const unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟']
    ]
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
  // 只能是数字
  replaceNoNumber(value) {
    // 修复第一个字符是小数点 的情况.
    if (value !== '' && value.substr(0, 1) === '.') {
      value = ''
    }
    value = value.replace(/^0*(0\.|[1-9])/, '$1') // 解决 粘贴不生效
    value = value.replace(/[^-\d.]/g, '') // 清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
    value = value
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
    if (value.indexOf('.') < 0 && value !== '') {
      // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      if (value.substr(0, 1) === '0' && value.length === 2) {
        value = value.substr(1, value.length)
      }
    }
    return value
  },
  // 只能是数字串
  replaceToNumberStr(value) {
    return value.replace(/[^\d]/g, '')
  }
}

export default numberUtil
