import request from '@/utils/request'

const userApi = {
    GetPermissionRoles: '/role-permission/roles',
    GetPermissionPermissions: '/role-permission/permissions',
    EditPermission: roleName => { return `/role-permission/roles/${roleName}` }
    // EditPermission: '/role-permission/roles'
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

// 编辑修改权限
export function EditPermission (parameter) {
    return request({
        url: userApi.EditPermission(parameter.name),
        method: 'put',
        data: parameter
    })
}
