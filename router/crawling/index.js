const router     = require("express").Router();
const request = require("request");
const cheerio = require('cheerio');
const controller = require("./crawling.controller");


//네이버급상승검색어 크롤링
router.get("/naverPopluarWord", controller.crawNaverPopularWord);




module.exports = router;

