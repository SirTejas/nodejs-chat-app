const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname + '/../public');
const port = process.env.PORT || 8888;

const app = express();
const server = http.createServer(app);


app.use(express.static(publicPath));
const io = socketIO(server);

io.on('connection',(socket)=>{
    console.log('New User Connected');

    socket.broadcast.emit('userConnected',{
        text : 'New User Connected'
    });

    socket.on('newMessage', (data)=>{
        console.log(data);

        socket.broadcast.emit('newMessage',data);
    });
    
    socket.on('disconnect',()=>{
        console.log('User was disconnected');
        socket.broadcast.emit('userDisconnected',{
            text : 'A User Was Disconnected'
        });
    })
})




server.listen(port,()=>{
    console.log(`Server is up on the ${port}`);
})