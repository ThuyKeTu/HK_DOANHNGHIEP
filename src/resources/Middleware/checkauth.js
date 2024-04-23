require("dotenv").config()
const jwt = require('jsonwebtoken')
const checkauth = (req, res, next) => {
   if (req.headers.cookie) {
      const token = req.headers.cookie.token
      if (!token) {
         if (!req.headers.cookie){
            next()
         }
         const tokenFromClient = decodeURIComponent(req.headers.cookie)
         const parseToken = JSON.parse(tokenFromClient.split("=")[1]).token
         
         jwt.verify(parseToken, process.env.SECRET, (err, decoded) => {
            if (err){
               console.log(err) 
               next()
            }
            const userStatus = require("../sessions/userStatus")
            if ( userStatus.userid =! decoded ) next()
            req.body.currentId = decoded
            next()   
         })
   
      } else {
         jwt.verify(JSON.parse(decodeURIComponent(token)), process.env.SECRET, (err, decoded) => {
            if (err){
               console.log(err)
               next()
            }
            next()   
         })
      }
   }else{
        next()
   }

   
}

module.exports = checkauth