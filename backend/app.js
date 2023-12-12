const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

const app = express();
const db = require('./models');
(async () => {
    await db.sequelize.sync();
})();

// CORS
const corsOptions = {
    origin: "http://localhost:5000",
};

app.use(cors(corsOptions));

// Session and JSON


// Simple route.
app.get("/", (req, res) => {
    res.json({message: "Test server 1"});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
