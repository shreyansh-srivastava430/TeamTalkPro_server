import db from './shared/config/db.js';


const chatSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('join-chat', (chatId) => {
      socket.join(`chat-${chatId}`);
    });

    socket.on('send-message', async ({ chatId, senderId, content }) => {
      const message = { chatId, senderId, content, createdAt: new Date() };
      await db.execute(
        'INSERT INTO messages (chat_id, sender_id, content) VALUES (?, ?, ?)',
        [chatId, senderId, content]
      );
      io.to(`chat-${chatId}`).emit('receive-message', message);
    });
  });
};

export default chatSocket;