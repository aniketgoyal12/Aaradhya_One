import { Server } from "socket.io";

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Pujaris join their geographical delivery zone room (Phase 3)
    socket.on("join-zone", (zoneName) => {
      if (zoneName) {
        const room = `zone:${zoneName}`;
        socket.join(room);
        console.log(`[Socket.io] Socket ${socket.id} joined ${room}`);
      }
    });

    // Support ticket chat rooms (Phase 4)
    socket.on("join-ticket", (ticketId) => {
      if (ticketId) {
        const room = `ticket:${ticketId}`;
        socket.join(room);
        console.log(`[Socket.io] Socket ${socket.id} joined support room ${room}`);
      }
    });

    socket.on("leave-ticket", (ticketId) => {
      if (ticketId) {
        const room = `ticket:${ticketId}`;
        socket.leave(room);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};
