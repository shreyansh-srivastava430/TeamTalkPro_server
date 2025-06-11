// 📁 server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import chatRoutes from './src/modules,operations/routes/chatRoutes.js';
import chatSocket from './src/socket.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

app.use('/api/chats', chatRoutes);

chatSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
