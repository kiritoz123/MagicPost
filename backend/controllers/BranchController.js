const {models: {Branch, Employee, Parcel}} = require("../models");

class BranchController {

    //GET /branch
    async getAllBranch(req, res, next) {
        const branches = await Branch.findAll({
            include: [
                {
                    model: Employee,
                    required: true,
                },
            ],
        });
        return res.status(200).json(branches);
    }

    //POST /branch/create
    async createBranch(req, res, next) {
        const branchCreateSchema = createJoiObject(
            {
                managerId: Joi.number().integer().min(0).required(),
                branchName: Joi.string().required(),
                province: Joi.string().required(),
                district: Joi.string().required(),
                detailAddress: Joi.string().required(),
                isHub: Joi.number().integer().min(0).max(1).required(),    
            }
        );
        const {error} = branchCreateSchema.validate(req.body)
        if(error){
            return res.status(400).json({
                msg: "Invalid request!"
            })
        }
        const managerId = req.body.managerId;
        const branchName = req.body.branchName;
        const province = req.body.province;
        const district = req.body.district;
        const detailAddress = req.body.detailAddress;
        const isHub = req.body.isHub;
        const newBranch = async () => {
            if (isHub === 1) {
                return await Branch.create({
                    managerId: managerId,
                    branchName: branchName,
                    location: `${detailAddress}, ${district}, ${province}`,
                    isHub: isHub,
                    hubId: req.body.hubId,
                });
            } else {
                return await Branch.create({
                    managerId: managerId,
                    branchName: branchName,
                    location: `${detailAddress}, ${district}, ${province}`,
                    isHub: isHub,
                });
            }
        }
        return res.status(200).json({
            msg: "Create branch successfully",
            branch: newBranch(),
        })
    }

    //POST /branch/:branchId/update
    async updateBranch(req, res, next) {
        try {
            const branchUpdateSchema = createJoiObject(
                {
                    managerId: Joi.number().integer().min(0).required(),
                    branchName: Joi.string().required(),
                    province: Joi.string().required(),
                    district: Joi.string().required(),
                    detailAddress: Joi.string().required(),
                }
            );
            const {error} = branchUpdateSchema.validate(req.body)
            if(error){
                return res.status(400).json({
                    msg: "Invalid request!"
                })
            }
            const managerId = req.body.managerId;
            const branchName = req.body.branchName;
            const province = req.body.province;
            const district = req.body.district;
            const detailAddress = req.body.detailAddress;    
                        
            // Update the employee's account with the provided fields
            const updatedFields = {};
            
            if (managerId) {
                updatedFields.managerId = managerId;
            }
            
            if (branchName) {
                updatedFields.branchName = branchName;
            }
            
            if (province) {
                updatedFields.province = province;
            }
            
            if (district) {
                updatedFields.district = district;
            }
            
            if (detailAddress) {
                updatedFields.detailAddress = detailAddress;
            }
            
            const branch = await Branch.findOne({
                where: {
                    branchId: req.params.branchId,
                }
            });
            branch.set(updatedFields);
            // Update the employee's account in the database
            await branch.save();
            
            // Send a response indicating success
            res.status(200).json({ message: 'Employee account updated successfully' });
        } catch (error) {
            // Handle any errors that occur during the update process
            res.status(500).json({ error: 'Failed to update employee account' });
            next(error);
        }
    }
    //POST /branch/:branchId/delete
    async deleteBranch(req, res, next) {
        try {
            const branchId = req.params.branchId;
            const branch = await Branch.findOne(
                {
                    where: {
                        branchId: branchId,
                    }
                }
            )
            await branch.destroy();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete branch'});
            next(error);  
        }
    }
    //GET /branch/:branchId
    async getBranchById(req, res, next) {
        const branchId = req.params.branchId;
        const branch = await Branch.findOne({
            where: {
                branchId: branchId,
            },
        });

        if (!branch) {
            return res.status(401).json({
                status: "Query fail",
                msg: `Branch with id ${branchId} doesn't exist`,
            });
        }

        return res.status(200).json(branch);
    }

    //GET /branch/:branchId/employee
    async getEmployeeByBranch(req, res, next) {
        const employees = await Employee.findAll({
            attributes: [],
            where: {
                branchId: req.params.branchId,
            },
            include: [
                {
                    model: Branch,
                    required: true,
                    attributes: [],
                },
            ],
        });

        return res.status(200).json(employees);
    }

    //GET /branch/employee
    async getEmployeeByManager(req, res, next) {
        const branch = await Branch.findOne({
            where: {
                managerId: req.session.user.id,
            }
        })
        const branchId = branch.branchId;
        const employees = await Employee.findAll({
            where: {
                branchId: branchId,
            }
        })

        return res.status(200).json({
            employees: employees,
            branch: branch,
        });
    }

    //GET /branch/:branchId/parcel
    async getAllParcelsAtBranch(req, res) {

        const schema = Joi.object({
            id: Joi.number().min(1).required(),
        });
        const result = schema.validate({
            id: req.params.branchId,
        });
        if (result.error) {
            return res.status(400).send("Invalid ID");
        }
        const branchId = req.params.branchId;
        const branch = await Branch.findOne({
            where: {
                branchId: branchId,
            }
        });
        if (!branch) {
            return res.status(404).json({
                msg: "Branch not found!",
            });
        }
        const user = await Employee.findOne({
            where:
            {
                employeeId: req.session.user.id,
            }
        })
        if (user.branchId !== branch.branchId) {
            return res.status(403).json({
                msg: "Forbidden",
            })
        }
        const parcels = await Parcel.findAll({
            where: {
                branchId: branchId,
            }
        });
        return res.status(200).json(parcels);
    }

    //GET /branch/search
    async searchBranch(req, res) {
        const schema = Joi.object({
            province: Joi.string().pattern(
                new RegExp("/^[\p{L}\p{M}- ]+$/u")
            ),
            district: Joi.string().pattern(
                new RegExp("/^[\p{L}\p{M}- ]$/u")
            ),
        });
        const validate = schema.validate(req.body);
        if (validate.error) {
            return res.status(400).send("Bad request");
        }
        const province = req.body.province;
        const district = req.body.district;
        const branches = await Branch.findAll();
        let filteredBranches = [...branches];
        if (province) {
            filteredBranches = branches.filter(branch => branch.location.includes(province));
        }
        if (district) {
            filteredBranches = filteredBranches.filter(branch => branch.location.includes(district));
        }
        return res.status(200).json(filteredBranches);
    }
}

module.exports = new BranchController();
