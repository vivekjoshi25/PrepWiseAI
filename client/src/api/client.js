import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL?.trim() || ''

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('prepwise_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('prepwise_token')
      window.dispatchEvent(new Event('prepwise:unauthorized'))
    }
    return Promise.reject(err)
  },
)
