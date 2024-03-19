import dotenv from 'dotenv'

dotenv.config()

import express, { Express } from 'express'
import cors from 'cors'
import router from './routes/kanbanRouter'

const app: Express = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', router)

const PORT: number = parseInt(process.env.PORT!) || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
