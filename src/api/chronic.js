import request from '@/utils/request'

const api = {
  addChronic: 'chronic-diseases',
  getChronic: 'chronic-diseases',
  editChronic: diseaseId => { return 'chronic-diseases/' + diseaseId },
  getSpeechList: diseaseId => { return `chronic-diseases/${diseaseId}/templates` },
  editSpeech: diseaseId => { return `chronic-diseases/${diseaseId}/templates` },
  getSpeechVariables: diseaseId => { return `chronic-diseases/${diseaseId}/template-variables` },
  editChronicIndex: diseaseId => { return `chronic-diseases/${diseaseId}/items` },
  getOneChronic: diseaseId => { return `chronic-diseases/${diseaseId}` }
}

export function addChronic (parameter) {
  return request({
    url: api.addChronic,
    method: 'post',
    data: parameter
  })
}

export function getChronic (pages) {
  return request({
    url: api.getChronic,
    method: 'get',
    params: {
      page: pages.page || 1,
      size: pages.size || 10
    }
  })
}
export function editChronic (diseaseId, parameter) {
  return request({
    url: api.editChronic(diseaseId),
    method: 'put',
    data: parameter
  })
}
export function getSpeechList (diseaseId) {
  return request({
    url: api.getSpeechList(diseaseId),
    method: 'get'
  })
}

export function editSpeech (diseaseId, parameter) {
  return request({
    url: api.editSpeech(diseaseId),
    method: 'put',
    data: parameter
  })
}

export function getSpeechVariables (diseaseId) {
  return request({
    url: api.getSpeechVariables(diseaseId),
    method: 'get'
  })
}

export function editChronicIndex (diseaseId, parameter) {
  return request({
    url: api.editChronicIndex(diseaseId),
    method: 'post',
    data: parameter
  })
}

export function getOneChronic (diseaseId) {
  return request({
    url: api.getOneChronic(diseaseId),
    method: 'get'
  })
}
