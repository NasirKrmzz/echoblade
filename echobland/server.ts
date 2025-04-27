import { Server } from 'socket.io';

const io = new Server(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map<string, Set<string>>();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Oda oluşturma
  socket.on('createRoom', () => {
    const roomId = generateRoomId();
    rooms.set(roomId, new Set([socket.id]));
    socket.join(roomId);
    socket.emit('roomCreated', roomId);
    console.log(`Room created: ${roomId}`);
  });

  // Odaya katılma
  socket.on('joinRoom', (roomId: string) => {
    if (!rooms.has(roomId)) {
      socket.emit('roomError', 'Room does not exist');
      return;
    }

    const room = rooms.get(roomId);
    if (room && room.size >= 2) {
      socket.emit('roomError', 'Room is full');
      return;
    }

    room?.add(socket.id);
    socket.join(roomId);
    socket.emit('roomJoined', roomId);
    io.to(roomId).emit('newPeer', socket.id);
    console.log(`Client ${socket.id} joined room ${roomId}`);
  });

  // Diğer sinyalleme olayları
  socket.on('offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('offer', offer);
  });

  socket.on('answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('answer', answer);
  });

  socket.on('iceCandidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('iceCandidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Odalardan çıkar
    rooms.forEach((clients, roomId) => {
      if (clients.has(socket.id)) {
        clients.delete(socket.id);
        if (clients.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });
});

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

console.log('Signaling server running on port 3001'); 