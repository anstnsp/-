const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;

passport.use(new BasicStrategy(
    (id, password, callback) =>{
        
        if(id === "study" && password ==="1234") {
            callback (null, id);
        }
        else { 
            callback (null, false); 
        }
    }
        
));

    
exports.isBasicAutenticated = passport.authenticate('basic',{sessioon : false})