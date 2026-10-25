import apiClient from "../api/apiClient";

const userRepository = {
  async getUser() {
    const response = await apiClient.get("/users/me")
    return response?.data
  },

  async register(payload) {
    const response = await apiClient.post("/users/register", payload)
    return response?.data
  },

  async login(payload) {
    const response = await apiClient.post("/users/login", payload)
    return response?.data
  },

  async logout(payload) {
    const response = await apiClient.post("/users/logout", payload)
    return response?.data
  },
}

export default userRepository
