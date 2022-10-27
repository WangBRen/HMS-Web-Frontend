import request from '@/utils/request'

const customerApi = {
  guidanceRecords: (customerId, diseaseId) => `/customers/${customerId}/${diseaseId}/health-guidances`, // 健康指导记录
  guidanceTemplates: (customerId, diseaseId) => `/customers/${customerId}/chronic-diseases/${diseaseId}/templates`, // 获取指导内容模板
  addNewGuidance: (customerId, diseaseId) => `/customers/${customerId}/${diseaseId}/health-guidances`, // 新建新的指导
  creatGuidance: (customerId, guidanceId) => `/customers/${customerId}/health-guidances/${guidanceId}/create`, // 创建健康指导
  guidanceSendingInfo: (customerId, guidanceId) => `/customers/${customerId}/health-guidances/${guidanceId}/sending-info`,
  ApiSendGuidance: (customerId, guidanceId) => `/customers/${customerId}/health-guidances/${guidanceId}/send`
  }

// 指导记录
export function getGuidanceRecords (customerId, diseaseId, pages) {
  return request({
      url: customerApi.guidanceRecords(customerId, diseaseId),
      method: 'get',
      params: {
          page: pages.page || 1,
          size: pages.size || 10
      }
  })
}

export function getGuidanceTemplates (customerId, diseaseId) {
  return request({
      url: customerApi.guidanceTemplates(customerId, diseaseId),
      method: 'get'
  })
}
// 新建新指导单
export function addNewGuidance (customerId, diseaseId, parameter) {
  return request({
      url: customerApi.addNewGuidance(customerId, diseaseId),
      method: 'post',
      data: parameter
  })
}
export function creatGuidance (customerId, diseaseId) {
  return request({
      url: customerApi.creatGuidance(customerId, diseaseId),
      method: 'post'
  })
}

export function guidanceSendingInfo (customerId, guidanceId) {
  return request({
      url: customerApi.guidanceSendingInfo(customerId, guidanceId),
      method: 'get'
  })
}

export function ApiSendGuidance (customerId, guidanceId, parameter) {
  return request({
      url: customerApi.ApiSendGuidance(customerId, guidanceId),
      method: 'post',
      data: parameter
  })
}
