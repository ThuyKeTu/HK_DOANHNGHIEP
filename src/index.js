require("dotenv").config();
const PORT = process.env.PORT || 5000
const express = require('express')
const app = express()

app.set('view engine', 'ejs');
app.set('views', './resources/views')
// config
const config = require("./config/config")
config(app)

// routes
const UserRoutes = require("./resources/Controller/user")
UserRoutes(app)
// const BuyerRoutes = require("./resources/routes/buyer")
// BuyerRoutes(app)

// const AdminRoutes = require("./resources/routes/admin")
// AdminRoutes(app)

// const SellerRoutes = require("./resources/routes/seller")
// SellerRoutes(app)


app.listen(PORT, () => console.log(`server is running on port http://localhost:${PORT}`))
