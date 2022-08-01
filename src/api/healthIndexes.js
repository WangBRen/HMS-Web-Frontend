import request from '@/utils/request'

const api = {
  getHealthIndexes: `health-indexes`
}
export function gethealthIndexes () {
  return request({
    url: api.getHealthIndexes,
    method: 'get'
  })
}
