import {
  createGroupChat as createGroup,
  createPrivateChat as createPrivate,
  addMember as add,
  removeMember as remove,
  getUserChats as getChats,
  getChatMessages as getMessages
} from '../services/chatService.js';

export const createGroupChat = async (req, res) => {
  try {
    const { name, memberIds } = req.body;
    const createdBy = req.user.id;
    const chatId = await createGroup(name, memberIds, createdBy);
    res.status(201).json({ chatId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPrivateChat = async (req, res) => {
  try {
    const { user2 } = req.body;
    const user1 = req.user.id;
    const chatId = await createPrivate(user1, user2);
    res.status(201).json({ chatId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    await add(req.params.chatId, userId);
    res.status(200).json({ message: 'Member added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    await remove(req.params.chatId, req.params.userId);
    res.status(200).json({ message: 'Member removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const chats = await getChats(req.user.id);
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const messages = await getMessages(req.params.chatId, limit, offset);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
