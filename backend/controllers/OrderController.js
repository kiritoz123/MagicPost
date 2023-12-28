const {models: {Order, Customer, Delivery, Employee, Parcel}} = require("../models");
const sequelize = require("sequelize");

class OrderController {
    //GET /order
    async getAllOrders(req, res, next) {
        const schema = Joi.object({
            searchValue: Joi.string().pattern(new RegExp('^[A-Z0-9,]+$')).required(),
        });
        const validate = schema.validate(req.body);
        if (validate.error) {
            return res.status(400).send("Bad request");
        }

        const orders = await Order.findAll({
            include: [
                {
                    model: Customer,
                    required: true,
                }, {
                    model: Employee,
                    required: true,
                    attributes: {
                        exclude: ["password", "address", "dateOfBirth"],
                    },
                }, {
                    model: Parcel,
                    required: true,
                },
            ],
        });
        return res.status(200).json(orders);
    }

    //GET order/tracking
    async getOrderByIds(req, res, next) {
        const searchValue = req.body.searchValue;
        const orderIds = searchValue.split(",");
        console.log(orderIds);
        let result = [];
        for (let orderId of orderIds) {
            const order = await Order.findOne({
                where: {
                    orderId: orderId,
                },
                include: [
                    {
                        model: Customer,
                        required: true,
                        attributes: [
                            [sequelize.fn("concat", sequelize.col("Customer.firstName"), " ", sequelize.col("Customer.lastName")), "fullName"],
                        ],
                    }, {
                        model: Employee,
                        required: true,
                        attributes: [
                            [sequelize.fn("concat", sequelize.col("Employee.firstName"), " ", sequelize.col("Employee.lastName")), "fullName"],
                        ],
                    }, {
                        model: Parcel,
                        required: true,
                    },
                ],
            });
            if (!order) {
                result.push({
                    isFound:false,
                });
            } else {
                result.push({
                    order: order,
                    isFound:true,
                });
            }
        }
        return res.status(200).json(result);
    }

    //POST /order/create
    async createOrder(req, res, next) {
        const schema = Joi.object({
            name: Joi.string().pattern(
                new RegExp("/^[\p{L}\p{M}- ]+$/u")
            ),
            firstName: Joi.string().pattern(
                new RegExp("/^[\p{L}\p{M}- ]+$/u")
            ).required(),
            lastName: Joi.string().pattern(
                new RegExp("/^[\p{L}\p{M}- ]+$/u")
            ).required(),
            province: Joi.string().pattern(
                new RegExp("/^[\p{L}\p{M}- ]+$/u")
            ).required(),
            district: Joi.string().pattern(
                new RegExp("/^[\p{L}\p{M}- ]+$/u")
            ).required(),
            detailAddress: Joi.string().pattern(
                new RegExp("/^[\p{L}\p{M}-,./ ]+$/u")
            ).required(),
            receiverName: Joi.string().pattern(
                new RegExp("/^[\p{L}\p{M}- ]+$/u")
            ).required(),
            receiverProvince: Joi.string().pattern(
                new RegExp("/^[\p{L}\p{M}- ]+$/u")
            ).required(),
            receiverDistrict: Joi.string().pattern(
                new RegExp("/^[\p{L}\p{M}- ]+$/u")
            ).required(),
            receiverPhone: Joi.string().pattern(
                new RegExp("/^(0[23789]|05)\d{8}$/")
            ).required(),
            receiverDetailAddress: Joi.string().pattern(
                new RegExp("/^[\p{L}\p{M}-,./ ]+$/u")
            ).required(),
            email: Joi.string().email(),
            phone: Joi.string().pattern(
                new RegExp("/^(0[23789]|05)\d{8}$/")
            ).required(),
            weight: Joi.number().min(0),
            price: Joi.number().integer().min(1),
            typeId: Joi.number().integer().min(1).max(2),
            details: Joi.string().required(),
        });
        const validate = schema.validate(req.body);
        if (validate.error) {
            return res.status(400).send("Bad request");
        }

        const firstName = req.body.firstName
        const lastName = req.body.lastName
        const province = req.body.province
        const district = req.body.district
        const detailAddress = req.body.detailAddress
        const receiverName = req.body.receiverName
        const receiverProvince = req.body.receiverProvince
        const receiverDistrict = req.body.receiverDistrict
        const phone = req.body.phone
        const typeId = req.body.typeId
        const weight = req.body.weight
        const price = req.body.price
        const details = req.body.details
        const receiverPhone = req.body.receiverPhone
        const receiverDetailAddress = req.body.receiverDetailAddress
        //Create customer
        const email = () => {
            if (req.body.email) {
                return req.body.email;
            }
        }
        const address = `${detailAddress}, ${district}, ${province}`;
        const customer = await Customer.create({
            firstName: firstName,
            lastName: lastName,
            address: address,
            email: email(),
            phone: phone,
        });

        //Create parcel
        const user = await Employee.findOne({
            where:
            {
                employeeId: req.session.user.id,
            }
        })
        const branchId = user.branchId;
        const parcel = await Parcel.create({
            branchId: branchId,
            weight: weight,
            price: price,
            typeId: typeId,
            details: details,
        });

        const receiverAddress = `${receiverDetailAddress}, ${receiverDistrict}, ${receiverProvince}`;
        const today = new Date();

        //Create order
        const employeeId = req.session.user.id;
        const orderId = generateRandomString();
        const order = await Order.create({
            orderId: orderId,
            customerId: customer.customerId,
            parcelId: parcel.parcelId,
            employeeId: employeeId,
            branchId: branchId,
            orderDate: today,
            receiveDate: today,
            receiverName: receiverName,
            receiverPhone: receiverPhone,
            receiverAddress: receiverAddress,
        });
        return res.status(200).json({
            msg: "Create order success!",
            order: order,
        });
    }
}

function generateRandomString() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 10;
    let randomString = '';
    for (let i = 0; i < length; ++i) {
        randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomString;
}


module.exports = new OrderController();
