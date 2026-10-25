import axios from "axios";
console.log("API URL", import.meta.env.VITE_API_URL)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default apiClient
