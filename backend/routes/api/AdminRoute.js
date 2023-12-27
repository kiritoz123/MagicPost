const express = require('express')
const { authentication, authorization } = require('../../middleware/auth.js')
const { adminLogIn, adminLogOut, adminCreateAccount } = require('../../controllers/AdminController.js')
const router = express.Router()

router.get("/", authentication, authorization(["admin"]), (req, res) => {
    res.status(200).json({
        msg: "Admin Page",
    })
});

router.post("/login", adminLogIn);
router.post("/logout", authentication, authorization(["admin"]), adminLogOut);
router.post("/create", authentication, authorization(["admin"]), adminCreateAccount);

module.exports = router;