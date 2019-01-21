const router     = require("express").Router();
const express = require('express');
const app = express();
const http = require('http').Server(app); //1
const io = require('socket.io')(http);    //1


router.get("/", (req,res) => {



    
    console.log("채팅 라우터 ")
    res.render("chat2");

})


  
module.exports = router;