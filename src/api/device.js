import request from '@/utils/request'

const api = {
  deviceReport: 'device-reports/-1/all',
  reportDetail: (reportId) => `device-reports/-1/${reportId}`,
  getProducts: 'products',
  getDevice: (productId) => `products/${productId}/devices`
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

export function getDevice (pages, productId) {
  return request({
    url: api.getDevice(productId),
    method: 'get',
    params: {
      page: pages.page || 1,
      size: pages.size || 10
    }
  })
}
