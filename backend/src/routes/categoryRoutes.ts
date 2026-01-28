import express from 'express'
import { authenticate, adminOnly } from '../middlewares/authMiddleware'
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController'

const router = express.Router()

router.get('/', getAllCategories)
router.get('/:slug', getCategoryBySlug)

// Admin-only routes
router.post('/', authenticate, adminOnly, createCategory)
router.put('/:id', authenticate, adminOnly, updateCategory)
router.delete('/:id', authenticate, adminOnly, deleteCategory)

export default router