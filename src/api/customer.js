import request from '@/utils/request'

const customerApi = {
    searchCustomerUnderGroup: '/groups/search',
    searchCustomers: '/groups/search-customers',
    createCustomerJoinGroup: groupId => { return `/groups/${groupId}/customers/append-many` },
    removeCustomerJoinGroup: (groupId, customerId) => `/groups/${groupId}/customers/${customerId}/remove`,
    repeat: '/groups/duplicated/',
    addCustomer: value => { return `/groups/${value}/customers` },
    healthReports: customerId => { return `/health-reports/${customerId}/reports` },
    editInfoGroupCustomer: (groupId, customerId) => `/groups/${groupId}/customers/${customerId}`, // 编辑用户信息
    updatePhone: (groupId, customerId) => `/groups/${groupId}/customers/${customerId}/phone`,
    UserCode: phone => { return `/mailbox/phone/${phone}/valid-code` },
    ChronicManage: customerId => { return `/customers/${customerId}/chronic-diseases` }, // 获取该患者的所有慢病
    editCustomerChronicDiseases: (customerId, diseaseId) => `/customers/${customerId}/chronic-diseases/${diseaseId}`,
    // 获取慢病指标历史记录
    getCustomerChronicIndex: (customerId, diseaseId) => `/customers/${customerId}/chronic-diseases/${diseaseId}/indexes`,
    makeDiagnosed: (customerId, diseaseId) => `/customers/${customerId}/chronic-diseases/${diseaseId}/make-diagnosed`,
    makeUnexpected: (customerId, diseaseId) => `/customers/${customerId}/chronic-diseases/${diseaseId}/make-unexpected`,
    getChronicDetail: (customerId, diseaseId) => `/customers/${customerId}/chronic-diseases/${diseaseId}`,
    getChronic: `/groups/search-customers-disease`, // 获取得过的慢病
    healthHistory: (customerId) => `/customers/${customerId}/history` // 健康史
}

export function searchCustomerUnderGroup (values, pages) {
    return request({
        url: customerApi.searchCustomerUnderGroup,
        method: 'get',
        params: {
            word: values || '',
            createdBy: pages.createdBy || '',
            page: pages.page || 1,
            size: pages.size || 10,
            groupId: pages.groupId
        }
    })
}

export function searchCustomers (values, pages) {
    return request({
        url: customerApi.searchCustomers,
        method: 'get',
        params: {
            word: values || '',
            page: pages.page || 1,
            size: pages.size || 10
        }
    })
}

export function createGroupCustomer (groupId, customersId) {
    return request({
        url: customerApi.createCustomerJoinGroup(groupId),
        method: 'put',
        data: {
            customerIds: customersId || []
        }
    })
}

export function removeCustomerGroup (groupId, customersId) {
    return request({
        url: customerApi.removeCustomerJoinGroup(groupId, customersId),
        method: 'put'
    })
}

export function customerRepeat (field, parameter) {
    return request({
        url: customerApi.repeat + field + '/' + parameter,
        method: 'get'
    })
}

export function customerAdd (value, params) {
    return request({
        url: customerApi.addCustomer(value),
        method: 'post',
        data: params
    })
}

export function gethealthReports (customerId, pages) {
    return request({
        url: customerApi.healthReports(customerId),
        method: 'get',
        params: {
            page: pages.page || 1,
            size: pages.size || 10
        }
    })
}

export function editGroupCustomer (groupId, customerId, params) {
    return request({
        url: customerApi.editInfoGroupCustomer(groupId, customerId),
        method: 'put',
        data: params
    })
}

// 手机验证码
export function getCode (phone) {
    return request({
      url: customerApi.UserCode(phone),
      method: 'post'
    })
 }

export function updatePhone (groupId, customerId, phoneForm) {
    return request({
        url: customerApi.updatePhone(groupId, customerId),
        method: 'put',
        data: phoneForm
    })
}

export function getChronicManage (customersId) {
    return request({
        url: customerApi.ChronicManage(customersId),
        method: 'get'
    })
}

export function editCustomerChronicDiseases (customerId, diseaseId, params) {
    return request({
        url: customerApi.editCustomerChronicDiseases(customerId, diseaseId),
        method: 'put',
        data: params
    })
}
export function getCustomerChronicIndex (customerId, diseaseId) {
    return request({
        url: customerApi.getCustomerChronicIndex(customerId, diseaseId),
        method: 'get'
    })
}

export function makeDiagnosed (customerId, diseaseId, params) {
    return request({
        url: customerApi.makeDiagnosed(customerId, diseaseId),
        method: 'post',
        data: params
    })
}

export function makeUnexpected (customerId, diseaseId) {
    return request({
        url: customerApi.makeUnexpected(customerId, diseaseId),
        method: 'post'
    })
}
export function getChronicDetail (customerId, diseaseId) {
  return request({
      url: customerApi.getChronicDetail(customerId, diseaseId),
      method: 'get'
  })
}
export function getChronic (pages) {
  return request({
      url: customerApi.getChronic,
      method: 'get',
      params: {
        page: pages.page || 1,
        size: pages.size || 20
    }
  })
}
export function submitHealthHistory (customerId, params) {
  return request({
      url: customerApi.healthHistory(customerId),
      method: 'post',
      data: params
  })
}
export function getHealthHistory (customerId) {
  return request({
      url: customerApi.healthHistory(customerId),
      method: 'get'
  })
}
