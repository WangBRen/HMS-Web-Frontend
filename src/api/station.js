import request from '@/utils/request'

const api = {
  addStation: 'health-stations', // 新增小站
  editstation: (id) => `/health-stations/${id}`, // 编辑小站信息
  addManager: (id) => `/health-stations/${id}/manager`,
  addDoctors: (id) => `/health-stations/${id}/doctors`
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
export function addManager (id, parameter) {
  return request({
    url: api.addManager(id),
    method: 'post',
    data: parameter
  })
}
export function addDoctors (id, parameter) {
  return request({
    url: api.addDoctors(id),
    method: 'post',
    data: parameter
  })
}
