import express from 'express'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByBrand,
  getDiscountedProducts
} from '../controllers/productController'
import { authenticate, adminOnly } from '../middlewares/authMiddleware'

const router = express.Router()

// Public routes
router.get('/', getAllProducts)
router.get('/discounted', getDiscountedProducts)
router.get('/category/:categorySlug', getProductsByCategory)
router.get('/brand/:brandSlug', getProductsByBrand)
router.get('/:id', getProductById)

// Admin only routes
router.use(authenticate, adminOnly)
router.post('/', authenticate, adminOnly,createProduct)
router.put('/:id', authenticate, adminOnly,updateProduct)
router.delete('/:id', authenticate, adminOnly,deleteProduct)

export default router

