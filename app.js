const express = require("express");
const app = express();
const port = process.env.PORT || 7777;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
//몽고디비 연결 
mongoose.connect("mongodb://localhost/anstnsp", {useNewUrlParser : true});


//post데이터 읽기 위해
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use("/user", require("./router/user"));




app.listen(port, err =>{
  if(err) console.log(err);
  else console.log("Server is running at 7777 port!!");
})

