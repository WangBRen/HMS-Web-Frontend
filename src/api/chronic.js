import request from '@/utils/request'

const api = {
  addChronic: 'chronic-diseases'
}

export function addChronic (parameter) {
  return request({
    url: api.addChronic,
    method: 'post',
    data: parameter
  })
}
