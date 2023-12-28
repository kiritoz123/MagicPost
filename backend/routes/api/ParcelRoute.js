const express = require('express');
const { authentication, authorization } = require('../../middleware/auth.js')
const router = express.Router()
const {getAllParcels, receiveParcel} = require("../../controllers/ParcelController.js");

router.get("/", authentication, getAllParcels);
router.get("/:orderId/receive", authentication, receiveParcel);

module.exports = router;