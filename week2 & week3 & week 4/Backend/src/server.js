
const env = require('./config/config')
const app = require('./app')

const port = env.serverPort

app.listen(port, () => {
  console.log(`Server running at localhost:${port}`)
})
