const express = require("express");
const connectDb = require("./db");
const signinRouter = require("./routes/signinjs");
const loginRouter = require("./routes/loginjs");
const messageRouter = require("./routes/messages");
const userRouter = require("./routes/user");
const app = express();
const cors = require("cors");
const client = require("./redis");
const http = require("http");
const { Server } = require("socket.io");

const port = process.env.PORT || 4000; // Use Render's dynamic PORT variable

app.use(express.json());
app.use(cors({ origin: "*" }));

// Create a single HTTP server for both Express and Socket.IO
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

var onlineUsers = [];
var onlineUserCount = 0;
var Rooms = [];

// Socket.IO logic
io.on("connection", (socket) => {
  socket.on("user", (data) => {
    console.log("user connected", data.user._id || data.user.id);
    const _id = data.user._id || data.user.id;
    const CheckOnlineuser = onlineUsers.includes(_id);
    if (!CheckOnlineuser) {
      onlineUsers.push(_id);
    }
    onlineUserCount += 1;
    console.log("connected", { onlineUsers }, { onlineUserCount }, { Rooms });
    const users = [data.user, data.chatPatner];
    const parterId = data.chatPatner?._id;
    const checkUser = onlineUsers.includes(parterId);

    if (checkUser) {
      const roomId = getRoomForUsers(users);
      const checkRoom = Rooms.includes(roomId);
      if (!checkRoom) {
        socket.join(roomId);
        socket.emit("joinedRoom", { success: true, RoomId: roomId });
        console.log(`joined room ${roomId}`);
      }
    }
  });

  socket.on("sendMessageToRoom", ({ roomId, newMessage }) => {
    console.log("before", { newMessage }, { roomId });
    io.to(roomId).emit("roomMessage", {
      actualRoomId: roomId,
      message: newMessage,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const index = onlineUsers.indexOf(socket.id);
    if (index > -1) {
      onlineUsers.splice(index, 1);
    }
    onlineUserCount -= 1;
    console.log("disconnected", { onlineUsers }, { onlineUserCount });
  });
});

const getRoomForUsers = (users) => {
  return users
    .map((user) => user._id)
    .sort()
    .join("_");
};

async function connectRedis() {
  await client.connect();
}

connectDb();
connectRedis();

app.use("/signin", signinRouter);
app.use("/login", loginRouter);
app.use("/message", messageRouter);
app.use("/user", userRouter);

app.post("/check", async (req, res) => {
  const data = req.body;
  console.log(data);
  res.send("ok fine");
});

// Start the merged server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
