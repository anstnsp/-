const request = require('request');
const cheerio = require('cheerio');
const bodyparser = require('body-parser');
const fs = require("fs");

console.log(fs.readFileSync("./public/private.pem"))

console.log(fs.readFileSync("./public/public.pem"))
croll = () => {
    request.get('https://www.naver.com', function(err,httpResponse, body){
    if(err) return;
    const $ = cheerio.load(body);
    let rankList = $('div.ah_roll_area ul li')
    let resultArr = [];

    rankList.each(function (i,e) {
        let rank =$(e).children('a').children('span.ah_r').text()
       let name= $(e).children('a').children('span.ah_k').text()
        console.log(rank+'위는'+name+'입니다')
     })

})

}