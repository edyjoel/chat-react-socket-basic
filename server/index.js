import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";
import { PORT, ORIGIN } from "./config.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: ORIGIN
  },
});


app.use(cors());
app.use(morgan("dev"));
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("message", (message) => {
    console.log("Message received: " + message);
    socket.broadcast.emit("message", {
      body: message,
      from: socket.id,
    });
  });
});

app.use(express.static(join(__dirname, "../client/build")));

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});