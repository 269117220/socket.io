var express = require('express');
var app = express();
var path = require("path");

app.use(express.static(path.join(__dirname, 'public')));


// app.get('/',function(req,res){
//  res.sendFile('./index.html',{root:__dirname});
// });
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var index = 0;
var chatIndex = 0;
var users = [];
var clubUsers = [];
io.on('connection', function(socket) {
    index = users.length;
    socket.send("user" + index);
    socket.userName = "user" + index;
    socket.userIndex = index;
    users.push("user" + index);
    io.sockets.emit("num", users.length + "\n");
    socket.on('disconnect', function() {
        users.splice(socket.userIndex, 1);
        clubUsers.pop();
        io.sockets.emit("system", socket.userName + "下线");
        io.sockets.emit("num", users.length + "\n");
    });
    socket.on('join', function() {
        clubUsers.push(socket.userName);
        socket.join('family');
        io.sockets.emit("joinSuccess", { room: "family", num: clubUsers.length, info: socket.userName });
    });
    socket.on('sentAll', function(data) {
        io.sockets.emit("showAllInfo", socket.userName + " : " + data);
    });
    socket.on('sentRoom', function(data) {
        console.log(data);
        io.sockets.in('family').emit("showRoomInfo", socket.userName + " : " + data);
        // io.sockets.in('group1').emit('event_name', data);
    });

});
// io.of("/chat").on('connection', function(socket) {
//     socket.send((chatIndex) + "user进入房间！");
//     console.log("123");
//     chatIndex++;
//     index++;
//     io.sockets.emit("num", index);
//     io.sockets.in('chat').emit("currnum", chatIndex);

// });
server.listen(3000);
