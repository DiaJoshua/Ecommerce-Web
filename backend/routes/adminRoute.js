// adminRoute.js
import express from 'express';
import {
  signup,
  login,
  getAdminById,
  updateAdmin,
} from '../controllers/adminController.js'; // Ensure correct import

const router = express.Router();

// Uncomment this line if you have a signup route
router.post('/signup', signup); // Add this line if signup is needed
router.post('/login', login);
router.get('/admin/:id', getAdminById);
router.patch('/editadmin/:id', updateAdmin);

export default router; // Use export default for ES modules
