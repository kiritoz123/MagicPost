const express = require("express");
const router = express.Router();

router.get("/setCookie", (req, res) => {
    res.cookie("user", "express").send("Cookie set");

});

router.get("/getData", (req, res) => {
    const sessionData = req.session.user || "No data";
    console.log(req.session.user);
    return res.json(sessionData);
});

module.exports = router;
