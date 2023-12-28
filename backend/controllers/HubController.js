const {models: {Branch}} = require("../models");
const Joi = require("joi")
class HubController {
    //GET /hub
    async getAllHub(req, res, next) {
        const hubs = await Branch.findAll({
            where: {
                isHub: true,
            }
        })
        return res.status(200).json(hubs);
    }

    //GET /hub/:hubId
    async getHubById(req, res, next) {
        const schema = Joi.object({
            id: Joi.number().min(1).required(),
        });
        const result = schema.validate({
            id: req.params.hubId,
        });
        if (result.error) {
            return res.status(400).send("Bad request");
        }

        const hubId = req.params.hubId;
        const hub = await Branch.findOne({
            where: {
                hubId: hubId,
                isHub: true,
            },
        });

        if (!hub) {
            return res.status(404).json({
                status: "Query fail",
                msg: `Hub with id ${hubId} doesn't exist`,
            });
        }
        return res.status(200).json(hub);
    }

    //GET /hub/:hubId/branch
    async getAllBranchOfHub(req, res, next) {
        const schema = Joi.object({
            id: Joi.number().min(1).required(),
        });
        const result = schema.validate({
            id: req.params.hubId,
        });
        if (result.error) {
            return res.status(400).send("Bad request");
        }
        const hubId = req.params.hubId;
        const hub = await Branch.findOne({
            where: {
                hubId: hubId,
                isHub: true,
            },
        });
        if (!hub) {
            return res.status(401).json({
                status: "Query fail",
                msg: `Hub with id ${hubId} doesn't exist`,
            });
        }

        const branches = await Branch.findAll({
            where: {
                hubId: hubId,
                isHub: false,
            },
        })
        return res.status(200).json(branches);
    }
}

module.exports = new HubController();