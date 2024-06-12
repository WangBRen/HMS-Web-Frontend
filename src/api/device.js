import request from '@/utils/request'

const api = {
  allReport: 'device-reports/-1/all', // 全部报告
  groupReport: (groupId) => `device-reports/${groupId}`, // 家庭下的全部报告
  deviceReport: (groupId, deviceId) => `device-reports/${groupId}/bydevice/${deviceId}`, // 单台设备下的全部报告
  reportDetail: (reportId) => `device-reports/-1/${reportId}`,
  getProducts: 'products',
  getDevice: (productId) => `products/${productId}/devices`,
  unbindDevice: (deviceId) => `products/${deviceId}`,
  changeshizhiNum: (deviceId, shizhinum) => `wechat/home/{groupId}/devices/${deviceId}/set?set=shizhinum,${shizhinum}`,
  groupDevice: (groupId) => `wechat/home/${groupId}/devices`
}

export function getDeviceReport (pages, mode, type) {
  return request({
    url: api.allReport,
    method: 'get',
    params: {
      mode,
      type,
      page: pages.page || 1,
      size: pages.size || 10
    }
  })
}
export function groupReport (pages, mode, type, groupId) {
  return request({
    url: api.groupReport(groupId),
    method: 'get',
    params: {
      mode,
      type,
      page: pages.page || 1,
      size: pages.size || 10
    }
  })
}
export function deviceReport (pages, mode, type, groupId, deviceId) {
  return request({
    url: api.deviceReport(groupId, deviceId),
    method: 'get',
    params: {
      mode,
      type,
      page: pages.page || 1,
      size: pages.size || 10
    }
  })
}
export function groupDevice (groupId) {
  return request({
    url: api.groupDevice(groupId),
    method: 'get'
  })
}

export function reportDetail (reportId) {
  return request({
    url: api.reportDetail(reportId),
    method: 'get'
  })
}

export function getProducts (pages) {
  return request({
    url: api.getProducts,
    method: 'get',
    params: {
      page: pages.page || 1,
      size: pages.size || 10
    }
  })
}

export function getDevice (pages, productId, uuid, name) {
  return request({
    url: api.getDevice(productId),
    method: 'get',
    params: {
      page: pages.page || 0,
      size: pages.size || 10,
      uuid,
      name,
      order: 'desc'
    }
  })
}
export function unBindDevice (deviceId) {
  return request({
    url: api.unbindDevice(deviceId),
    method: 'delete'
  })
}
export function changeshizhiNum (deviceId, shizhinum) {
  return request({
    url: api.changeshizhiNum(deviceId, shizhinum),
    method: 'put'
  })
}
