import request from '@/utils/request'

const userApi = {
    GetPermissionRoles: '/role-permission/roles',
    GetPermissionPermissions: '/role-permission/permissions',
    EditPermission: roleName => { return `/role-permission/roles/${roleName}` },
    AddPermission: roleName => { return `/role-permission/roles/${roleName}` },
    DelPermission: roleName => { return `/role-permission/roles/${roleName}` }
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

// 新建用户
export function AddPermission (parameter) {
    return request({
        url: userApi.AddPermission(parameter.name),
        method: 'post',
        data: parameter
    })
}

// 删除用户
export function DelPermission (parameter) {
    return request({
        url: userApi.DelPermission(parameter.name),
        method: 'delete',
        data: parameter
    })
}
