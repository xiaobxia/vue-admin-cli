import uuid from 'uuid/v1'
import print from 'print-js'
import domImage from '@/utils/domImage'

function deleteRow(node) {
  node.parentNode.removeChild(node)
}

// 打印工具
export default {
  // 打印html
  printHtml(htmlText, config) {
    config = config || {}
    document.getElementsByTagName('html')[0].classList.add('printing')
    const div = document.createElement('div')
    const id = uuid()
    div.id = id
    div.setAttribute('class', '')
    div.innerHTML = `<div>${config.title || ''}${htmlText}</div>`
    document.body.appendChild(div)
    this.$nextTick(() => {
      print({
        printable: id,
        type: 'html',
        targetStyles: ['*'],
        scanStyles: false,
        documentTitle: '',
        style: '@media print {@page {margin: 0;}}' +
          '.is-left{text-align: left;}' +
          '.is-right{text-align: right;}' +
          '.is-center{text-align: center;}' +
          '.print-show{display: block;}' +
          '.print-hidden{display: none;}'
      })
      if (div.remove) {
        div.remove()
      } else {
        deleteRow(div)
      }
      document.getElementsByTagName('html')[0].classList.remove('printing')
    })
  },
  // 转换为canvas打印
  printImage(cid) {
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
}
