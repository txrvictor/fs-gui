import { Router } from 'express'

const router = Router()

router.get('/files', async (_, res) => {
  res.send({
    id: 12345,
    type: 'folder',
  })
})

export default router
