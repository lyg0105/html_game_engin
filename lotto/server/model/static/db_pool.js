const mysql = require('mysql');

const conn_pools={
    'main':null,
    'main_user':null,
};
const connection1 = { //database 접속 정보 입력
    host: LottoConstant.DB_HOST,
    user: LottoConstant.DB_ID,
    password: LottoConstant.DB_PW,
    database: LottoConstant.DB_NAME,
    port: LottoConstant.DB_PORT,
    connectionLimit : 10, // 커넥션수 10개로 설정
    dateStrings: "date",
};

conn_pools['main']=mysql.createPool(connection1);

module.exports = conn_pools;