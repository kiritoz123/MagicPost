const {models: {Parcel, Order}} = require("../models");
const {or} = require("sequelize");
const Joi = require("joi");
const Employee = require("../models/employee");

class ParcelController {

    //GET /parcel
    async getAllParcels(req, res, next) {
        const parcels = await Parcel.findAll();
        return res.status(200).json(parcels);
    }

    //GET parcel/:orderId/receive
    async receiveParcel(req, res, next) {
        const orderId = req.params.orderId;
        const order = await Order.findOne({
            where: {
                order_id: orderId,
            },
            include: Parcel,
        });
        if (!order) {
            return res.status(404).json({
                msg: "Order not found",
            });
        }
        const user = await Employee.findOne({
            where:
            {
                employeeId: req.session.user.id,
            }
        })
        await order.parcel.update({
            branchId: user.branchId
        });
        const parcel = await Parcel.findOne({
            include: [
                {
                    model: Order,
                    where: {
                        order_id: orderId,
                    },
                    required: true,
                    attributes: [],
                },
            ],
        });
        return res.status(200).json({
            msg: "Success",
            parcel: parcel,
        });
    }

}

module.exports = new ParcelController();
