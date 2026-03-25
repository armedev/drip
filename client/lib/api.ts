import axios from 'axios'
import { getGuestId } from './guest'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      config.headers['X-Guest-Id'] = getGuestId()
    }
  }
  return config
})

export default api
