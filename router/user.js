const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const auth = require("../auth/auth"); //passport를 통해 인증
const User = require("../models/User");

    //회원리스트
    router.get("/", (req, res) =>{
        userController.readUserList(req,res);
    });
   // 회원가입페이지로이동
   router.get("/new", (req, res) => {
       userController.signupPage(req,res);
   });
   
   //회원가입
   router.post("/", (req, res) => {
        userController.signupUser(req, res);
   });

   //회원정보보기
   router.get("/:username", (req, res)=> {
        userController.showUserInfo(req,res);
   });
   
   // 회원정보수정페이지
   router.get("/:username/edit", (req, res) =>{
        userController.editPage(req,res);
   });
   
   //회원정보수정
   router.put("/:username",(req, res) => {
        userController.editUser(req,res);
   });
   
   module.exports = router;