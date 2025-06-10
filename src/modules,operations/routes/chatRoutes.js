import express from 'express';
import {
  createGroupChat,
  createPrivateChat,
  addMember,
  removeMember,
  getUserChats
} from '../controllers/chatController.js';

const router = express.Router();

router.post('/group', createGroupChat);
router.post('/private', createPrivateChat);
router.post('/:chatId/add', addMember);
router.delete('/:chatId/remove/:userId', removeMember);
router.get('/my-chats/:userId', getUserChats);

export default router;