// src/routes/contactRoutes.ts
import { Router } from 'express';
import {
  createContactMessage,
  getContactMessages,
  getMessageById,
  deleteMessage
} from '../controllers/contactController';

const router = Router();

// Create a new contact message
router.post('/', createContactMessage);

// Get all contact messages with optional filtering
router.get('/', getContactMessages);

// Get a specific message by ID
router.get('/:id', getMessageById);

// Delete a message
router.delete('/:id', deleteMessage);

export default router;