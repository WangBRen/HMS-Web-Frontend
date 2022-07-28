import request from '@/utils/request'

const Api = {
  ListAllIndexes: '/health-indexes'
}

export function listAllIndexes () {
  return request({
    url: Api.ListAllIndexes,
    method: 'get'
  })
}
