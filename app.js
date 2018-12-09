const express = require("express");
const app = express();
const port = process.env.PORT || 7777;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const methodOverriide = require("method-override");

//DB Setting
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/anstnsp", {useNewUrlParser : true});
const db = mongoose.connection;
db.once('open', ()=>{
  console.log("DB connected!!");
});
db.on("error", (err)=>{
  console.log("DB ERROR :", err);
});


//static폴더 지정
app.use(express.static(__dirname + "/publiic"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
console.log(__dirname+"\views");
app.set('view engine', 'ejs');


//post데이터 읽기 위해
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use(methodOverriide("_method"));

//라우팅
app.use("/", require("./router/home"));
app.use("/user", require("./router/user"));



//404에러처리 
app.use((req,res) =>{
   res.send(req.url+"은 존재하지 않는 페이지 입니다.");
  }
)

app.listen(port, err =>{
  if(err) console.log(err);
  else console.log("Server is running at 7777 port!!");
})

