const express = require('express');
const cors = require("cors");
const path = require('path');
const { DB_URI } = require("./config");
const db = require("./app/models");
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.resolve(__dirname, "public")));
app.use(cors({ origin: "http://localhost:8081" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.mongoose
    .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("Successfully connect to MongoDB."); })
    .catch(err => {
        console.error("MongoDB connection error", err);
        process.exit();
    });

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/patient.html");
});

app.use(function (req, res, next) {
    let origin = req.get('origin');
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH,OPTIONS,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, access-key, Authorization');
    next();
});

require("./app/routes/patient.routes")(app);
require("./app/routes/rfid.routes")(app, io);

const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});