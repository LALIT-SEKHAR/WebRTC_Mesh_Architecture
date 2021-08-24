require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const DATABASE = [];

io.on("connection", (socket) => {
  console.log("\x1b[43m\x1b[30m", " someone connected! ", "\x1b[0m");

  //meet creat and member management
  socket.on("join_meet", (payload) => {
    // if the meetId is Already exist
    if (DATABASE[payload.MeetId]) {
      //if the member is not exist
      if (DATABASE[payload.MeetId].indexOf(socket.id) === -1) {
        DATABASE[payload.MeetId].push(socket.id);
      }
      socket.emit("send_offer", {
        new_member_Id: socket.id,
        MeetParticipant: DATABASE[payload.MeetId].filter(
          (Ids) => Ids !== socket.id
        ),
      });
      console.log("existing meet");
      // socket.broadcast.emit("new_member_connect", {
      //   new_member_Id: socket.id,
      //   MeetParticipant: DATABASE[payload.MeetId].filter(
      //     (Ids) => Ids !== socket.id
      //   ),
      // });
    } else {
      // to create a meetRoom
      console.log("new meet");
      DATABASE[payload.MeetId] = [socket.id];
    }
  });

  socket.on("offer", (payload) => {
    socket
      .to(payload.memberId)
      .emit("offer", { offer: payload.offer, memberId: socket.id });
  });

  socket.on("ice_candidate", (payload) => {
    socket.to(payload.memberId).emit("ice_candidate", {
      ice_candidate: payload.ice_candidate,
      memberId: socket.id,
      sender: payload.memberId,
    });
  });

  socket.on("answer", (payload) => {
    socket.to(payload.memberId).emit("answer", {
      answer: payload.answer,
      memberId: socket.id,
      sender: payload.memberId,
    });
  });

  socket.on("disconnect", (e) => {
    console.log(socket.id);
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});
