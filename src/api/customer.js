import request from '@/utils/request'

const customerApi = {
    search: '/groups/search',
    searchCustomers: '/groups/search-customers',
    createCustomerJoinGroup: groupId => { return `/groups/${groupId}/customers/append-many` },
    removeCustomerJoinGroup: '/groups/'
}

export function customerSearch (values, pages) {
    return request({
        url: customerApi.search,
        method: 'get',
        params: {
            word: values || '',
            page: pages.page || 1,
            size: pages.size || 10
        }
    })
}

export function addCustomerSearch (values, pages) {
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

export function createCustomerG (groupId, customersId) {
    return request({
        url: customerApi.createCustomerJoinGroup(groupId),
        method: 'put',
        data: {
            customerIds: customersId || []
        }
    })
}

export function removeCustomerG (groupId, customersId) {
    return request({
        url: customerApi.removeCustomerJoinGroup + groupId + '/customers/' + customersId + '/remove',
        method: 'put'
    })
}
