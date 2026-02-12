import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { version } from '../package.json'

const app: Express = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
)
app.use(express.json())

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'yet-another-path-planner-api-gateway',
    version,
    timestamp: new Date().toISOString(),
  })
})

export default app
