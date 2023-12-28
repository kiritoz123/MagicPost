const express = require("express");
const router = express.Router();
const {authorization, authentication} = require("../../middleware/auth.js")
const { getAllBranch, getBranchById, getEmployeeByBranch, createBranch, updateBranch, deleteBranch } = require("../../controllers/BranchController");

router.get("/", authentication, authorization(["admin", 1]), getAllBranch)
router.get("/:branchId", authentication, authorization(["admin", 1]), getBranchById)
router.get("/:branchId/employee", authentication, authorization(["admin", 1]), getEmployeeByBranch)
router.get("/employee", authentication, authorization([2, 4]), getEmployeeByBranch)
router.post("/create", authentication, authorization(["admin", 1]), createBranch)
router.post("/:branchId/update", authentication, authorization(["admin", 1]), updateBranch)
router.post("/:branchId/delete", authentication, authorization(["admin", 1]), deleteBranch)
router.get("/:branchId/parcel", authentication, authorization(["admin", 1, 2, 4]), getBranchById)
router.get("/search", authentication, getBranchById)
module.exports = router;
