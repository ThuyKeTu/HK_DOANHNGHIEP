const path = require('path')
const { HOST, USER, PASSWORD, DATABASE } = require("dotenv").config()["parsed"]
const mysql = require("mysql");


const UserServices = {
    home: async (req, res) => {

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
         // connected to mysql successfully

        const sql = `select * from user`
        conToDb.query(sql, (err, data) => {
            if (err) return console.log(err)

            console.log(data)
            conToDb.end()

            var name = "phan huu viet anh"
            return res.render(path.join(__dirname+"../../views/Users/home.ejs"),{data:data,name:name})
        })
        // var name = "Phan Huu Viet Anh"
        // var content = "day la trang chu"
        // console.log("home");
        // return res.render(path.join(__dirname+"../../views/Users/home.ejs"),{name:name,content:content})
    },
    addcart: async (req, res) => {
        return res.sendFile(__dirname+"../../views/Users/home.html")
    }
}

module.exports = UserServices