import { pool } from '../models/User.model.js';
import { saveMessage, updateMessageStatus, deleteMessageFromDB } from '../services/message.service.js';
import jwt from 'jsonwebtoken';
import { secret } from '../config/jwt.js';

export const setupSocket = (server) => {
  import('socket.io').then(({ Server }) => {
    const io = new Server(server);

    // Authentication middleware
    io.use(async (socket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('=')[1];
      if (!token) return next(new Error('Authentication error'));

      try {
        const decoded = jwt.verify(token, secret);
        const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
        socket.user = user[0];
        next();
      } catch (err) {
        next(new Error('Authentication failed'));
      }
    });

    io.on('connection', (socket) => {
      console.log(`User ${socket.user.username} connected`);

      // Join chat room
      socket.on('joinChat', (chatId) => {
        socket.join(chatId);
      });

      // Message handling
      socket.on('sendMessage', async (message) => {
        try {
          await saveMessage(message);
          io.to(message.chatId).emit('receiveMessage', message);
          
          // Notification for users not in chat
          socket.to(message.chatId).emit('notification', {
            chatId: message.chatId,
            message: `New message in ${message.chatId}`
          });
        } catch (err) {
          console.error(err);
        }
      });

      // Message status updates
      socket.on('messageDelivered', async (messageId) => {
        await updateMessageStatus(messageId, 'delivered');
        io.emit('messageStatus', { id: messageId, status: 'delivered' });
      });

      socket.on('messageRead', async (messageId) => {
        await updateMessageStatus(messageId, 'read');
        io.emit('messageStatus', { id: messageId, status: 'read' });
      });

      // Edit/Delete messages
      socket.on('editMessage', async ({ id, newText }) => {
        await pool.query('UPDATE messages SET text = ? WHERE id = ?', [newText, id]);
        io.emit('editMessage', { id, newText });
      });

      socket.on('deleteMessage', async (messageId) => {
        await deleteMessageFromDB(messageId);
        io.emit('deleteMessage', messageId);
      });

      // Typing indicator
      socket.on('typing', (chatId) => {
        socket.to(chatId).emit('typing', {
          senderId: socket.user.id,
          chatId
        });
      });

      socket.on('disconnect', () => {
        console.log(`User ${socket.user.username} disconnected`);
      });
    });
  });
};
