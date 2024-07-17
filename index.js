const express = require("express");
const connectDb = require("./db");
const signinRouter = require("./routes/signinjs");
const loginRouter = require("./routes/loginjs");
const messageRouter = require("./routes/messages");
const userRouter = require("./routes/user");
const app = express();
const port = 4000;
const port2 = 5000;
const cors = require("cors");
const client = require("./redis");
app.use(express.json());
app.use(cors({ origin: "*" }));
const http = require("http");
const { Server } = require("socket.io");

// Create an HTTP server and pass the Express app to it
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

  // Example of emitting an event to a specific room
  socket.on("sendMessageToRoom", ({ roomId, newMessage }) => {
    // Emit the message to all clients in the specified room
    console.log("befor", { newMessage }, { roomId });
    io.to(roomId).emit("roomMessage", {
      actualRoomId: roomId,
      message: newMessage,
    });
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("user disconnected");

    // Find and remove the user from the onlineUsers array
    const index = onlineUsers.indexOf(socket.id);
    if (index > -1) {
      onlineUsers.splice(index, 1); // Remove one item only
    }

    // Decrement the online user count
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
  // connecting to redis server
  await client.connect();
}
connectDb();
connectRedis();
// app.use("/home", signinRouter);

app.post("/check", async (req, res) => {
  const data = await req.body;
  console.log(data);

  res.send("ok fine");
});

app.use("/signin", signinRouter);
app.use("/login", loginRouter);
app.use("/message", messageRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
server.listen(port2, () => {
  console.log(`server listening on port ${port2}`);
});
