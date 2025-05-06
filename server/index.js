import express from 'express'
import router from './routes/user.js'
import dotenv from 'dotenv'
import path from 'path' 
import { cookieParser, parseCookieString } from 'cookie-string-parser';
import connectToMongo from './Db/connection.js';
import channelRouter from './routes/channel.js';
import notificationRouter from './routes/notification.js';
import post from './routes/userPost.js'
import channelPost from './routes/channelPost.js'
import { Server } from 'socket.io';
import http from 'http'
import User from './models/users_schema.js';
import Chat from './models/chatSchema.js';
dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.set('views',path.resolve('../view/html'));
app.use(express.static(path.resolve('../view')));
connectToMongo();
app.use(cookieParser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/',router);
app.use('/post', post);
app.use('/channel', channelRouter);
app.use('/notification', notificationRouter);
app.use('/', channelPost);

const server=http.createServer(app);
const io=new Server(server);

io.use((socket, next) => {
  const cookie=socket.handshake.headers.cookie;
  const parsedCookie=parseCookieString(cookie);

  const user=verify_JWTtoken(parsedCookie.uuid, process.env.USER_SECRET);
  socket.userId=user[0];
  socket.img=user[2];
  next();
});

io.on('connection', async(socket) => {
  console.log('a user connected');
  await User.findOneAndUpdate({username: socket.userId}, {socketId: socket.id});

  socket.on('send', async(data) => {
    try{
    const { username, message } = data;
    await Chat.create({ sender: socket.userId, receiver: username, message });
    const {socketId}=await User.findOne({username: username}).populate('socketId');
    socket.to(socketId).emit('recv', { username: socket.userId, message });
    }
    catch(err){
      console.log(err);
    }
  })
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen('8000', () => {
  console.log('Chat server running on port 8000');
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})