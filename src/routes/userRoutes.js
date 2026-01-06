import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  createUser,
  deleteUser
} from '../controllers/userController.js';
import { authenticateToken, requireAdmin, requireManagerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Routes accessible by manager and admin
router.get('/', requireManagerOrAdmin, getAllUsers);
router.get('/:id', requireManagerOrAdmin, getUserById);

// Routes accessible only by admin
router.post('/', requireAdmin, createUser);
router.put('/:id/role', requireAdmin, updateUserRole);
router.delete('/:id', requireAdmin, deleteUser);

export default router;
