const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;
const User = require("../models/User");
const crypto = require("crypto");


passport.use(new BasicStrategy(
    (userID, password, callback) =>{
        
        const hash = crypto.createHash("sha256");
        hash.update(password);

        let hash_password = hash.digest("hex");


        console.log(userID);
        console.log(password);

        User.findOne({userID : userID, password : hash_password},{password:0}, (err, doc) =>{

            if(doc) {
                //아디 비번이 맞으면 doc넘어오고 틀리면 false로 else로
                callback(null, doc);
                console.lod(doc);
            } else {
                callback(null, false);
            }
            
        })
    }
        
));

    
exports.isBasicAutenticated = passport.authenticate('basic',{sessioon : false})