const express = require('express');
const { authentication, authorization } = require('../../middleware/auth.js')
const router = express.Router();
const {getAllOrders, getOrderByIds, createOrder} = require("../../controllers/OrderController.js");

router.get("/", authentication, authorization(["admin", 1, 2, 4]), getAllOrders);
router.get("/tracking", getOrderByIds);
router.post("/create", authentication, createOrder);

module.exports = router;