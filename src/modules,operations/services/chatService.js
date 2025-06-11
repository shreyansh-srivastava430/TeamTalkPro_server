import db from '../../shared/config/db.js';

export const createGroupChat = async (name, memberIds, createdBy) => {
  const [result] = await db.execute(
    'INSERT INTO chats (is_group, name, created_by) VALUES (1, ?, ?)',
    [name, createdBy]
  );
  const chatId = result.insertId;
  await db.execute(
    'INSERT INTO chat_members (chat_id, user_id, role) VALUES (?, ?, "admin")',
    [chatId, createdBy]
  );
  for (let userId of memberIds) {
    if (userId !== createdBy)
      await db.execute(
        'INSERT INTO chat_members (chat_id, user_id) VALUES (?, ?)',
        [chatId, userId]
      );
  }
  return chatId;
};

export const createPrivateChat = async (user1, user2) => {
  const [existing] = await db.execute(
    'SELECT id FROM chats WHERE is_group = 0 AND id IN (SELECT chat_id FROM chat_members WHERE user_id = ?) AND id IN (SELECT chat_id FROM chat_members WHERE user_id = ?)',
    [user1, user2]
  );
  if (existing.length) return existing[0].id;

  const [result] = await db.execute('INSERT INTO chats (is_group, created_by) VALUES (0, ?)', [user1]);
  const chatId = result.insertId;
  await db.execute(
    'INSERT INTO chat_members (chat_id, user_id) VALUES (?, ?), (?, ?)',
    [chatId, user1, chatId, user2]
  );
  return chatId;
};

export const addMember = (chatId, userId) => {
  return db.execute('INSERT INTO chat_members (chat_id, user_id) VALUES (?, ?)', [chatId, userId]);
};

export const removeMember = (chatId, userId) => {
  return db.execute('DELETE FROM chat_members WHERE chat_id = ? AND user_id = ?', [chatId, userId]);
};

export const getUserChats = async (userId) => {
  const [chats] = await db.execute(
    `SELECT c.id, c.name, c.is_group, GROUP_CONCAT(u.username) as members
     FROM chats c
     JOIN chat_members cm ON c.id = cm.chat_id
     JOIN users u ON cm.user_id = u.id
     WHERE c.id IN (SELECT chat_id FROM chat_members WHERE user_id = ?)
     GROUP BY c.id`,
    [userId]
  );
  return chats;
};

export const getChatMessages = async (chatId, limit = 50, offset = 0) => {
  const [messages] = await db.execute(
    'SELECT m.id, m.content, m.created_at, u.username FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.chat_id = ? ORDER BY m.created_at DESC LIMIT ? OFFSET ?',
    [chatId, limit, offset]
  );
  return messages;
};