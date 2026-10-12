export default defineEventHandler((event) => {
  setResponseHeader(event, 'Access-Control-Allow-Origin', '*')
  setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (getMethod(event) === 'OPTIONS') {
    setResponseStatus(event, 204)
    return ''
  }
})
