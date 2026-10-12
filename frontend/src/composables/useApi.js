import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export function useApi() {
  const auth = useAuthStore()

  async function request(method, path, data) {
    const headers = { 'Content-Type': 'application/json' }

    if (auth.token) {
      headers['Authorization'] = `Bearer ${auth.token}`
    }

    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    })

    const json = await response.json().catch(() => ({ message: 'Erro inesperado no servidor' }))

    if (!response.ok) {
      if (response.status === 401) {
        auth.logout()
        router.push('/login')
      }
      const error = new Error(json.message || `Erro ${response.status}`)
      error.status = response.status
      error.retryAfter = response.headers.get('Retry-After')
      throw error
    }

    return json
  }

  return {
    get: (path) => request('GET', path),
    post: (path, data) => request('POST', path, data),
    put: (path, data) => request('PUT', path, data),
    patch: (path, data) => request('PATCH', path, data),
    delete: (path) => request('DELETE', path),
  }
}
