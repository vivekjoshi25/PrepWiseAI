require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoute=require('./routes/userroute');
const interviewRoutes =require('./routes/interviewRoutes');

const app = express();
app.use(express.json());
// Database connect
connectDB();

app.get("/", (req, res) => {
    res.send("hello");
});
app.use("/api/users", userRoute);
app.use('/api/interviews',interviewRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
