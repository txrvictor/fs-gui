import { Router } from 'express'
import system from '../system'

const router = Router()

router.get('/root', async (_, res) => {
  res.send(system.root)
})

export default router
