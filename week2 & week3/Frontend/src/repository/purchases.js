import apiClient from "../api/apiClient";

const purchasesRepository = {
  async getBookData() {
    const data = await apiClient.get('/purchases/my-purchases')

    return data?.data
  },

  async createCheckout(bookId) {
    const response = await apiClient.post('/purchases/checkout', { bookId })

    return response?.data
  }
}

export default purchasesRepository
