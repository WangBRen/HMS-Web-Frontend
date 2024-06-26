import request from '@/utils/request'

const api = {
  addStation: 'health-stations', // 新增小站
  editstation: (id) => `/health-stations/${id}`, // 编辑小站信息
  addManager: (id) => `/health-stations/${id}/manager`,
  addDoctors: (id) => `/health-stations/${id}/doctors`,
  addAppointment: (id) => `/health-stations/${id}/appointment`, // 新增预约
  getAppointments: (id) => `/health-stations/${id}/appointments`, // 新增预约
  editAppointment: (id, bookingId) => `/health-stations/${id}/appointment/${bookingId}`, // 更新预约记录
  deleteDoctor: (id, doctorId) => `/health-stations/${id}/doctor/${doctorId}`,
  signInAppointment: (id, bookingId) => `/health-stations/${id}/appointment/${bookingId}/checkin`,
  addDevice: (id) => `/health-stations/${id}/device`, // 新增设备
  delDevice: (id, deviceId) => `/health-stations/${id}/device/${deviceId}`, // 删除设备
  getDevice: (id) => `/health-stations/${id}/devices`, // 查询设备
  editDevice: (id, deviceId) => `/health-stations/${id}/device/${deviceId}` // 编辑设备
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
// 创建一次预约
export function addAppointment (id, parameter) {
  return request({
    url: api.addAppointment(id),
    method: 'post',
    data: parameter
  })
}
// 获取当前小站的全部预约记录
export function getAppointments (id) {
  return request({
    url: api.getAppointments(id),
    method: 'get'
  })
}
// 更新预约记录
export function putAppointment (id, bookingId, parameter) {
  return request({
    url: api.editAppointment(id, bookingId),
    method: 'put',
    data: parameter
  })
}
// 删除预约记录
export function deleteAppointment (id, bookingId) {
  return request({
    url: api.editAppointment(id, bookingId),
    method: 'delete'
  })
}
// 删除健康师
export function deleteDoctor (id, doctorId) {
  return request({
    url: api.deleteDoctor(id, doctorId),
    method: 'delete'
  })
}
// 预约签到或取消推迟
export function signInAppointment (id, bookingId, parameter) {
  return request({
    url: api.signInAppointment(id, bookingId),
    method: 'post',
    data: parameter
  })
}

// 新建设备
export function addDevice (id, parameter) {
  return request({
    url: api.addDevice(id),
    method: 'post',
    data: parameter
  })
}

export function delDevice (id, deviceId) {
  return request({
    url: api.delDevice(id, deviceId),
    method: 'delete'
  })
}

// 获取小站设备
export function getDevice (id) {
  return request({
    url: api.getDevice(id),
    method: 'get'
  })
}

// 编辑设备
export function editDevice (id, deviceId, parameter) {
  return request({
    url: api.editDevice(id, deviceId),
    method: 'put',
    data: parameter
  })
}
