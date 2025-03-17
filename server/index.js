import express from 'express'
import router from './routes/user.js'
import dotenv from 'dotenv'
import path from 'path' 
dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.set('views',path.resolve('../view/html'));
app.use(express.static(path.resolve('../view')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/',router);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})