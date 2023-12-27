const express = require('express')
const { authentication, authorization } = require('../../middleware/auth.js')
const { getAllRoles, getEmployeesByRole } = require('../../controllers/RoleController.js')
const router = express.Router()

router.get("/", authentication, authorization(["admin", 1]), getAllRoles);
router.get("/:roleId", authentication, authorization(["admin", 1]), getEmployeesByRole);
module.exports = router;