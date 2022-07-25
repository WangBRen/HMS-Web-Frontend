import request from '@/utils/request'

const customerApi = {
    search: '/groups/search',
    repeat: '/groups/duplicated/',
    addCustomer: value => { return `/groups/${value}/customers` },
    repeatId: value => { return `/groups/duplicated/id_number/${value}` },
    repeatPhone: value => { return `/groups/duplicated/telephone/${value}` }
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
