import Vue from 'vue'
import moment from 'moment'
import { range } from 'lodash'

function install() {
  Vue.filter('safe-phone', function(value) {
    if (!/\d{11}/.test(value)) {
      return value
    }
    return `${value.substring(0, 3)}****${value.substring(7, 11)}`
  })
  Vue.filter('safe-name', function(value) {
    if (value.length === 2) return `${value.substring(0, 1)}*`
    const stars = range(0, value.length - 2)
      .map(() => '*')
      .join('')
    return `${value.substring(
      0,
      1
    )}${stars}${value.substring(value.length - 1)}`
  })

  Vue.filter('currency', function(v, c) {
    const map = { cn: '¥' }
    return `${map[c]}${v}`
  })

  Vue.filter('dateFormat', function(v, format) {
    const m = moment(v)
    return m.format(format)
  })
  Vue.filter('number', function(v, flag) {
    if (flag) return v > 0 ? `+${v}` : `-${v}`
    return v
  })
  Vue.filter('toInt', function(v, d) {
    return parseInt(v, d || 10)
  })
}
export default install
