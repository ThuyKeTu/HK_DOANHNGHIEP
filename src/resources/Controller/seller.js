require("dotenv").config()
const express = require("express");
const userAuth = require("../middlewares/userAuth");
const checkauth = require("../middlewares/checkauth");
const comicServices = require("../services/seller")
const router = express.Router();

const comics = require("../services/seller")
const user = require("../services/buyer")

const commicsRoutes = (app) => {
  // routes for render views
    router.get("/:id",checkauth, comicServices.showcomic)
    // router.get("/chapter/:id&:comic",checkauth,user.getexp, comics.chapter)
    // router.get("/chapterapi/:chap",checkauth,user.getexp, comics.chapterapi)
    router.get("/hotcomic/:page", comicServices.hotcomic)
    router.get("/chapter/:id&:comic",checkauth, comics.chapter)
    router.get("/chapterapi/:chap",checkauth, comics.chapterapi)
    router.get("/category/:id&:numpage", comicServices.seachcategory)
    router.get("/api/topuser", comicServices.gettopuser)
    router.get("/api/topcomic",comicServices.gettopcomic)
    router.get("/api/tophot", comicServices.gettophot)
    router.get('/api/comic/:page',comicServices.homecomic)

    router.post("/followcomic",userAuth,comics.followcomic)
    router.post("/unfollowcomic",userAuth,comics.unfollowcomic)
    router.post("/comiccomment",userAuth,comics.comiccomment)
    router.post("/chaptercomment",userAuth,comics.chaptercomment)
    router.post("/readchapter",checkauth,comics.readchapterapi)

    return app.use("/comic", router)
}
module.exports = commicsRoutes