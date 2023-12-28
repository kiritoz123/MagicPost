const express = require('express');
const router = express.Router();
const { authentication, authorization } = require('../../middleware/auth.js')
const {} = require("../../controllers/DeliveryController.js");

router.get("/", authentication, authorization(["admin", 1]), getAllDelivery);
router.post("/:deliveryId/transshipment", authentication, authorization(["admin", 1]), transshipment);
router.post("/create", authentication, createDelivery);
router.post("/:deliveryId/receive", authentication, receiveDelivery);
router.get("/:orderId", getPath);

module.exports = router;