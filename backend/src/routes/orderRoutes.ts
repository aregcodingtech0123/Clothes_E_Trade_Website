import express from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
  getLastCompletedOrderDeliveryInfo
} from '../controllers/orderController';
import { authenticate,adminOnly } from '../middlewares/authMiddleware';

const router = express.Router();

//router.use(authenticate);

router.post('/', authenticate,createOrder);
router.get('/user', authenticate,getUserOrders);
router.get('/last-delivery-info', authenticate, getLastCompletedOrderDeliveryInfo);
//router.get('/:id', getOrderById);
router.get('/:id', authenticate, getOrderById);

router.put('/:id/status', authenticate, adminOnly,updateOrderStatus);
router.delete('/:id', authenticate, adminOnly,deleteOrder);
router.get('/', getAllOrders); 

export default router;