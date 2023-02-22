const mysql = require("mysql2");
const config = require("./db.json");

connectionPool = mysql.createPool({
    host: config.host, 
    user: config.user,
    password: config.password,
    database: config.database
});


module.exports = {pool: connectionPool};