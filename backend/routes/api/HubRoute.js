const express = require("express")
const router = express.Router()
const {authorization, authentication} = require("../../middleware/auth.js")
const { getHubById, getAllBranchOfHub, getAllHub} = require("../../controllers/HubController");

router.get("/", authentication, authorization(["admin", 1]), getAllHub)
router.get("/:hubId", authentication, authorization(["admin", 1, 2, 4]), getHubById)
router.get("/hub/:hubId/branch", authentication, authorization(["admin", 1, 4]), getAllBranchOfHub)
module.exports = router;