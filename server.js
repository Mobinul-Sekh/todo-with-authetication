const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const todoRouter = require('./routes/index')
const authRouter = require('./routes/auth');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true })

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Connected to DB");
})

// routes
app.use('/', todoRouter);
app.use('/', authRouter)

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3500;
}

app.listen(port, function () {
    console.log(`server is running on http://localhost:${port}/`);
})