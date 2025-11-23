
import { Socket, Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

export default function socketApp(server: HTTPServer) {
  const io = new SocketServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket'],
  });

  io.on('connection', (socket: Socket) => {
    // Call Socket Instances here e.g. new ChatSocket(socket, io);
  });

  return io;
}
    