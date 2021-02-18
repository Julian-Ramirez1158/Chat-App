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



io.on('connection', (socket) => {
    socket.on('join', ({room, name}, callback) => {
        const {error, client} = addClient({id: socket.id, name, room});

        if(error) return callback(error);

        socket.emit('message', {client: 'admin', text: `${client.name}, Welcome to the chat ${client.room}!`});
        socket.broadcast.to(client.room).emit('message', {client: 'admin', text: `${client.name} has joined the chat!`});


        socket.join(client.room);

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const client = getClient(socket.id);

        io.to(client.room).emit('message', {client: client.name, text: message});

        callback();
    });
    
    socket.on('disconnect', () => {
        console.log('user has left');
    })
})

app.use(router);

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));