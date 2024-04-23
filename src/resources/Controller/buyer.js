require("dotenv").config()
const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const checkauth = require("../middlewares/checkauth");
const buyerServices = require("../Model/buyer")
const SellerServices = require("../Model/seller") 
const multer = require("multer");
const { Cookie } = require("express-session");
const userupload = require("../middlewares/upload/User_avatar");



const userRoutes = (app) => {
  router.get('/',buyerServices.allcomic)
  // router.get('/',checkauth,comicServices.allcomic)
  // router.get('/?page=:id',checkauth,comicServices.allcomic)
  // router.get('/seachcomic',comicServices.findcomic)
  // router.get("/login", (req, res) => { res.render("login") } )
  // router.get("/register", (req, res) => { res.render("register") })
  // router.get("/authEmail", (req, res) => res.render("authEmail"))
  // router.get("/forgetPassword", (req, res) => res.render("forgetPass"))
  // router.get("/user", userAuth, (req, res) => res.render("User_Detail", {cookies: true}))
  // router.get("/account", userAuth, (req, res) => res.render("Account_Detail",{ cookies: true ,userid:req.body.currentId}))
  // router.get("/followcomic", userAuth, comicServices.showfollowcomic)
  // router.get("/changepassword", userAuth, (req, res) => res.render("changepassword", { cookies: true}))
  // router.get("/logout", (req, res) => {
  //     res.clearCookie("credential")
  //     res.redirect('/')
  // })

  
// routing  
  // router.post("/change_password", userAuth, userServices.change_password)
  // router.post("/updateUserInforbasic",userAuth, userServices.updateUserInforbasic)
  //for change avatar
  // router.post("/updateUserinforavatar",userupload.single("new_avatar"),userAuth, userServices.updateUserInforavatr)
  // for change email
  // router.post("/updateUserinforemail", userAuth, userServices.updateUserinforemail)
 
  // router.post("/updateUserinforCode", userAuth, userServices.updateUserinforCode)
  // router.post("/verify_email", userAuth ,userServices.verify_email)
  // router.post("/verify_email_code", userAuth ,userServices.verify_email_code)
  // router.post("/register", userServices.register)
  // router.post("/login", userServices.login)
  // router.post("/forgetPassword", userServices.forgetPassword)
  // router.post("/forgetPassword/code", userServices.forgetPasswordCode)

  return app.use("/", router)
}
module.exports = userRoutes

