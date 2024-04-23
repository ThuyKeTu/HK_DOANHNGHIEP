const express = require("express")
const router = express.Router()
const comicupload = require("../middlewares/upload/Admin_comic")
const chapterupload = require("../middlewares/upload/Admin_chapter")
const adminAuth = require("../middlewares/adminAuth")
const path = require("path")

const adminServices = require("../services/admin")

const adminRoutes = (app) => {
    // render views
    router.get("/login", (req, res) => res.render("admin-login"))
    router.get("/logout", (req, res) => {
        res.clearCookie("credential")
        res.redirect('/admin/login')
    })
    router.get("/commic", adminAuth, adminServices.admincomic)

    router.get("/chapter/:id",adminAuth, (req, res) => {
        res.render("admin_chapter",{ isLoggedIn: true ,comic:req.params.id})
    })
    // services
    router.post("/login", adminServices.login)

    //add comic/chapter
    router.post("/addnewcomic",comicupload.single("image"),adminServices.addcomic)
    router.post("/addnewchapter",chapterupload.array("image"),adminServices.addchapter,adminServices.addfolderchapter)
    router.post("/deletecomic",adminServices.deletecomic)
    
    // return routes
    return app.use("/admin", router)
}

module.exports = adminRoutes