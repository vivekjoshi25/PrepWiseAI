import { api } from './client'

export function createInterview(role) {
  return api.post('/api/interviews/create', { role })
}

export function getMyInterviews() {
  return api.get('/api/interviews/my')
}

export function submitInterview(id, answers) {
  return api.put(`/api/interviews/submit/${id}`, { answers })
}
