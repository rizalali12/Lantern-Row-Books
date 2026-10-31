const eventModels = require('../models/event')
const AppError = require('../utils/error')

const getEventData = async (category) => {
  if (category === 'all') {
    const data = await eventModels.getAllEvent()
    return data
  }
  const uppercaseCategory = category.charAt(0).toUpperCase() + category.slice(1);

  const validCategory = ['Book club', 'Event']
  if (validCategory.includes(uppercaseCategory)) {
    const data = await eventModels.getCategoryEvent(uppercaseCategory)
    return data
  }

  throw new AppError('Category not found', 400)

}

module.exports = { getEventData }
