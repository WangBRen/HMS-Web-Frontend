import request from '@/utils/request'

const customerApi = {
    search: '/groups/search',
    repeat: '/groups/duplicated/',
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

// export function customerIdRepeat (parameter) {
//     return request({
//         url: customerApi.repeatId(parameter),
//         method: 'get'
//     })
// }

// export function customerPhoneRepeat (parameter) {
//     return request({
//         url: customerApi.repeatPhone(parameter),
//         method: 'get'
//     })
// }

export function customerRepeat (field, parameter) {
    return request({
        url: customerApi.repeat + field + '/' + parameter,
        method: 'get'
    })
}
