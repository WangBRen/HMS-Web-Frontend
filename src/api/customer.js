import request from '@/utils/request'

const customerApi = {
    search: '/groups/search',
    searchCustomers: '/groups/search-customers'
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
