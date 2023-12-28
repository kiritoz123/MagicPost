const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv').config()
const db = require('./models');
const dbConfig = require('./config/db.config');
const session = require('express-session');
const app = express();
const routes = require("./routes");

dbInitialize()

async function dbInitialize() {
    const { host, port, user, password, database } = {
        host: dbConfig.HOST,
        port: dbConfig.port,
        user: dbConfig.USER,
        password: dbConfig.PASSWORD,
        database: dbConfig.DB,
    };

    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await db.sequelize.sync({alter: true});
}

// CORS
const corsOptions = {
    origin: "http://localhost:5000",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        }
    )
);

// Simple route.
app.get("/", (req, res) => {
    res.json({message: "Test server 1"});
});

app.use("/api", routes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
