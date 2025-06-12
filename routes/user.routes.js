 import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);

export default router;
