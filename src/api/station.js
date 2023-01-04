import request from '@/utils/request'

const api = {
  addStation: 'health-stations', // 新增小站
  editstation: (id) => `/health-stations/${id}`
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
export function getStationInfo (id) {
  return request({
    url: api.editstation(id),
    method: 'get'
  })
}
export function editstation (id, parameter) {
  return request({
    url: api.editstation(id),
    method: 'put',
    data: parameter
  })
}
