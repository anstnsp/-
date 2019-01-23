/* ========================
||  배열 디스트럭처링       ||
==========================*/

//ES6의 배열 디스트럭처링은 배열의 각 요소를 배열로부터 추출하여 
//변수 리스트에 할당한다. 이때 추출/할당 기준은 배열의 인덱스이다.

const arr = [1, 2, 3];
//배열 디스트럭처링을 위해서는 할당 연산자 왼쪽에 배열 형태의 변수 리스트가 필요하다.
const [one, two, three] = arr; 

console.log(one, two, three); 

//ES6의 배열 디스트럭처링은 배열에서 필요한 요소만 추출하여 변수에 할당하고 싶은 경우에 유용하다. 


//ES6의 객체 디스트럭처링은 객체의 각 프로퍼티를 객체로부터 추출하여 변수 리스트에 할당한다. 
//이때 할당 기준은 프로퍼티 이름(키)이다.
const obj = { firstname : "anstn" , lastname : "sp"};

const {firstname, lastname} = obj; 
//const {aa , bb} = obj   << 할당 기준인 프로퍼티 이름이 다르므로 undefined가 뜬다. 
console.log(firstname , lastname);

function greeting(name){
    alert("반갑습니다" + name +"님");
}

function test(callback) {
    var name = promt("sdfsdf");
    callback(name);
}
test(greeting());


/* ========================
||  arrow function       ||
==========================*/
//arrow function 에서 인자가 한개면 소괄호 생략가능. 
const pow = x =>  x*x; 
console.log(pow(10)); 

//arrow function과 일반 function의 가장 큰 차이!!! 는 [this] << this다!!.
//일반 함수는 함수를 선언할 때 this에 바인딩할 객체가 정적으로 결정되는 것이 아니고
//함수를 호출할 때 함수가 어떻게 호출되었는지에 따라 this에 바인딩할 객체가 동적으로 결정된다. 
//화살표 함수는 함수를 선언할 때 this에 바인딩할 객체가 정적으로 결정된다.
//화살표 함수의 this 언제나 상위 스코프의 this를 가리킨다. 
function Prefixer(prefix) {
    this.prefix = prefix ; 
}

Prefixer.prototype.prefixArray = function(arr) {
    // (A)  << 이 지점에서의 this는 생성자 함수 Prefixer가 생성한 객체, 즉 생성자함수의 인스턴스(pre) 이다.
    return arr.map(function(x) {
        //(B) 이 지점에서의 this는 전역객체 window를 가리킨다.
        //이는 생성자 함수와 객체의 메소드를 제외한 모든 함수(내부함수,콜백함수등..)내부의 this는 전역객체를 가르키기 때문이다. 
        return this.prefix + ' ' + x;  
    });
};

let pre = new Prefixer('hi');
console.log(pre.prefixArray(['lee', 'kim']));

//콜백 함수 내부의 this가 메소드를 호출한 객체(생성자 함수의 인스턴스)를 가리키게 하려면 아래의 3가지 방법이 있다.
Prefixer.prototype.prefixArray = function(arr) {
    let that = this; // this : Prefixer 생성자 함수의 인스턴스 
    return arr.map(function (x) {
        return that.prefix + ' ' + x; 
    });
};
//es5에 추가된 Function.prototype.bind()로 this를 바인딩.
Prefixer.prototype.prefixArray = function(arr) {
    return arr.map(function (x) {
        return this.prefix + ' ' + x; 
    }.bind(this)); //this : Prefixer 생성자 함수의 인스턴스
};

//화살표 함수의 this 언제나 상위 스코프의 this를 가리킨다. 
Prefixer.prototype.prefixArray = function (arr) {
    //this는 상위 스코프인 prefixArray 메소드 내의 this를 가르킨다.
    return arr.map(x => '${this.prefix} ${x}');
};

//화살표함수를 사용하면 안되는 경우
//1.메소드 정의 
//2.화살표함수로 정의된 메소드를 prototype에 할당하는 경우. 
//3.생성자 함수 
//4.addEventListner함수의 콜백함수. 

function getData() {
    return new Promise((resolve, reject)=>{
        
        //Promise에서 처리할 로직...
        $.get('url 주소/products/1', (res) =>{
            if(res) resolve(res);
            reject(new Error("REQ IS FAILED"));
        })
        
    });
}

//resolve()의 결과 값 data가 resolveData로 넘어옴...
getData().then((data)=>{
    console.log(data);
}).catch((err)=>{
    console.err(err);
})