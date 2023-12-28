const {models: {Customer, Order}} = require("../models");

class CustomerController {
    //GET /customer
    async getAllCustomers(req, res, next) {
        const customers = await Customer.findAll({
            include: [
                {
                    model: Order,
                    required: true,
                }
            ],
        });
        return res.status(200).json(customers);
    }

    //GET /customer/:customerId
    async getCustomerById(req, res, next) {
        const schema = Joi.object({
            id: Joi.number().min(1).required(),
        });
        const result = schema.validate({
            id: req.params.customerId,
        });
        if (result.error) {
            return res.status(400).send("Invalid ID");
        }
        const customerId = req.params.customerId;
        const customer = await Customer.findOne({
            where: {
                customerId: customerId,
            },
            include: [
                {
                    model: Order,
                    required: true,
                }
            ],
        });
        if (!customer) {
            return res.status(404).json({
                msg: "Customer not found",
            });
        }
        return res.status(200).json(customer);
    }
}

module.exports = new CustomerController();
