const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');

const publicPath = path.join(__dirname + '/../public');
const port = process.env.PORT || 8888;

const app = express();
const server = http.createServer(app);


app.use(express.static(publicPath));
const io = socketIO(server);

io.on('connection',(socket)=>{
    console.log('New User Connected');

    socket.broadcast.emit('userConnected',{
        from : 'Admin',
        text : 'New User Connected',
        createdAt : moment().format('h:mm a  Do MMM YYYY')
    });

    socket.on('newMessage', (data,callback)=>{
        console.log(data);

        io.emit('newMessage',data);

        callback();
    });
    
    socket.on('disconnect',()=>{
        console.log('User was disconnected');
        socket.broadcast.emit('userDisconnected',{
            from : 'Admin',
            text : 'A User Was Disconnected',
            createdAt : moment().format('h:mm a  Do MMM YYYY')
        });
    })
})




server.listen(port,()=>{
    console.log(`Server is up on the ${port}`);
})