const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

app.use(cors());

const http = require("http").Server(app);

const socketIO = require("socket.io")(http, {
  cors: {
    origin: ["https://chat-websocket-xi.vercel.app", "http://localhost:5173"],
  },
});

const users = [];
const messages = [];

socketIO.on("connection", (socket) => {
  console.log(`${socket.id}: user is connected`);

  socket.on("typing", (data) => {
    socket.broadcast.emit("responseTyping", data);
  });

  socket.on("join", (data) => {
    users.push(data);
    socketIO.emit("joined", users);
    socketIO.emit("response", messages);
  });

  socket.on("leave", (data) => {
    users.filter((user) => user.socketID !== data.socketID);
    socketIO.emit("joined", users);
  });

  socket.on("message", (data) => {
    messages.push(data);
    socketIO.emit("response", messages);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id}: user is disconnected`);
  });
});

//test
app.get("/", (req, res) => {
  res.end("Server is already running...");
});

const todos = [
  { id: "1", title: "Learn React" },
  { id: "2", title: "Make awesome app" },
  { id: "3", title: "Drink coffee" },
];

app.get("/todos", (req, res) => {
  res.json(todos);
});
//test

http.listen(PORT, () => {
  console.log(`Server is already run in port ${PORT}`);
});
