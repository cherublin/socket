// 引入express框架
const express = require('express');
// 引入路径处理模块
const path = require('path');
// web服务器
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];
// 登录拦截
app.get('/', function (req, res) {   
    res.redirect('/login.html')
    res.sendFile(__dirname +'views'+ '/login.html');
})
// 引入静态资源
app.use(express.static(path.join(__dirname, 'views')));
// 允许跨域访问
app.all('*', function(req, res, next) {
    res.header("Content-Type", "text/html;charset=utf-8");
    res.header("Access-Control-Allow-Origin", "http://localhost:8001/");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    next()
})

io.on('connection', function(socket){
    // 当客户端发送信息
    socket.on("sendMessage",function (data) {
        socket.broadcast.emit("receiveMessage",data);
    })
    // 当客户端进入
    socket.on("sendName",function (data) {
        users.push(data)
        // 发送给包括发送者的所有人
        io.sockets.emit("receiveName",users)
    })
    // 当客户端退出
    socket.on('logout', function (x) {
        socket.broadcast.emit("logout",x)
        users.splice(users.indexOf("'"+x+"'"),1)
    })
}) 
// 返回系统监听
http.listen(8001, () => console.log('服务器启动成功'))