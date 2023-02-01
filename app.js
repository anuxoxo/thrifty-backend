const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

// middlewares
app.use(cors({
  origin: "*",
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_URI)
  .then(() => { app.listen(PORT, console.log("Server connected to localhost ", PORT)) })
  .catch(err => console.log(err.message))

app.get('/', (req, res) => {
  res.send("Server running successfully...")
})