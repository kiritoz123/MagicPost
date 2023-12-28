const admin_route = require("./api/AdminRoute")
const employee_route = require("./api/EmployeeRoute")
const session_data_route = require("./api/SessionDataRoute")
const role_route = require("./api/RoleRoute")
const branch_route = require("./api/BranchRoute")
const hub_route = require("./api/HubRoute")
const customer_route = require("./api/CustomerRoute")
const parcel_route = require("./api/ParcelRoute")
const order_route = require("./api/OrderRoute")
const delivery_route = require("./api/DeliveryRoute")

const express = require("express")

router = express.Router()
router.use("/", session_data_route);
router.use("/admin",admin_route);
router.use("/employee", employee_route);
router.use("/role", role_route);
router.use("/branch", branch_route);
router.use("/hub", hub_route);
router.use("/customer", customer_route);
router.use("/parcel", parcel_route);
router.use("/order", order_route);
router.use("/delivery", delivery_route);
module.exports = router;