import config from "../config";
import { verifyAccessToken } from "../utils/jwt";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server;

export function getIO(): Server {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: config.corsOrigin.split(","),
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error("Authentication required"));

    try {
      const decoded = verifyAccessToken(token as string);
      (socket as any).user = decoded;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = (socket as any).user;
    if (!user) {
      socket.disconnect();
      return;
    }

    socket.join(`user:${user.userId}`);

    if (user.role === "manage") {
      socket.join("manage");
    }

    socket.on("disconnect", () => {});
  });
}

export function emitToUser(userId: string, event: string, data: any) {
  const srv = getIO();
  srv.to(`user:${userId}`).emit(event, data);
}

export function emitToManage(event: string, data: any) {
  const srv = getIO();
  srv.to("manage").emit(event, data);
}
