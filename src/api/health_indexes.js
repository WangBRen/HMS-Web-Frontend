import request from '@/utils/request'

const Api = {
  ListAllIndexes: '/health-indexes',
  CreateIndexItem: (projectName) => `/health-indexes/${projectName}/items`,
  UpdateIndexItem: (projectName, id) => `/health-indexes/${projectName}/items/${id}`,
  CreateProject: (projectName) => `/health-indexes/${projectName}`
}

export function createProject (projectName) {
  return request({
    url: Api.CreateProject(projectName),
    method: 'post'
  })
}

export function listAllIndexes () {
  return request({
    url: Api.ListAllIndexes,
    method: 'get'
  })
}

export function createIndexItem (projectName, payload) {
  return request({
    url: Api.CreateIndexItem(projectName),
    method: 'post',
    data: payload
  })
}

export function updateIndexItem (projectName, itemId, payload) {
  return request({
    url: Api.UpdateIndexItem(projectName, itemId),
    method: 'put',
    data: payload
  })
}
