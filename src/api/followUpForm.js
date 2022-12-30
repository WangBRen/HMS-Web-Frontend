import request from '@/utils/request'

const customerApi = {
    FollowRecords: (customerId, diseaseId) => `/customers/${customerId}/${diseaseId}/followup-forms`,
    newFollowUpForm: (customerId) => `/customers/${customerId}/followup-forms`, // 新增随访单
    idempotentToken: '/base/idempotent-token', // 获取token
    FormSendingInfo: (customerId, formId) => `/customers/${customerId}/followup-forms/${formId}/sending-info`,
    PreviewForm: (customerId, formId) => `/customers/${customerId}/followup-forms/${formId}/preview-info`, // 预览随访单
    SendForm: (customerId, formId) => `/customers/${customerId}/followup-forms/${formId}/send`, // 发送随访单
    SendLevel: (customerId, diseaseId) => `/customers/${customerId}/chronic-diseases/${diseaseId}/levels`, // 分级
    abandonFollowForm: (customerId, formId) => { return `/customers/${customerId}/followup-forms/${formId}/destroy` }, // 废弃随访单
    createFollowForm: (customerId, formId) => `/customers/${customerId}/followup-forms/${formId}/create`, // 创建随访单
    showFollowForm: (customerId, formId) => `/customers/${customerId}/followup-forms/${formId}`,
    allFollowForm: (customerId, diseaseId) => `customers/${customerId}/${diseaseId}/followup-forms/all` // 某一慢病下所有的随访单
  }

// 随访记录
export function getFollowRecords (customerId, diseaseId, pages) {
  return request({
      url: customerApi.FollowRecords(customerId, diseaseId),
      method: 'get',
      params: {
          page: pages.page || 1,
          size: pages.size || 10
      }
  })
}

// 创建随访单
export function addNewFollowUpForm (customerId, parameter) {
  return request({
      url: customerApi.newFollowUpForm(customerId),
      method: 'post',
      data: parameter
  })
}
// 获取token
export function getToken () {
  return request({
      url: customerApi.idempotentToken,
      method: 'get'
  })
}
// 获取随访单待发送信息
export function getFormSendingInfo (customerId, formId) {
  return request({
      url: customerApi.FormSendingInfo(customerId, formId),
      method: 'get'
  })
}
// 预览随访单
export function getPreviewForm (customerId, formId) {
  return request({
    url: customerApi.PreviewForm(customerId, formId),
    method: 'get'
  })
}
// 发送随访单
export function ApiSendForm (customerId, formId, parameter) {
  return request({
    url: customerApi.SendForm(customerId, formId),
    method: 'post',
    data: parameter
  })
}
// 分级
export function formLevels (customerId, diseaseId, parameter) {
  return request({
    url: customerApi.SendLevel(customerId, diseaseId),
    method: 'post',
    data: parameter
  })
}
// 废弃随访单
export function abandonFollow (customerId, formId) {
  return request({
      url: customerApi.abandonFollowForm(customerId, formId),
      method: 'put'
  })
}

export function postFormCreated (customerId, formId) {
  return request({
    url: customerApi.createFollowForm(customerId, formId),
    method: 'post'
  })
}
export function showFollowForm (customerId, formId) {
  return request({
    url: customerApi.showFollowForm(customerId, formId),
    method: 'get'
  })
}
export function allFollowForm (customerId, diseaseId) {
  return request({
    url: customerApi.allFollowForm(customerId, diseaseId),
    method: 'get'
  })
}
