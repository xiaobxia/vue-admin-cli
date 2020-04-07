import moment from 'moment'
export default {
  formatToDay(day) {
    if (!day) {
      return ''
    }
    return moment(day).format('YYYY-MM-DD')
  },
  formatToYear(day) {
    if (!day) {
      return ''
    }
    return moment(day).format('YYYY')
  },
  formatToMonth(day) {
    if (!day) {
      return ''
    }
    return moment(day).format('MM')
  }
}
