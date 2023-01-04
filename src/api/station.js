import request from '@/utils/request'

const api = {
  addStation: 'health-stations' // 新增小站
}

export function addStation (parameter) {
  return request({
    url: api.addStation,
    method: 'post',
    data: parameter
  })
}

export function getStations (parameter) {
  return request({
    url: api.addStation,
    method: 'get',
    data: parameter
  })
}
