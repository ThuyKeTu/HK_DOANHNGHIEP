require("dotenv").config()
const jwt = require('jsonwebtoken')

const adminAuth = (req, res, next) => {
    const adminStatus = require("../sessions/adminStatus")

    if (!req.headers.cookie) return res.redirect("/admin/login") 

    if (req.headers.cookie) {
        const tokenFromClient = decodeURIComponent(req.headers.cookie)
        const parseToken = JSON.parse(tokenFromClient.split("=")[1]).token

        jwt.verify(parseToken, process.env.SECRET, (err, decoded) => {
            if (err) console.log(err)
            if (adminStatus.admin_name != decoded) {
                return res.render("admin-login", { message: "Không đúng token" })
            }
            req.body.currentAdmin_name = decoded
            next()   
        })
     } else {
        return res.redirect("/admin/login")
     }
}

module.exports =adminAuth