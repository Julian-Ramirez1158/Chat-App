const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const {addClient, removeClient, getClient, getClientsInRoom} = require('./clients.js')

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
      origin: "*",
    },
  });

app.use(router);

io.on('connection', (socket) => {
    socket.on('join', ({ name, room}, callback) => {
        const {error, client} = addClient({id: socket.id, name, room});

        if(error) return callback(error);


        socket.emit('message', {client: 'admin', text: `${client.name}, Welcome to chat: ${client.room}!`});
        socket.broadcast.to(client.room).emit('message', {client: 'admin', text: `${client.name} has joined the chat!`});


        socket.join(client.room);

        io.to(client.room).emit('roomData', {room: client.room, clients: getClientsInRoom(client.room)})

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const client = getClient(socket.id);

        io.to(client.room).emit('message', {client: client.name, text: message});
        io.to(client.room).emit('roomData', {room: client.room, clients: getClientsInRoom(client.room)});

        callback();
    });
    
    socket.on('disconnect', () => {
        const client = removeClient(socket.id);

        if(client) {
            io.to(client.room).emit('message', {client: 'admin', text: `${client.name} has left the chat.`})
        }
    })
})



server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));