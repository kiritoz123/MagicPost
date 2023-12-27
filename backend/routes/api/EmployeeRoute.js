const express = require('express');
const { authentication, authorization } = require('../../middleware/auth.js')
const {validation} = require('../../middleware/validation.js')
const schema = require('../../middleware/schema.js')
const router = express.Router();
const {
    employeeCreateAccount, 
    employeeLogIn, 
    employeeLogOut, 
    employeeUpdateAccount, 
    employeeDeleteAccount, 
    getAllEmployee, 
    getAllManager, 
    getAllBranchManager, 
    getAllHubManager, 
    getEmployeeById
} = require('../../controllers/EmployeeController.js')

router.post("/create", authentication, authorization(["admin", 1, 2, 4]), employeeCreateAccount);
router.post("/login", employeeLogIn);
router.post("/logout", authentication, employeeLogOut);
router.post("/:employeeId/update", authentication, authorization(["admin", 1, 2, 4]), employeeUpdateAccount);
router.post("/:employeeId/delete", authentication, authorization(["admin", 1, 2, 4]), employeeDeleteAccount);
router.get("/", authentication, authorization(["admin", 1]), getAllEmployee);
router.get("/manager", authentication, authorization(["admin", 1]), getAllManager);
router.get("/manager/branch", authentication, authorization(["admin", 1]), getAllBranchManager);
router.get("/manager/hub", authentication, authorization(["admin", 1]), getAllHubManager);
router.get("/:employeeId", authentication, authorization(["admin", 1, 2, 4]), getEmployeeById);

module.exports = router;