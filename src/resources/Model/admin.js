const { kMaxLength } = require("buffer");

const adminServices = {
    login: async (req, res) => {
        const { admin_name, admin_password } = req.body
        if (!admin_name || !admin_password) { return res.render("admin-login", { message: "Nhập đầy đủ thông tin mới đăng nhập được chứ"}) } 

        // create connection 
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
        // connected to mysql
        const sql = `SELECT * FROM admin WHERE admin_name="${admin_name}"`;
        await conToDb.query(sql, async (err, result) => {
            if (err) console.log(err)
           
            if (!result.length) { return res.render("admin-login", { message: `Không tìm thấy tài khoản ${admin_name}`}) }
            if (admin_password != result[0].admin_password) { return res.render("admin-login", { message: "mật khẩu không đúng rồi"}) }

            const jwt = require("jsonwebtoken")
            const token = await jwt.sign(admin_name, process.env.SECRET)

            const admin_credential = {
                admin_name,
                token: token
            }    

            // const credential = {
            //     token: token,
            //     username: usernames,
            //     fullname: fullname, 
            //     createAt: createAt,
            //     gmail: "",
            //     avatar: "avatar",
            //     gender: gender
            // }

            const adminStatus = require("../sessions/adminStatus")
            // update admin status - admin_name
            adminStatus.admin_name = admin_name
            res.cookie("credential", JSON.stringify(admin_credential))
            res.redirect('/admin/commic')
        })
    },
    
    addcomic: (req, res) => { 
        const avt = req.file.filename
        const { name, author,content,tag} = req.body
        let listtag_value =""
        console.log(listtag_value)
            // check name
        if (!name){
            return res.render("admin_commic", { message: "thiếu tên r"})
        }
            // check password and confirm password is not the same
        if (!avt) {
            return res.render("admin_commic", { message: "Thiếu ảnh r đcmm"})
        }

        if(!tag){
            return res.render("admin_commic", { message: "tag đâu đcmm"})
        }else{
            const listtag = tag.split(",") 
            for(i=0;i<listtag.length-1;i++){
            if(i==listtag.length-2){
                listtag_value+="((SELECT max(id) FROM comics),"+ listtag[i] + ")"
            }else{
                listtag_value+="((SELECT max(id) FROM comics),"+ listtag[i] + "),"
            }
        }
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
             // connected to mysql successfully
        const sql = `INSERT INTO comics(name,author,content,views,image,topiccomment_id) VALUES ('${name}', '${author}','${content}',0, '${avt}',(select cm.topic from (SELECT CONCAT('cm',max(id)+1) as topic FROM comics) as cm));`
        conToDb.query(sql, (err, result) => {
            if (err) return res.send(`Truyện:lỗi r lm,ao`)

            const sqltag = `INSERT INTO comics_tags(comicid,tagid) VALUES ${listtag_value};`
            conToDb.query(sqltag, (err, tag) => {
                if (err) return res.send(`Truyện:lỗi r lm,ao`)
                
                    const sqlupdate = `INSERT INTO lastupdatedcomic(id) VALUES((SELECT max(id) FROM comics));`
                    conToDb.query(sqlupdate, (err, update) => {
                        if (err) return res.send(`Truyện:lỗi r lm,ao`)
                        conToDb.end() 
                        return res.redirect('/admin/commic')
                    })
            })
        })
            
    },
    addfolderchapter: (req, res) => { 
        const fs = require("fs")
        const path = require("path")
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
             // connected to mysql successfully
        const sql = `SELECT * FROM chapters WHERE id=(SELECT max(id) FROM chapters) `
        conToDb.query(sql, (err, result) => {
            if (err) console.log(err)
            const id = result[0].id +1
            const idname = id +""
            fs.mkdir(path.join("./src/public/image/chapter",idname),{},err=>{
                if(err){                   
                    res.send(`lỗi r lmao`)
                    throw err
                }
                conToDb.end() 
                return res.redirect('/admin/commic')
                
            })
           
        })
    },
    addchapter:(req, res,next) => { 
        var listchap =""
        const {comic, name} = req.body
        for(i=0;i<req.files.length;i++){
            if(i==0){
                listchap += req.files[i].originalname
            }else{
                listchap +=","+req.files[i].originalname
            }
           
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
             // connected to mysql successfully
        const sql =`INSERT INTO chapters (comicid, comicLocalId, name, uri, topiccomment_id) VALUES (${comic}, NULL, '${name}', '${listchap}', (select ct.topic from (SELECT CONCAT('ct',max(id)+1) as topic FROM chapters) as ct));`
        conToDb.query(sql, (err, result) => {
            if (err) return res.send(`Truyện:lỗi r lmao`)

            const sqlupdate =`UPDATE lastupdatedcomic SET updatetime = now() WHERE id =${comic};`
            conToDb.query(sqlupdate, (err, resulturi) => {
                if (err) return res.send(`Truyện:lỗi r lm,ao`)
                    
                conToDb.end()
                next()
            })
            
        })
    },

    deletecomic:(req, res) => { 
        const comicid = req.body.idcomic
        
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
             // connected to mysql successfully
        const sqldelete = `DELETE FROM comics WHERE id=${comicid};`
        conToDb.query(sqldelete, (err, resultdelete) => {
            if (err) return res.send(`Truyện:lỗi r lm,ao`)            
        })
        const sql = `SELECT * FROM comics;`
        conToDb.query(sql, (err, result) => {
            if (err) return res.send(`Truyện:lỗi r lm,ao`)

            conToDb.end() 
            return res.render("admin_commic", { isLoggedIn: true,comics:result})
        })
    },
    admincomic: (req, res) => {
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
             // connected to mysql successfully
        const sql = `SELECT * FROM comics;`
        conToDb.query(sql, (err, result) => {
            if (err) console.log(err)

            const sqltag = `SELECT tagid,tagname FROM tags;`
            conToDb.query(sqltag, (err, tags) => {
                if (err) console.log(err)

                conToDb.end() 
                return res.render("admin_commic", { isLoggedIn: true,comics:result,tag:tags})
            })
        })
    }

}

module.exports = adminServices