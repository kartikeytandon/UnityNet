const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser")

// Importing Routes
const Post = require("./routes/Post");
const User = require("./routes/User");

const app = express()
dotenv.config()

const PORT = process.env.PORT

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(err);
    }
}

mongoose.connection.on('disconnected', () => {
    console.log("MongoDB Disconnected");
})

mongoose.connection.on('connected', () => {
    console.log("MongoDB Connected");
})


app.get('/', (req, res) => {
    res.send("Seems like you are at the Right place..!")
})

// Using Middleware
app.use(express.json())
app.use(cookieParser());

app.use('/api/v1', Post)
app.use('/api/v1', User)

app.listen(PORT, () => {
    connect()
    console.log(`Server is running at ${PORT}`)
})