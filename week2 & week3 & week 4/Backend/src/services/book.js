const bookModels = require('../models/book')


const getBook = async (category) => {
  const result = await bookModels.getByCategory(category)

  return result

}

module.exports = { getBook }
