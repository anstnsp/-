/*
####Promise 예제####

 */
function promiseTest(rul) {
    return new Promise(function (resolve, reject){
        var xhr = new XMLHttpRequest;
        xhr.addEventListener("error", reject);
        xhr.addEventListener("load", resolve);
        xhr.open("GET", url);
        xhr.send(null);
    })
}

//Promise가 성공적으로 수행됐다면 resolve를 실행하는데 그 목적지가 then이다.
new Promise((resolve, reject) => {
    exampleFunction(){
        if(error) reject(error);
        else resolve(success);
    }
})
//디비가 불러올때 정상적으로 동작하면 users를 반혼하고 resolve가 users라는  변수를 then으로 보내준다.
new Promise((resolve, reject) => {

    user.find({}, (err,users) => {
        if(err) reject(err);
        else resolve(users);
    });

}).then((users) => {

    res.send(users);

});
//만약에 디비에 error가 발생하여 reject가 수행될때 처리 then 후에 .catch 처리!
new Promise((resolve,reject) => {

    user.find({}, (err,users) => {
        if(err) reject(err);
        else resolve(users);
    });

}).then((users) => {

    res.send(users);

}).catch((err) => {
    console.log(err);
});

//Promise.all()을 쓰면 여러개의 Promise들을 병렬로 처리할 수 있다.
//성공적으로 수행되면 .then()으로가는데 병렬로 처리했기 때문에 resolve()의 매개변수로 들어노는 값은 1개이상이 되는데
//이때 then()을 사용하면 아래와 같이 result라는 매개변수가 araay로 된다.
Promise.all([
    new Promise((resolve,reject) => {
        if(err) reject(err);
        else resolve(result1);
    }),
    new Promise((reslove,reject) => {

        if(err) reject(err);
        else resolve(result2);
    })]
).then((result) => {
    let result1 = result[0];
    let result2 = result[1];
});
//.spread
Promise.all([
    new Promise((resolve, reject) => {
        if(err) reject(err);
        else resolve(result1);
    }),
    new Promise((resolve, reject) => {
        if(err) reject(err);
        else resolve(result2);
    })
]).spread((result1, result2) => {
    console.log(result1);
    console.log(result2);
});
//.finally 무조건 마지막에 실행된다. 에러가 있어도 실행 된다.
Promise.all([
    new Promise((resolve, reject) => {
        if(err) reject(err);
        else resolve(result1);
    }),
    new Promise((resolve, reject) => {
        if(err) reject(err);
        else resolve(result2);
    })
]).spread((result1, reuslt2) => {
    console.log(result1);
    console.log(result2);
}).catch((err) => {
    console.log(err);
}).finally(() => {
    console.log("Promise is Done!");
})
//.bind를 사용하면 변수를 일부러 선언 할 필요없이 .bind를 사용한 함수 내에서 변수의 사용이 자유롭다.
somethingAsync().bind({}).spread(function (aValue, bValue) {
    this.aValue = aValue;
    this.bValue = bValue;
    return somethingElseAsync(aValue, bValue);
}).then(function (cValue) {
    return this.aValue + this.bValue + cValue;
});


