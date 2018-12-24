module.exports = {
    //jwt토큰을 검증하는 서명부분을 만들 때, 해싱알고리즘에서 사용될 비밀키.
    'secret': 'SeCrEtKeYfOrHaShInG',
    //mongodb://[몽고디비계정]:[디비비밀번호]@도메인:포트번호/데이터베이스
    'mongodbUri': 'mongodb://anstnsp:anstnsp@localhost:27017/admin'
}