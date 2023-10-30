import request from '@/utils/request'

const api = {
  deviceReport: 'device-reports/-1/all',
  reportDetail: (reportId) => `device-reports/-1/${reportId}`
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
