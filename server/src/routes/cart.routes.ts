import { Router } from 'express'
import { get, add, update, remove, merge, clear } from '../controllers/cart.controller'
import { authMiddleware, requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.use(authMiddleware)
router.get('/', get)
router.post('/', add)
router.post('/merge', requireAuth, merge)
router.delete('/', clear)
router.patch('/:productId', update)
router.delete('/:productId', remove)
export default router
