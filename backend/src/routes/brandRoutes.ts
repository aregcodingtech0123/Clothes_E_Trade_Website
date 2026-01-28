import express from 'express'
import { authenticate, adminOnly } from '../middlewares/authMiddleware'
import {
  getAllBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand
} from '../controllers/brandController'

const router = express.Router()

router.get('/', getAllBrands)
router.get('/:slug', getBrandBySlug)

// Admin-only routes
router.post('/', authenticate, adminOnly, createBrand)
router.put('/:id', authenticate, adminOnly, updateBrand)
router.delete('/:id', authenticate, adminOnly, deleteBrand)

export default router