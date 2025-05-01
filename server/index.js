import express from 'express'
import router from './routes/user.js'
import dotenv from 'dotenv'
import path from 'path' 
import { cookieParser } from 'cookie-string-parser';
import connectToMongo from './Db/connection.js';
import channelRouter from './routes/channel.js';
import notificationRouter from './routes/notification.js';
import post from './routes/userPost.js'
import channelPost from './routes/channelPost.js'
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
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})