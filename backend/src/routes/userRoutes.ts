import express from 'express'
import { authenticate, adminOnly } from '../middlewares/authMiddleware'
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
  createUser
} from '../controllers/userController'


const router = express.Router()

//router.use(authenticate)
//router.get('/', adminOnly, getAllUsers)
router.get('/me', authenticate,getCurrentUser); // <-- Bu en üstte olmalı
router.post('/', createUser) // BU SATIR EKSİK OLABİLİR

router.get('/', getAllUsers)
router.get('/:id', getUserById)
//router.get('/me', authenticate,getCurrentUser);

router.put('/:id', updateUser)
//router.delete('/:id', adminOnly,deleteUser)
router.delete('/:id',deleteUser)

export default router