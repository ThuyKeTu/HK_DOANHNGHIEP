const randomeCode = Math.floor(Math.random() * (9999 - 0)) + 0

const userServices = {
    register: (req, res) => {   
        const { username, password, confirmPassword } = req.body
        // check all fields are typed
        if (!password || !username || !confirmPassword) {
            return res.render("register", { message: "vui lòng nhập đầy đủ các trường"})
        }

        // check password and confirm password is not the same
        if (password !== confirmPassword) {
            return res.render("register", { message: "Các mật khẩu đã nhập không khớp. Hãy thử lại"})
        }

        // create connection to mysql
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
         // connected to mysql successfully

        const sql = `SELECT * FROM users WHERE username="${username}"`
        conToDb.query(sql, (err, result) => {
            if (err) return console.log("line 22: ", err)
            // if result.length == 0, it means there isn't a record has value username in database
            if (result.length == 1) {
                return res.render("register", { message: `${username} đã tồn tại, vui lòng chọn một user khác`})
            }

            const sql = `INSERT INTO users (username, pass) VALUES ("${username}", "${password}")`
            conToDb.query(sql, (err, result) => {
                if (err) console.log(err)
                conToDb.end() 
                return res.render("register", { message: `${username} đã đăng kí thành công`})
            })
        })
    },
    verify_email: (req, res) => {
        const { email } = req.body;

        // create connection to mysql
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

        // query
        const sql = `SELECT * FROM users WHERE gmail="${email}"`
        conToDb.query(sql, (err, result) => {
            if (err) return res.json({err: err})
            if (result.length) { return res.json("Email này đã được đăng kí") }

            const emailServices = require("../../config/nodemailer")
            emailServices(email, `Thư xác nhận thêm email vào tài khoản`, `nhập mã sau để liên kết tài khoản với gmail <b> ${randomeCode} </b>`)
            conToDb.end()
            return res.json("ok ")
        })
    },
    verify_email_code: (req, res) => {
        const { code } = req.body
        if (!code) { return res.json("vui lòng nhập mã xác nhận") }
        if (code != randomeCode) { return res.json("mã xác nhận không đúng") }
        const sql = `INSERT INTO users VALUES ()`
        /// insert email to user record
        return res.json("ok")
    },
    login: async (req, res) => {
        const { username, password } = req.body

        if (!username || !password) {
            return res.render("login", { message: "vui lòng không để trống các trường" })
        }

         // create connection to mysql
         const { HOST, USER, PASSWORD, DATABASE } = require("dotenv").config()["parsed"]
         const mysql = require("mysql");
 
         const conToDb = mysql.createConnection({
         host: HOST || "localhost",
         user: USER || "sa",
         password: PASSWORD || "123123",
         database: DATABASE || "QUANLYNHANSU"
         })
 
         conToDb.connect((err) => {
         if (err) throw err;
         console.log("Connected to mysql")
         })         // connected to mysql successfully

        const sql = `SELECT * FROM users WHERE username="${username}"`
        await conToDb.query(sql, async (err, result) => {
            if (err) console.log(err)
            if (!result.length) { return res.render("login", { message: `${username} chưa được đăng kí` }) }
            if (result[0].pass != password) { return res.render("login", { message: "mật khẩu không đúng" }) }
          
            // generate token
            const identifier = result[0].userid

            const usernames = result[0].username
            const fullname = result[0].fullname
            const gmail = result[0].gmail
            const gender = result[0].gender
            const avatar = result[0].avatar
            const createAt = result[0].dayat


            const jwt = require("jsonwebtoken")
            const token = await jwt.sign(identifier, process.env.SECRET)

            const credential = {
                token: token,
                username: usernames,
                fullname: fullname, 
                createAt: createAt,
                gmail: gmail || "Vui lòng cập nhật email để lấy được mật khẩu khi quên nha",
                avatar: avatar || "https://i.pinimg.com/564x/7f/26/e7/7f26e71b2c84e6b16d4f6d3fd8a58bca.jpg",
                gender: gender
            }

            const userStatus = require("../sessions/userStatus")
            userStatus.userid = identifier

            res.cookie("credential", JSON.stringify(credential))
            
            return res.redirect("/")
        })
    },
     logout: (req, res) => {
        req.render("home", {cookies: false})
     },
    forgetPassword: (req, res) => {
        const { email } = req.body
        if (!email) {return res.render("forgetPass", { message: "Vui lòng nhập email vào"})}

        // create connection to mysql
        const { HOST, USER, PASSWORD, DATABASE } = require("dotenv").config()["parsed"]
        const mysql = require("mysql");

        const conToDb = mysql.createConnection({
        host: HOST || "localhost",
        user: USER || "sa",
        password: PASSWORD || "123123",
        database: DATABASE || "QUANLYNHANSU"
        })

        conToDb.connect((err) => {
        if (err) throw err;
        console.log("Connected to mysql")
        })
        // query
        const sql = `SELECT * FROM users WHERE gmail="${email}"`
        conToDb.query(sql, (err, result) => {
            if (err) return res.json(err)
            if (!result.length) {return res.render("forgetPass", { message: `${email} chưa được đăng kí`})}

            const emailServices = require("../../config/nodemailer");
            emailServices(`${email}`, "Vui lòng nhập code để xác nhận thiết lập lại mật khẩu !" , `Mã của bạn là: ${randomeCode}`)
            var currentIdNe = result[0].userid
            console.log(currentIdNe)
            module.exports = currentIdNe
            res.render("forgetPass", { isCode: true, hideEmail: true} )
        })
    },

    forgetPasswordCode: (req, res) => {
        const {code } = req.body

        const currentIdNe = require("./buyer")
        console.log(currentIdNe)

        if (!code) {
            return res.render("forgetPass", {isCode: true, hideEmail: true, message : "vui lòng không để trống"})
        }
        if (code != randomeCode) {
            return res.render("forgetPass", {isCode: true, hideEmail: true, message : "mã xác nhận không chính xác"})
        }   
        const newPass = randomeCode + (Math.random() + 1).toString(36).substring(7)

        // create connection to mysql
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
        // query
        const sql = `UPDATE users SET pass="${newPass}" WHERE userid="${currentIdNe}"`
        conToDb.query(sql, (err, result) => {
            if (err) return res.json(err)
            return res.render("login", {message: `Mật khẩu mới của bạn là: ${newPass}` })
        })

    },

    updateUserInforbasic: (req, res) => {
        const {new_fullname, new_gender, currentId} = req.body

        let genderMessage

        if (new_fullname) {
             // create connection
             const { HOST, USER, PASSWORD, DATABASE } = require("dotenv").config()["parsed"]
             const mysql = require("mysql");
 
             const conToDb = mysql.createConnection({
                host: HOST || "localhost",
                user: USER || "sa",
                password: PASSWORD || "123123",
                database: DATABASE || "QUANLYNHANSU"
             })
 
             conToDb.connect((err) => {
             if (err) throw err;
             console.log("Connected to mysql")
             })
             // connected
             // query
            const sql = `UPDATE users SET fullname="${new_fullname}" WHERE userid="${currentId}"`
             conToDb.query(sql , (err, result) => {
                if (err) console.log(err)
                conToDb.end()
             })
        }

        if (new_gender) {
            if (new_gender == "nam" || new_gender == "NAM" || new_gender == "Nam" || new_gender == "nAM" || new_gender == "NỮ" || new_gender == "nữ" || new_gender == "Nữ" || new_gender == "nỮ") {
                // create connection
                const { HOST, USER, PASSWORD, DATABASE } = require("dotenv").config()["parsed"]
                const mysql = require("mysql");

                const conToDb = mysql.createConnection({
                host: HOST || "localhost",
                user: USER || "sa",
                password: PASSWORD || "123123",
                database: DATABASE || "QUANLYNHANSU"
                })

                conToDb.connect((err) => {
                if (err) throw err;
                console.log("Connected to mysql")
                })
                // connected
                // query
                const sql = `UPDATE users SET gender="${new_gender}" WHERE userid="${currentId}"`
                conToDb.query(sql , (err, result) => {
                if (err) console.log(err)
                conToDb.end()
                })
            }
             else {
                genderMessage="Giới tính không hợp lệ. Còn lại"
             }
        } 
        let finalMessage = genderMessage || " "
        return res.render("Account_Detail", {message: `${finalMessage} cập nhật thành công`, cookies: true})

    },
    updateUserInforavatr:(req,res) =>{
        const {currentId} = req.body
        const new_avt = req.file.filename
        const { HOST, USER, PASSWORD, DATABASE } = require("dotenv").config()["parsed"]
        const mysql = require("mysql");

        const conToDb = mysql.createConnection({
            host: HOST || "localhost",
            user: USER || "sa",
            password: PASSWORD || "123123",
            database: DATABASE || "QUANLYNHANSU"
        })

        conToDb.connect((err) => {
            if (err) throw err;
            console.log("Connected to mysql")
        })
            
        const sql = `UPDATE users SET avatar='${new_avt}' WHERE userid="${currentId}"`
        conToDb.query(sql , (err, result) => {
            if (err) console.log(err)
            conToDb.end()
        })
        
        return res.render("Account_Detail", {message: `cập nhật avatar thành công`, cookies: true})
        
    },
    // for change email
    updateUserinforemail: (req, res) => {
        const { new_email} = req.body

        if (new_email) {
            // create connection
            const { HOST, USER, PASSWORD, DATABASE } = require("dotenv").config()["parsed"]
            const mysql = require("mysql");

            const conToDb = mysql.createConnection({
            host: HOST || "localhost",
            user: USER || "sa",
            password: PASSWORD || "123123",
            database: DATABASE || "QUANLYNHANSU"
            })

            conToDb.connect((err) => {
            if (err) throw err;
            console.log("Connected to mysql")
            })
            // connected
            const sql = `SELECT gmail FROM users WHERE gmail="${new_email}"`
            conToDb.query(sql, (err, result) => {
                if (err) return res.json(err)
                if (result.length) {
                    conToDb.end()             
                    return res.render("Account_Detail", { message: "Email đã tồn tại nếu là email của bạn hãy bấm quên mật khẩu, nếu không hãy thử một email khác", cookies: true})
                }

                const randomeCodes = Math.floor(Math.random() * (9999 - 2)) + 0

                const emailServices = require("../../config/nodemailer")

                var randomeCodeko = Math.floor(Math.random() * (9999 - 0)) + 0
                var userEmail = new_email
                module.exports = {randomeCodeko, userEmail}
                
                emailServices(new_email, "Vui lòng xác nhận đây là email của bạn bằng cách nhập mã sau:", `mã của bạn là <b> ${randomeCodeko}</b>`)
            
                conToDb.end()
                return res.redirect("/authEmail")
            })

        } else {
            return res.redirect("/account")
        }
    },
    updateUserinforCode: (req, res) => {
        const {randomeCodeko, userEmail} = require("./buyer")

        const {currentId} = req.body
        const {user_code} = req.body;

        console.log(randomeCodeko, user_code)

        if (!user_code) {
            return res.render("authEmail", { message: "vui lòng nhập mã xác nhận"})
        
        }
        if (randomeCodeko != user_code)  {
            return res.render("authEmail", { message: "mã xác nhận không chính xác"})
        }
        // creat connection 
        const { HOST, USER, PASSWORD, DATABASE } = require("dotenv").config()["parsed"]
        const mysql = require("mysql");

        const conToDb = mysql.createConnection({
        host: HOST || "localhost",
        user: USER || "sa",
        password: PASSWORD || "123123",
        database: DATABASE || "QUANLYNHANSU"
        })

        conToDb.connect((err) => {
        if (err) throw err;
        console.log("Connected to mysql")
        })

        const sql = `UPDATE users SET gmail="${userEmail}" WHERE userid="${currentId}"`
        conToDb.query(sql, (err, result) => {
            if (err) console.log(err)
            conToDb.end()
            return res.render("Account_Detail", { message: "Đã cập nhật emmail thành công"})
        })
    }, 
    change_password: (req, res) => {
        const { currentPass, newPass, confirmPass, currentId } = req.body

        if (!currentPass || !newPass || !confirmPass) {
            return res.render("changepassword", {message: "không được để trống", cookies: true})
        }

        // create connection to mysql
        const { HOST, USER, PASSWORD, DATABASE } = require("dotenv").config()["parsed"]
        const mysql = require("mysql");
        const conToDb = mysql.createConnection({
            host: HOST || "localhost",
            user: USER || "sa",
            password: PASSWORD || "123123",
            database: DATABASE || "QUANLYNHANSU"
          })
          
          conToDb.connect((err) => {
            if (err) throw err;
            console.log("Connected to mysql")
          })
        // connected to mysql
        //query  
        const sql = `SELECT * FROM users WHERE userid="${currentId}"`
        conToDb.query(sql, (err, result) => {
            if (err) return res.json("err")
            if (result[0].pass == currentPass) {
                if (newPass == confirmPass) {
                    const sql = `UPDATE users SET pass="${newPass}" WHERE userid="${currentId}"`
                    conToDb.query(sql, (err, result) => {
                        if (err) return res.json(err)
                        return res.render("changepassword", { message: "thay đổi mật khẩu thành công", cookies: true})
                    })
                } else {
                    return res.render("changepassword", { message: "Mật khẩu mới và mật khẩu xác nhận không giống nhau tí nào", cookies: true})
                }
            } else {
                return res.render("changepassword", { message: "Mật khẩu không đúng", cookies: true})
            }
        })
    },
    getexp:(req, res,next) => {//nay la tang exp
        const userid = req.body.currentId
        const { HOST, USER, PASSWORD, DATABASE } = require("dotenv").config()["parsed"]
        if(userid){
            const mysql = require("mysql");
            const conToDb = mysql.createConnection({
                host: HOST || "localhost",
                user: USER || "sa",
                password: PASSWORD || "123123",
                database: DATABASE || "QUANLYNHANSU"
            })
            
            conToDb.connect((err) => {
                if (err) throw err;
                console.log("Connected to mysql")
            })
            // connected to mysql
            //query  
            const sql = `UPDATE users SET Point = Point + 1 WHERE userid=${userid}`
            conToDb.query(sql, (err, result) => {
                if (err) return res.json("err")
                next()
            })
        }else{
            next()
        }
    }
}

module.exports = userServices