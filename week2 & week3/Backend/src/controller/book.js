const bookService = require('../services/book')
const AppError = require('../utils/error')

const getBook = async (req, res, next) => {
  try {
    const { category } = req.query
    const validCategories = ['fiction', 'nonfiction', 'staff_picks']

    if (!validCategories.includes(category)) throw new AppError("Category query is required", 401)
    const result = await bookService.getBook(category)

    res.status(200).json({
      data: result
    });

  } catch (error) {
    next(error)
  }
}

module.exports = { getBook }
