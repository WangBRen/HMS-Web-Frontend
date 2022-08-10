import request from '@/utils/request'

const customerApi = {
    searchCustomerUnderGroup: '/groups/search',
    searchCustomers: '/groups/search-customers',
    createCustomerJoinGroup: groupId => { return `/groups/${groupId}/customers/append-many` },
    removeCustomerJoinGroup: (groupId, customerId) => `/groups/${groupId}/customers/${customerId}/remove`,
    repeat: '/groups/duplicated/',
    addCustomer: value => { return `/groups/${value}/customers` },
    healthReports: customerId => { return `/health-reports/${customerId}/reports` },
    editInfoGroupCustomer: (groupId, customerId) => `/groups/${groupId}/customers/${customerId}`// 编辑用户信息
}

export function searchCustomerUnderGroup (values, pages) {
    return request({
        url: customerApi.searchCustomerUnderGroup,
        method: 'get',
        params: {
            word: values || '',
            page: pages.page || 1,
            size: pages.size || 10
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
