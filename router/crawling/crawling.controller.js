
const request = require("request");
const cheerio = require('cheerio');


//네이버급상승검색어 크롤링
//크롤링을 만들어 놓고 
//1.크롤링을 호출하는 화면(ejs)에서 이 url을 ajax로 정기적으로 호출 (5초?10초?에 한번씩)
exports.crawNaverPopularWord = (req,res,next) => {

    request.get('https://www.naver.com', function(err,httpResponse, body){
    if(err) return;
    const $ = cheerio.load(body);
    let rankList = $('div.ah_roll_area ul li')
    
    let nameArr = [];
        nameArr.push
        rankList.each(function (i,e) {
            let rank =$(e).children('a').children('span.ah_r').text();
            let name= $(e).children('a').children('span.ah_k').text();              
            nameArr.push(name);
        })
       
        res.send(nameArr);
    })
   
}





crawling = () => {
    request.get('https://www.naver.com', function(err,httpResponse, body){
    if(err) return;
    const $ = cheerio.load(body);
    let rankList = $('div.ah_roll_area ul li')


        rankList.each(function (i,e) {
            let rank =$(e).children('a').children('span.ah_r').text()
        let name= $(e).children('a').children('span.ah_k').text()
            console.log(rank+'위는'+name+'입니다')
        })

    })

}
