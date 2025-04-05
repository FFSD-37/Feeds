import express from 'express'
import router from './routes/user.js'
import dotenv from 'dotenv'
import path from 'path' 
import { cookieParser } from 'cookie-string-parser';
import connectToMongo from './Db/connection.js';
import postRouter from './routes/post.js'
import channelRouter from './routes/channel.js'
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
app.use('/post',postRouter);
app.use('/channel', channelRouter)
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})