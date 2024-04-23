require("dotenv").config()
const express = require("express");
const router = express.Router();
const path = require('path')

const UserModel = require("../Model/user")


const userRoutes = (app) => {
  router.get('/',UserModel.home)
  router.get('/search',(req, res) => { res.sendFile(path.join(__dirname+"../../views/Users/search.html")) })
  router.get('/products',(req, res) => { res.sendFile(path.join(__dirname+"../../views/Users/products.html")) })
  router.get('/products/detail',(req, res) => { res.sendFile(path.join(__dirname+"../../views/Users/products.html")) })
  router.get('/login/',(req, res) => { res.sendFile(path.join(__dirname+"../../views/Users/login.html")) })
  router.get('/registry/',(req, res) => { res.sendFile(path.join(__dirname+"../../views/Users/registry.html")) })
  return app.use("/", router)
}
module.exports = userRoutes

