const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');
const {isRealString} = require('./../public/utils/validation');

const publicPath = path.join(__dirname + '/../public');
const port = process.env.PORT || 8888;

const app = express();
const server = http.createServer(app);


app.use(express.static(publicPath));
const io = socketIO(server);

io.on('connection',(socket)=>{
    console.log('New User Connected');
    

    socket.on('join', (params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room name should be a valid string');
        }
        callback();

        socket.join(params.room);

        socket.emit('serverMessage',{
            from : 'Admin',
            text : `Welcome to Chat App. You are in room ${params.room}`,
            createdAt : moment().format('h:mm a  Do MMM YYYY')
        });

        socket.broadcast.to(params.room).emit('userConnected',{
            from : 'Admin',
            text : `${params.name} Connected to room ${params.room}`,
            createdAt : moment().format('h:mm a  Do MMM YYYY')
        });

        socket.on('newMessage', (data,callback)=>{
            console.log(data);
    
            io.to(params.room).emit('newMessage',data);
    
            callback();
        });

        socket.on('disconnect',()=>{
            console.log('User was disconnected');
            socket.broadcast.to(params.room).emit('userDisconnected',{
                from : 'Admin',
                text : `${params.name} Was Disconnected from room ${params.room}`,
                createdAt : moment().format('h:mm a  Do MMM YYYY')
            });
        });
    })

    // socket.broadcast.emit('userConnected',{
    //     from : 'Admin',
    //     text : 'New User Connected',
    //     createdAt : moment().format('h:mm a  Do MMM YYYY')
    // });

    // socket.on('newMessage', (data,callback)=>{
    //     console.log(data);

    //     io.emit('newMessage',data);

    //     callback();
    // });
    
    // socket.on('disconnect',()=>{
    //     console.log('User was disconnected');
    //     socket.broadcast.emit('userDisconnected',{
    //         from : 'Admin',
    //         text : 'A User Was Disconnected',
    //         createdAt : moment().format('h:mm a  Do MMM YYYY')
    //     });
    // });
})




server.listen(port,()=>{
    console.log(`Server is up on the ${port}`);
})