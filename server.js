const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const authCheck = require('./middleware/auth.middleware');
const managerRoutes = require('./routes/manager');
// const adminRoutes = require('./routes/admin');

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const uri = "mongodb://0.0.0.0:27017/webingo_assignment";
mongoose.connect(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Use routes
app.use('/auth', authRoutes);

app.use(authCheck)
app.use('/user', userRoutes);
app.use('/manager', managerRoutes);
// app.use("/admin",adminRoutes)

app.use("*", (req, res) => {
  res.send({message: "Wrong end-point"})
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(` ✅ Server is running on port ${PORT}`);
});
