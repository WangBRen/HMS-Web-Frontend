import request from '@/utils/request'

const api = {
  addChronic: 'chronic-diseases',
  getChronic: 'chronic-diseases'
}

export function addChronic (parameter) {
  return request({
    url: api.addChronic,
    method: 'post',
    data: parameter
  })
}

export function getChronic () {
  return request({
    url: api.getChronic,
    method: 'get'
  })
}
