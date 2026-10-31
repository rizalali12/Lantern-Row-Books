const eventService = require('../services/event')


const getEventData = async (req, res, next) => {
  try {
    const { category } = req.query
    const data = await eventService.getEventData(category)

    res.status(200).json({
      data: data
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getEventData }
