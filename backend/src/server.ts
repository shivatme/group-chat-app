import express from "express";
import http from "http";
import { Server } from "socket.io";

type Message = {
  username: string;
  text: string;
  timestamp: string;
};

const messages: Message[] = [];

export function createServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    let username = "";

    socket.on("join", (user: string) => {
      username = user;
      console.log(`${username} joined`);
      socket.emit("history", messages);
    });

    socket.on("message", (text: string) => {
      if (!text.trim()) return;

      const msg: Message = {
        username,
        text,
        timestamp: new Date().toISOString(),
      };

      messages.push(msg);
      io.emit("message", msg);
    });

    socket.on("disconnect", () => {
      console.log(`${username} disconnected`);
      io.emit("system", `${username} left the chat`);
    });
  });

  return httpServer;
}
