import axios from 'axios'

const API = axios.create({
  // Empty baseURL → requests go to the Vite dev server,
  // which proxies /api/* to http://localhost:8081 (see vite.config.js).
  // In production set VITE_API_BASE_URL to the deployed backend URL.
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default API
