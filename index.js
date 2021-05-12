const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  io.emit('connected');
  let onlineUsers = {};

  // This file will be read on new socket connections
  require('./chat.js')(io, socket);
  //socket listeners
  socket.on('new user', (username) => {
    console.log(`${username} has joined the chat!`);
   })

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    console.log('message: ', msg);
  });
  socket.on('disconnect', () => {
    io.emit('disconnected');
  });
  socket.on('typing', (msg) =>{
    io.emit('typing', msg)
  });
})

server.listen(3001, () => {
  console.log('listening on *:3000');
});