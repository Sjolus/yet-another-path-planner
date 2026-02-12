import request from 'supertest'
import app from './app'

describe('API Gateway', () => {
  describe('GET /health', () => {
    it('should return health check response', async () => {
      const res = await request(app).get('/health').expect(200)

      expect(res.body).toEqual({
        status: 'ok',
        service: 'yet-another-path-planner-api-gateway',
        version: expect.any(String),
        timestamp: expect.any(String),
      })
    })

    it('should return a valid ISO timestamp', async () => {
      const res = await request(app).get('/health').expect(200)
      expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp)
    })
  })
})
