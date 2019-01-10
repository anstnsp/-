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

// Promise.all([naver,daum,google]).then((resolve) =>{
//     console.log(resolve);
// })

//Promise chaining
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

