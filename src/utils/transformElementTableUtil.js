// 判断该列是否打印
function ifPrint(td) {
  return td.className.indexOf('el-table-column--selection') === -1 &&
    td.className.indexOf('no-print') === -1
}

// 获取子单元格
function getSubCell(tr) {
  let len = 0
  const indexList = []
  const tds = tr.querySelectorAll('td')
  tds.forEach((td, index) => {
    if (ifPrint(td)) {
      const subLen = td.querySelectorAll('.sub-cell').length
      if (subLen) {
        len = subLen
        indexList.push(index)
      }
    }
  })
  if (len) {
    return {
      len,
      indexList
    }
  } else {
    return false
  }
}

export default {
  // 把element的表格转为普通表格
  elementTableToNormal(id) {
    const target = document.querySelector('#' + id)
    // 表头
    let theadHtml = '<thead>'
    const theadTrs = target.querySelectorAll('.el-table__header-wrapper .el-table__header thead tr')
    theadTrs.forEach((tr) => {
      let trHtml = '<tr>'
      const ths = tr.querySelectorAll('th')
      ths.forEach((th, index) => {
        // 有内容并且不是checkbox
        if (ifPrint(th)) {
          const cssText = th.style.cssText
          trHtml += `<th
class="${th.className}"
rowspan="${th.rowSpan || 1}"
colspan="${th.colSpan || 1}"
style="${cssText}line-height: 2.5em;font-weight: bold;padding:0 10px;font-weight: bold;border-width: ${index === 0 ? '1px' : '1px 1px 1px 0'}; border-style: solid; border-color: #bbb"
>${th.innerText}</th>`
        }
      })
      trHtml += '</tr>'
      theadHtml += trHtml
    })
    theadHtml += '</thead>'
    // 表体
    let tbodyHtml = '<tbody>'
    const tbodyTrs = target.querySelectorAll('.el-table__body-wrapper tbody .el-table__row')
    tbodyTrs.forEach((tr) => {
      let trHtml = '<tr>'
      const tds = tr.querySelectorAll('td')
      tds.forEach((td, index) => {
        // 不需要有内容
        if (ifPrint(td)) {
          const cssText = td.style.cssText
          trHtml += `<td
class="${td.className}"
rowspan="${td.rowSpan || 1}"
colspan="${td.colSpan || 1}"
 style="${cssText}line-height: 2.5em;padding:0 10px; border-width: ${index === 0 ? '0 1px 1px 1px' : '0 1px 1px 0'}; border-style: solid; border-color: #bbb">${td.innerText}</td>`
        }
      })
      trHtml += '</tr>'
      tbodyHtml += trHtml
    })
    // 表尾
    const footerTrs = target.querySelectorAll('.el-table__footer-wrapper .el-table__footer tr')
    footerTrs.forEach((tr) => {
      let trHtml = '<tr>'
      const tds = tr.querySelectorAll('td')
      tds.forEach((td, index) => {
        // 不需要有内容
        if (ifPrint(td)) {
          const cssText = td.style.cssText
          trHtml += `<td
class="${td.className}"
rowspan="${td.rowSpan || 1}"
colspan="${td.colSpan || 1}"
 style="${cssText}line-height: 2.5em;padding:0 10px; border-width: ${index === 0 ? '0 1px 1px 1px' : '0 1px 1px 0'}; border-style: solid; border-color: #bbb">${td.innerText}</td>`
        }
      })
      trHtml += '</tr>'
      tbodyHtml += trHtml
    })
    // 加载标体上
    tbodyHtml += '</tbody>'
    return `<table style="width: 100%" border="1" cellspacing="0">${theadHtml}${tbodyHtml}</table>`
  },
  // 把element的表格转为普通表格，包含子单元格
  elementTableToNormalWidthSubCell(id) {
    const target = document.querySelector('#' + id)
    // 表头
    let theadHtml = '<thead>'
    const theadTrs = target.querySelectorAll('.el-table__header-wrapper .el-table__header thead tr')
    theadTrs.forEach((tr) => {
      let trHtml = '<tr>'
      const ths = tr.querySelectorAll('th')
      ths.forEach((th, index) => {
        // 有内容并且不是checkbox
        if (ifPrint(th)) {
          const cssText = th.style.cssText
          trHtml += `<th
class="${th.className}"
rowspan="${th.rowSpan || 1}"
colspan="${th.colSpan || 1}"
style="${cssText}line-height: 2.5em;font-weight: bold;padding:0 10px;font-weight: bold;border-width: ${index === 0 ? '1px' : '1px 1px 1px 0'}; border-style: solid; border-color: #bbb"
>${th.innerText}</th>`
        }
      })
      trHtml += '</tr>'
      theadHtml += trHtml
    })
    theadHtml += '</thead>'
    // 表体
    let tbodyHtml = '<tbody>'
    const tbodyTrs = target.querySelectorAll('.el-table__body-wrapper tbody .el-table__row')
    tbodyTrs.forEach((tr) => {
      let trHtml = '<tr>'
      const tds = tr.querySelectorAll('td')
      let rowSpan = 0
      let subIndexList = []
      const subCellInfo = getSubCell(tr)
      // 有子单元格
      if (subCellInfo) {
        rowSpan = subCellInfo.len
        subIndexList = subCellInfo.indexList
      }
      tds.forEach((td, index) => {
        let innerText = td.innerText
        let subRowSpan = rowSpan || td.rowSpan || 1
        // 有子单元格
        if (subIndexList.indexOf(index) !== -1) {
          innerText = td.querySelectorAll('.sub-cell')[0].innerText
          subRowSpan = 1
        }
        // 不需要有内容
        if (ifPrint(td)) {
          const cssText = td.style.cssText
          trHtml += `<td
class="${td.className}"
rowspan="${subRowSpan}"
colspan="${td.colSpan || 1}"
 style="${cssText}line-height: 2.5em;padding:0 10px; border-width: ${index === 0 ? '0 1px 1px 1px' : '0 1px 1px 0'}; border-style: solid; border-color: #bbb">${innerText}</td>`
        }
      })
      trHtml += '</tr>'
      tbodyHtml += trHtml
      // 有子单元格
      let subHtml = ''
      if (rowSpan) {
        for (let i = 1; i < rowSpan; i++) {
          subHtml += '<tr>'
          tds.forEach((td, index) => {
            let innerText = td.innerText
            // 有子单元格
            if (subIndexList.indexOf(index) !== -1) {
              innerText = td.querySelectorAll('.sub-cell')[i].innerText
              // 不需要有内容
              if (td.className.indexOf('el-table-column--selection') === -1 && td.className.indexOf('no-print') === -1) {
                const cssText = td.style.cssText
                subHtml += `<td
class="${td.className}"
rowspan="1"
colspan="${td.colSpan || 1}"
 style="${cssText}line-height: 2.5em;padding:0 10px; border-width: ${index === 0 ? '0 1px 1px 1px' : '0 1px 1px 0'}; border-style: solid; border-color: #bbb">${innerText}</td>`
              }
            }
          })
          subHtml += '</tr>'
        }
      }
      tbodyHtml += subHtml
    })
    // 表尾
    const footerTrs = target.querySelectorAll('.el-table__footer-wrapper .el-table__footer tr')
    footerTrs.forEach((tr) => {
      let trHtml = '<tr>'
      const tds = tr.querySelectorAll('td')
      tds.forEach((td, index) => {
        // 不需要有内容
        if (ifPrint(td)) {
          const cssText = td.style.cssText
          trHtml += `<td
class="${td.className}"
rowspan="${td.rowSpan || 1}"
colspan="${td.colSpan || 1}"
 style="${cssText}line-height: 2.5em;padding:0 10px; border-width: ${index === 0 ? '0 1px 1px 1px' : '0 1px 1px 0'}; border-style: solid; border-color: #bbb">${td.innerText}</td>`
        }
      })
      trHtml += '</tr>'
      tbodyHtml += trHtml
    })
    // 加载标体上
    tbodyHtml += '</tbody>'
    return `<table style="width: 100%" border="1" cellspacing="0">${theadHtml}${tbodyHtml}</table>`
  }
}
