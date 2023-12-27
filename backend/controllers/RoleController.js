const {models: {Role, Employee}} = require("../models");

class RoleController {

    //GET /role
    async getAllRoles(req, res, next) {
        const roles = await Role.findAll();
        return res.status(200).json(roles);
    }

    //GET /role/:roleId
    async getEmployeesByRole(req, res, next) {
        const roleId = req.params.roleId;
        const role = await Role.findOne({
            where: {
                roleId: roleId,
            }
        })
        if (!role) {
            return res.status(404).json({
                msg: `There is no role with id ${roleId}`,
            });
        }
        const employees = await Employee.findAll({
            where: {
                roleId: req.params.roleId,
            },
            include: [
                {
                    model: Role,
                    required: true,
                },
            ],
        });
        return res.status(200).json(employees);
    }

}

module.exports = new RoleController();
