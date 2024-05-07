const mysql = require('mysql');

const conn_pools={
    'main':null,
};
const connection1 = { //database 접속 정보 입력
    host: LygLandConstant.DB_HOST,
    user: LygLandConstant.DB_ID,
    password: LygLandConstant.DB_PW,
    port: LygLandConstant.DB_PORT,
    database: LygLandConstant.DB_NAME,
    connectionLimit : 10, // 커넥션수 10개로 설정
    dateStrings: "date",
};
conn_pools['main']=mysql.createPool(connection1);

module.exports = conn_pools;