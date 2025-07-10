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

    try {
      socket.on("join", (user: string) => {
        if (typeof user !== "string" || !user.trim()) {
          socket.emit("error-message", "Invalid username.");
          return;
        }

        username = user.trim();
        console.log(`${username} joined`);
        socket.emit("history", messages);
        io.emit("system", `${username} joined the chat`);
      });

      socket.on("message", (text: string) => {
        if (typeof text !== "string" || !text.trim()) {
          socket.emit("error-message", "Message must be a non-empty string.");
          return;
        }

        const msg: Message = {
          username,
          text: text.trim(),
          timestamp: new Date().toISOString(),
        };

        messages.push(msg);
        if (messages.length > 20) {
          messages.splice(0, messages.length - 20);
        }
        io.emit("message", msg);
      });

      socket.on("disconnect", () => {
        if (username) {
          console.log(`${username} disconnected`);
          io.emit("system", `${username} left the chat`);
        }
      });
    } catch (err) {
      socket.emit("error-message", "An unexpected error occurred.");
    }
  });

  return httpServer;
}
