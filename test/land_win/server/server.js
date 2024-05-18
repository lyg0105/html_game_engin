const express = require('express');
var path = require('path');

global.LygLandConstant=require('./config/my_constant');
LygLandConstant.conn_pools = require('./model/static/db_pool');//db_pool 전역변수

var jwtCheck=require('./routes/api/jwt/check');

const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json({limit : "100mb"}));
app.use(express.urlencoded({ extended: true,limit:"100mb",parameterLimit: 100000000 }));
var apiRouter = require('./routes/api');

app.use(jwtCheck);//jwt 체크
app.use('/api',apiRouter);

module.exports = app;