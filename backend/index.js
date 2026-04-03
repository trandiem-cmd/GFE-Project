const { query } = require('./helpers/db');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
//const fileUpload = require('express-fileupload');
const { userRouter } = require('./routes/user.js');
const app = express();

const { contactRouter } = require('./routes/contact');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
//app.use(fileUpload());
const port = process.env.PORT;
app.use('/user',userRouter);
app.use('/contact', contactRouter);
app.get('/',(req,res) => {
  res.json({message: "Hello world"})
});

query('SELECT NOW()')
  .then(res => console.log("DB connected:", res.rows))
  .catch(err => console.error("DB error:", err));
app.listen(port,() => {
  console.log(`Server is listening on port ${port}`)
})
