const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDatabase = require("./connect/db")

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const authCheck = require('./middleware/auth.middleware');
const managerRoutes = require('./routes/manager');


const app = express();
require("dotenv").config()


// Middleware
app.use(cors());
app.use(express.json());



// Use routes
app.use('/auth', authRoutes);

app.use(authCheck)
app.use('/user', userRoutes);
app.use('/manager', managerRoutes);
// app.use("/admin",adminRoutes)

app.use("*", (req, res) => {
  res.send({message: "Wrong end-point"})
})



const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(` ✅ Server is running on port ${PORT}`)
    try {
        connectDatabase()
        console.log("Db Connected  ✅")

    } catch (err) {
        console.log(err.message)
    }

})
