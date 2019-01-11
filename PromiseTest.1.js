const request = require("request");

/******************
 *Promise.all([]) |
*******************/ 
// const naver = new Promise((resolve,reject) => {
//     request.get("https://www.naver.com",(err,res,html) => {
//         resolve(html);
//     });
// });

// const daum = new Promise((resolve,reject) => {
//     request.get("http://www.daum.net", (err,res,html) => {
//         resolve(html);
//     });
// });

// const google = new Promise((resolve,reject) => {
//     request.get("http://www.google.com", (err,res,html) =>{
//         resolve(html);
//     });
// });
   //한번에 모든 프라미슈를 병렬로 처리하고 결과를 resolve에 반환 
// Promise.all([naver,daum,google]).then((resolve) =>{
//     console.log(resolve);
// })

//Promise chaining
//프로미슈 결과를 리턴하고 그결과를 다음 then 의 파라미터로 이용가능.
let p2 = new Promise((resolve,reject)=> {
    resolve(1);
});

p2.then((value) => {
    console.log(value);
    return value+1;
}).then((value) => {
    console.log(value)
    return value+1;
}).then((value) => {
    console.log(value);
});

