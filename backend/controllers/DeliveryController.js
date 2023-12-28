const {models: {Delivery, Order, Branch, Parcel}} = require("../models");
const Joi = require("joi");
class DeliveryController {
    //GET /delivery
    async getAllDelivery(req, res, next) {
        const deliveries = await Delivery.findAll();
        return res.status(200).json(deliveries);
    }

    //POST /delivery/:deliveryId/transshipment
    async transshipment(req, res) {
        const idSchema = Joi.number().integer().min(1);
        const objectIdSchema = Joi.object({
            customerId: idSchema.required(),
            employeeId: idSchema.required(),
        });

        const dataToValidate = {
            customerId: req.params.deliveryId,
            employeeId: req.body.receiverId,
        }

        const result = objectIdSchema.validate(dataToValidate);

        if (result.error) {
            return res.status(400).send("Bad request");
        }

        const deliveryId = req.params.deliveryId;
        let delivery = await Delivery.findOne({
            where: {
                deliveryId: deliveryId,
            },
        });
        if (!delivery) {
            return res.status(404).json({
                msg: `Delivery with id ${deliveryId} is not found!`,
            });
        }
        const receiverId = req.body.receiverId;
        const receiver = await Branch.findOne({
            where: {
                branchId: receiverId,
            }
        });
        if (!receiver) {
            return res.status(404).json({
                msg: "Branch not found",
            })
        }

        const senderId = delivery.receiverId;

        await Delivery.update({
                senderId: senderId,
                receiverId: receiverId,
            }, {
                where: {
                    deliveryId: deliveryId,
                },
            }
        );
        delivery = await Delivery.findOne({
            where: {
                deliveryId: deliveryId,
            },
        });

        return res.status(200).json(delivery);
    }

    //POST /delivery/create
    async createDelivery(req, res) {
        const order = req.body.orderId;
        const sender = req.session.User.branchId;
        const receiver = req.body.receiverId;
        const sendDate = new Date();
        if (!(await Order.findOne({
            where: {
                orderId: order,
            }
        }))) {
            return res.status(404).json({
                msg: "Order not found",
            })
        }
        if (!(await Branch.findOne({
            where: {
                branchId: receiver,
            }
        }))) {
            return res.status(404).json({
                msg: "Branch not found",
            })
        }
        const delivery = await Delivery.create({
            orderId: order,
            senderId: sender,
            receiverId: receiver,
            sendDate: sendDate
        });

        return res.status(200).json({
            msg: "Create successfully",
            delivery: delivery,
        });
    }

    //POST /delivery/:deliveryId/receive
    async receiveDelivery(req, res) {

        const deliveryId = req.params.deliveryId;
        const receiveDate = new Date();
        const delivery = await Delivery.findOne({
            where: {
                deliveryId: deliveryId,
            }
        });
        if (!delivery) {
            return res.status(404).json({
                msg: "Delivery not found",
            });
        }
        await delivery.update({
            sendDate: receiveDate,
        });
        return res.status(200).json(delivery);
    }

    //GET /delivery/:orderId
    async getPath(req, res) {
        const orderId = req.params.orderId;
        const order = await Order.findOne({
            where: {
                orderId: orderId,
            }
        });
        if (!order) {
            return res.status(404).json({
                nsg: "Order not found",
            })
        }
        const path = await Delivery.findAll({
            where: {
                orderId: orderId,
            }
        });
        return res.status(200).json({
            path: path,
        })
    }
}

module.exports = new DeliveryController();

