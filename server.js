var http=require("http");
var express=require("express");//引入express
var socketIo=require("socket.io");//引入socket.io
var app=new express();
var server=http.createServer(app);
var io=new socketIo(server);//将socket.io注入express模块
//客户端 1 的访问地址
app.get("/client1",function (req,res,next) {
    res.sendFile(__dirname+"/views/client1.html");
})
app.get("/client2",function (req,res,next) {
    res.sendFile(__dirname+"/views/client2.html");
})
server.listen(8080);//express 监听 8080 端口，因为本机80端口已被暂用
//每个客户端socket连接时都会触发 connection 事件
io.on("connection",function (clientSocket) {
    // socket.io 使用 emit(eventname,data) 发送消息，使用on(eventname,callback)监听消息
    //监听客户端发送的 sendMsg 事件
    clientSocket.on("sendMsg",function (data) {
        // data 为客户端发送的消息，可以是 字符串，json对象或buffer
        // 使用 emit 发送消息，broadcast 表示 除自己以外的所有已连接的socket客户端。
        clientSocket.broadcast.emit("receiveMsg", data);
    })

    // 进入房间处理
    clientSocket.on('joinToRoom', function (data) {
        // ......
        // 服务端处理进入房间、离开房间
        clientSocket.join(data.roomId)
        // // 有人进入房间，向该群其它的成员发送更新在线成员
        io.sockets.in(data.roomId).emit('joinToRoom', data)
        io.sockets.in(data.roomId).emit('updateGroupNumber', 5)
    })
    // 进入房间处理
    clientSocket.on('leaveRoom', function (data, fn) {
        // ......
        // 服务端处理进入房间、离开房间
        clientSocket.leave(data.roomId)
        fn(data)
        // // 有人进入房间，向该群其它的成员发送更新在线成员
    })
});

const nsp = io.of('/my-namespace');
nsp.on('connection', function(socket){
    socket.emit("mysendMsg", "my-namespace发送消息123")
});


