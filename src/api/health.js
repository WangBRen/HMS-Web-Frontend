import request from '@/utils/request'

const customerApi = {
    healthIndex: '/health-indexes', // 获取健康指标
    healthDis: diseaseId => { return `/health-diseases/${diseaseId}/children` }, // 疾病诊断
    healthReport: customerId => { return `/health-reports/${customerId}/reports` }, // 新建检测报告
    healthCustomerReport: '/health-reports/'
}

// 获取健康指标
export function getHealthIndex () {
    return request({
        url: customerApi.healthIndex,
        method: 'get'
    })
}

// 疾病诊断
export function gethealthDis (diseaseId) {
    return request({
        url: customerApi.healthDis(diseaseId),
        method: 'get'
    })
}

// 新建检测报告
export function addHealthReport (customerId, parameter) {
    return request({
        url: customerApi.healthReport(customerId),
        method: 'post',
        data: parameter
    })
}

// 查看健康报告
export function getHealthCustomerReport (customerId, reportId) {
    return request({
        url: customerApi.healthCustomerReport + customerId + '/reports/' + reportId
    })
}

export function getHealthReport (customerId) {
    return request({
        url: customerApi.healthReport(customerId),
        method: 'get'
    })
}
