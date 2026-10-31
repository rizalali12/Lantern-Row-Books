import apiClient from "../api/apiClient";

const eventRepository = {
  async getEvent(params = {}) {
    const result = await apiClient.get('/event', { params })
    return result?.data
  }
}

export default eventRepository
