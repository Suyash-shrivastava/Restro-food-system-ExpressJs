var mysql=require('mysql')
var pool=mysql.createPool(
    {
        host:'localhost',
        port:3306,
        user:'root',
        password:'root123',
        database:'food',
        connectionLimit:50,
        multipleStatements:true

    }
)
module.exports=pool;