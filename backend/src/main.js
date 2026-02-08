import 'dotenv/config'
import { createServer } from 'node:http'
import { toNodeListener } from 'h3'
import app from './server/app.js'

const port = process.env.PORT || 3000

createServer(toNodeListener(app)).listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`)
})
