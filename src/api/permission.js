import request from '@/utils/request'

const userApi = {
    GetPermissionRoles: '/role-permission/roles',
    GetPermissionPermissions: '/role-permission/permissions'
}

export function GetPermissionRoles () {
    return request({
        url: userApi.GetPermissionRoles,
        method: 'get'
    })
}

export function GetPermissionPermissions () {
    return request({
        url: userApi.GetPermissionPermissions,
        method: 'get'
    })
}
