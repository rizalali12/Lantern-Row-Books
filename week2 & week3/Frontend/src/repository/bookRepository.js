import apiClient from "../api/apiClient";

const bookRepository = {
  async getBook(params = {}) {
    const response = await apiClient.get('/book', { params })
    return response?.data
  }
}


export default bookRepository
