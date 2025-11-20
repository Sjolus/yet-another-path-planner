import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3002

app.use(cors())
app.use(express.json())

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'yet-another-path-planner-api-gateway',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  })
})

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`)
})
