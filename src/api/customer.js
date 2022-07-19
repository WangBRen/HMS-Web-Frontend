import request from '@/utils/request'

const customerApi = {
    search: '/groups/search'
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
