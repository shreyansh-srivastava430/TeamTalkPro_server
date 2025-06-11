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
    const chatId = await createGroup(req.body.name, req.body.memberIds, req.body.createdBy);
    res.status(201).json({ chatId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPrivateChat = async (req, res) => {
  try {
    const chatId = await createPrivate(req.body.user1, req.body.user2);
    res.status(201).json({ chatId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addMember = async (req, res) => {
  try {
    await add(req.params.chatId, req.body.userId);
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
    const chats = await getChats(req.params.userId);
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const messages = await getMessages(req.params.chatId);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
