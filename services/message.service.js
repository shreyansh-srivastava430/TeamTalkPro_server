import { pool } from '../models/User.model.js';

const saveMessage = async (message) => {
  const { id, senderId, chatId, type, text, mediaUrl, fileName, timestamp, status } = message;
  await pool.query(
    `INSERT INTO messages 
    (id, senderId, chatId, type, text, mediaUrl, fileName, timestamp, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, senderId, chatId, type, text, mediaUrl, fileName, timestamp, status]
  );
};

const updateMessageStatus = async (messageId, status) => {
  await pool.query(
    'UPDATE messages SET status = ? WHERE id = ?',
    [status, messageId]
  );
};

const deleteMessageFromDB = async (messageId) => {
  await pool.query('DELETE FROM messages WHERE id = ?', [messageId]);
};

export { saveMessage, updateMessageStatus, deleteMessageFromDB };
