const { HOST, USER, PASSWORD, DATABASE } = require("dotenv").config()["parsed"]
const mysql = require("mysql");

const conToDb = mysql.createConnection({
  host: HOST ,
  user: USER ,
  password: PASSWORD ,
  database: DATABASE 
})

conToDb.connect((err) => {
  if (err) throw err;
  console.log("Connected to mysql")
})

module.exports = conToDb