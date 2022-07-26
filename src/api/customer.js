import request from '@/utils/request'

const customerApi = {
    searchCustomerUnderGroup: '/groups/search',
    searchCustomers: '/groups/search-customers',
    createCustomerJoinGroup: groupId => { return `/groups/${groupId}/customers/append-many` },
    removeCustomerJoinGroup: (groupId, customerId) => `/groups/${groupId}/customers/${customerId}/remove`
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
