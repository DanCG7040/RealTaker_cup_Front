import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.DEV 
    ? 'http://localhost:3000' 
    : 'https://tu-api-en-produccion.com',
  withCredentials: true
})

export default api