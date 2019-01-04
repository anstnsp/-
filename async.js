function* myGen() {
    yield 1;
    yield 2;
    yield 3;
    return 4;
}

const myItr = myGen();
console.log(myItr.next());
console.log(myItr.next());
console.log(myItr.next());
console.log(myItr.next());
/*
myGen 제너레이터는 실행될 때 이터레이터를 반환한다.
그리고 이터레이터의 next() 함수가 호출될 때마다 호출되는 곳의 위치를 기억해둔 채로 실행된다.
그리고 함수 내부에서 yield를 만날 때마다 기억해둔 위치로 제어권을 넘겨준다.
이런 식으로 next() -> yield -> next() -> yield 라는 순환 흐름이 만들어 지고,
이 흐름을 따라 해당 함수가 끝날 때까지 (return을 만나거나 마지막 라인이 실행될 때까지) 진행된다.

여기서 중요한 점은 next()와 yield가 서로 데이터를 주고받을 수 있다는 점이다.
위의 예제에서 볼 수 있듯이 yield 키워드 뒤의 값은 next() 함수의 반환값으로 전달된다
(정확히는 value 프라퍼티의 값으로). 그럼 반대로 호출자가 제너레이터에게 값을 전달할 수도 있을까?
물론 가능하다. next()를 호출할 때 인수를 넘기면 된다. 다음의 예제를 보자.
 */
function* myGen2() {
    const x = yield 1; //x = 10
    const y = yield (x+1); //y = 20
    const z = yield (y+2); //z = 30
    return x + y + z;
}
const myitr2 = myGen2();
console.log("================================")
console.log(myitr2.next());   // {value:1, done:false}
console.log(myitr2.next(10)); // {value:11, done:false}
console.log(myitr2.next(20)); // {value:22, done:false}
console.log(myitr2.next(30)); // {value:60, done:true}


function getId(phoneNumber,(data)=>{

})
function getEmail(id, callback) {
    let email = "anstnsp@naver.com"
    return email;
}
function getName(email,callback) {
    let name = "김문수"
    return name;
}
function order(name,menu, callback) {
    let result = menu+"커피가 나왔다."
    return result;
}
function orderCoffee(phoneNumber, callback) {
    getId(phoneNumber, function(id) {
        getEmail(id, function(email) {
            getName(email, function(name) {
                order(name, 'coffee', function(result) {
                    callback(result);
                });
            });
        });
    });
}
getId("01099993333", (data)=>{
    console.log(data);
})
// console.log(getEmail(getId()))
// console.log(getEmail())
// console.log(getName())
//
// function orderCoffee(phoneNumber){
//     getId(phoneNumber)
// }
//
