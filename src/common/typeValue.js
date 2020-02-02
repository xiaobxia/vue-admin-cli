// 基于常量的选择框数据，列表数据格式化
const USER_STATUS_LIST = [
  { value: '0', label: '禁用' },
  { value: '1', label: '启用' }
]
export default {
  USER_STATUS_LIST,
  formatUserStatus(value) {
    for (let i = 0; i < USER_STATUS_LIST.length; i++) {
      const item = USER_STATUS_LIST[i]
      if (item.value === value) {
        return item.label
      }
    }
    return ''
  }
}
