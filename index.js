const express= require('express');
const app= express();
const port = process.env.PORT || '3000'
const home = require('./routes/home')
const auth =require('./routes/auth');

// const conn = require('./config');
const bodyParser = require("body-parser");
// const errorController = require('./controllers/error');
// const cors = require('cors');

const path = require('path');
// app.use(cors());
// require('./db/connectDB');

require("dotenv").config();
const mysql = require('mysql2')
const conn = mysql.createConnection({
  host : process.env.host,
  user :  process.env.user,
  password :  process.env.password,
  database :  process.env.database,
  port:3307
});

conn.connect((error)=>{
  if(error){
    console.log(error);
  }
  else{
    console.log("database connected")
  }
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use('/',home);
app.use('/user',auth);
app.listen(port,()=>{
  console.log (`[OK] server started on port  ${port}`);
})