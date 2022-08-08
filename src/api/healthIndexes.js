import request from '@/utils/request'

const api = {
  getHealthIndexes: `health-indexes`
}
export function getHealthIndexes () {
  return request({
    url: api.getHealthIndexes,
    method: 'get'
  })
}
