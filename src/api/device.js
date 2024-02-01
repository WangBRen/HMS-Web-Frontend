import request from '@/utils/request'

const api = {
  deviceReport: 'device-reports/-1/all',
  reportDetail: (reportId) => `device-reports/-1/${reportId}`,
  getProducts: 'products',
  getDevice: (productId) => `products/${productId}/devices`,
  unbindDevice: (deviceId) => `products/${deviceId}`,
  changeshizhiNum: (deviceId, shizhinum) => `wechat/home/{groupId}/devices/${deviceId}/set?set=shizhiNum,${shizhinum}`
}

export function getDeviceReport (pages, mode, type) {
  return request({
    url: api.deviceReport,
    method: 'get',
    params: {
      mode,
      type,
      page: pages.page || 1,
      size: pages.size || 10
    }
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
      name
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
