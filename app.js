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
//ap.set()을 이용해서 express의 세팅을 할 수 있다.
app.set('views', path.join(__dirname, 'views'));
console.log(__dirname+"\views");
app.set('view engine', 'ejs');


//POST request data의 body로부터 파라미터를 편리하게 추출합니다.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use(methodOverriide("_method"));

//라우팅
app.use("/", require("./router/home"));
app.use("/user", require("./router/user"));
app.use("/posts", require("./router/post"));

//404에러 발생시
app.use( (req,res,next) => {
    let err = new Error('NOT FOUND');
    err.status = 404;
    next(err);
});

//개발환경일때 에러 핸들러
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//운영일때 에러 핸들러
app.use((err,req,res,next) => {
    res.status(err.status || 500);
    res.render("error", {
        message : err.message,
        error : err
    })
});

app.listen(port, err =>{
  if(err) console.log(err);
  else console.log("Server is running at 7777 port!!");
})


module.exports = app;