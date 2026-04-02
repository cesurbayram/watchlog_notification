import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import "dotenv/config";

const app = express();

const PORT = process.env.NOTIFICATION_SOCKET_PORT || 4001;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} user connected!`);

  socket.on("disconnect", () => {
    console.log("A user disconnected!");
  });
});

const broadcastNotification = (notification: unknown) => {
  io.emit("new_notification", notification);
};

app.use(express.json());
app.post("/notify", (req, res) => {
  const notification = req.body;
  console.log("notification", notification);
  broadcastNotification(notification);
  res.status(200).json({ success: true });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
