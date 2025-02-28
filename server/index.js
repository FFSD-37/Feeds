import express from 'express'
import router from './routes/user.js'
import dotenv from 'dotenv'
import connectToMongo from './Db/connection.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// connectToMongo();
app.use('/',router);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})