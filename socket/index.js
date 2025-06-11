export const setupSocket = (server) => {
  import('socket.io').then(({ Server }) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });

      // Example: Handle real-time messages
      socket.on('sendMessage', (data) => {
        io.emit('receiveMessage', data);
      });
    });
  });
};
