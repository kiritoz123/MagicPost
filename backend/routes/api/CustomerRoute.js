const express = require('express');
const { authentication, authorization } = require('../../middleware/auth.js')
const router = express.Router()
const { getAllCustomers, getCustomerById } = require("../../controllers/CustomerController")

router.get("/", authentication, getAllCustomers)
router.get("/:customerId", authentication, getCustomerById)

module.exports = router