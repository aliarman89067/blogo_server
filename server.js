import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";

const PORT = process.env.PORT || 4000;
const app = express();
dotenv.config();
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World");
});
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CONNECTION_ORIGIN,
    credentials: true,
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  socket.join(socket.id);
  console.log(socket.id);
  socket.on("friend-request", ({ socketId, id, name, image }) => {
    socket.broadcast.emit("request-response", { id, image, name });
  });
  socket.on("message-send", ({ socketId, data }) => {
    socket.broadcast.emit("message-response", data);
  });
});
server.listen(PORT, () => {
  console.log("app is running on port ", PORT);
});
