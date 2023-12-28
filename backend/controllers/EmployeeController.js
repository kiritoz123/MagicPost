const {models: {Employee, Role}} = require("../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
class EmployeeControler {
    //POST /login
    async employeeLogIn(req, res, next) {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
        const {error} = loginSchema.validate(req.body)
        if (error) {
            return res.status(400).json({
                msg: "Bad request!",
            })
        }
        const loginEmail = req.body.email.toLowerCase();
        const loginPassword = req.body.password;

        const employee = await Employee.findOne({
            where: {
                email: loginEmail
            }
        });

        if (!employee) {
            return res.status(401).json({
                msg: "Your account does not exist!",
            })
        }

        const checkedPassword = await bcrypt.compareSync(
            loginPassword,
            employee.password,
        );

        if (!checkedPassword) {
            return res.status(200).json({
                msg: "Wrong password!",
            });
        }
        
        req.session.user = {
            id: employee.employeeId,
            email: employee.email,
            role: employee.roleId,
        }
        
        return res.status(200).json({
            msg: "Log in successfully!",
            user: 
            {
                id: employee.employeeId,
                email: employee.email,
                role: employee.roleId
            }
        })
    }

    //POST /logout
    async employeeLogOut(req, res, next) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    msg: "Error logging out",
                });
            } else {
                res.clearCookie("connect.sid");
                return res.json({
                    success: true,
                    msg: "Logout successfully",
                })
            }
        })
    }
    //POST /employee/create
    async employeeCreateAccount(req, res, next) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            address: Joi.string().required(),
            phone: Joi.string().pattern(
                new RegExp("^\\+?[0-9]{1,15}$")
            ).required(),
            roleId: Joi.number().integer().min(1).max(5),
            branchId: Joi.number().integer().min(1),
        });

        const result = schema.validate({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            phone: req.body.phone,
            roleId: req.body.roleId,
            branchId: req.body.branchId,
        });

        if (result.error) {
            console.log(result.error);
            return res.status(400).send("Bad request");
        }

        const accountEmail = req.body.email;
        const accountPassword = req.body.password;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const dateOfBirth = req.body.dateOfBirth;
        const address = req.body.address;
        const phone = req.body.phone;

        let roleId;
        let branchId;
        if (req.session.user.role === 1 || req.session.user.role === "admin") {
            roleId = req.body.roleId;
            branchId = req.body.branchId;
        }
        if (req.session.user.role === 2 || req.session.user.role === 4) {
            roleId = req.session.user.role + 1;
            branchId = req.session.user.branchId;
        }

        // Check for duplication.
        if (await Employee.findOne({
            where: {
                email: accountEmail.toLowerCase(),
            },
        })) {
            return res.status(200).json({
                msg: "Email is already existed!",
            });
        } else if (await Employee.findOne({
            where: {
                phone: phone,
            },
        })) {
            return res.status(200).json({
                msg: "Phone number is already existed!",
            });
        }
        
        const salt = bcrypt.genSaltSync(10);
        const hashedPw = bcrypt.hashSync(accountPassword, salt);

        if (!hashedPw) {
            throw new Error("Hashed password error");
        }
        const employee = await Employee.create({
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            address: address,
            phone: phone,
            email: accountEmail,
            password: hashedPw,
            roleId: roleId,
            branchId: branchId,
        })
        return res.status(200).json({
            msg: "Create account successfully!",
            employee: {
                employee_id: employee.employeeId,
                role_id: employee.roleId,
                email: employee.email,
                phone: employee.phone,
                fullName: `${employee.firstName} ${employee.lastName}`,
                branchId: branchId,
            }
        })
    }
    //POST /employee/:employeeId/update
    async employeeUpdateAccount(req, res, next) {
        if (req.session.user.role === "admin") {
            try {

                const email = req.body.email;
                const password = req.body.password;
                const firstName = req.body.firstName;
                const lastName = req.body.lastName;
                const dateOfBirth = req.body.dateOfBirth;
                const address = req.body.address;
                const phone = req.body.phone;
                const roleId = req.body.roleId;
                const branchId = req.body.branchId;
                                    
                // Update the employee's account with the provided fields
                const updatedFields = {};
                
                if (firstName) {
                    updatedFields.firstName = firstName;
                }
                
                if (lastName) {
                    updatedFields.lastName = lastName;
                }
                
                if (dateOfBirth) {
                    updatedFields.dateOfBirth = dateOfBirth;
                }
                
                if (address) {
                    updatedFields.address = address;
                }
                
                if (phone) {
                    updatedFields.phone = phone;
                }
                
                if (email) {
                    updatedFields.email = email;
                }
                
                if (password) {
                    const hashedPw = await bcrypt.hash(accountPassword, bcryptRound);
                    updatedFields.password = hashedPw;
                }
                
                if (roleId) {
                    updatedFields.roleId = roleId;
                }
                
                if (branchId) {
                    updatedFields.branchId = branchId;
                }
                console.log(updatedFields)
                const employee = await Employee.findOne({
                    where: {
                        employeeId: req.params.employeeId,
                    }
                });

                if (!employee) {
                    res.status(500).json({message: "Employee doesn't exist!"})
                } else {
                    employee.set(updatedFields);
                    // Update the employee's account in the database
                    await employee.save();
                  
                    // Send a response indicating success
                    res.status(200).json({ message: 'Employee account updated successfully'});    
                }   
            } catch (error) {
                // Handle any errors that occur during the update process
                res.status(500).json({ error: 'Failed to update employee account' });
                next(error);
            }
        }

        if (req.session.user.role === 2 || req.session.user.role === 4) {
            try {
                const user = await Employee.findOne(
                    {
                        where: {
                            id: req.session.user.id,
                        }
                    }
                )
                const email = req.body.email;
                const password = req.body.password;
                const firstName = req.body.firstName;
                const lastName = req.body.lastName;
                const dateOfBirth = req.body.dateOfBirth;
                const address = req.body.address;
                const phone = req.body.phone;
                
                // Update the employee's account with the provided fields
                const updatedFields = {};
                
                if (firstName) {
                    updatedFields.firstName = firstName;
                }
                
                if (lastName) {
                    updatedFields.lastName = lastName;
                }
                
                if (dateOfBirth) {
                    updatedFields.dateOfBirth = dateOfBirth;
                }
                
                if (address) {
                    updatedFields.address = address;
                }
                
                if (phone) {
                    updatedFields.phone = phone;
                }
                
                if (email) {
                    updatedFields.email = email;
                }
                
                if (password) {
                    const hashedPw = await bcrypt.hash(accountPassword, bcryptRound);
                    updatedFields.password = hashedPw;
                }
                
                const employee = await Employee.findOne({
                    where: {
                        employeeId: req.params.id,
                        branchId: user.branchId,
                    }
                });
                if (!employee) {
                    res.status(500).json({message: "Employee doesn't exist!"})
                } else {
                    employee.set(updatedFields);
                    // Update the employee's account in the database
                    await employee.save();
                  
                    // Send a response indicating success
                    res.status(200).json({ message: 'Employee account updated successfully'});    
                }   
            } catch (error) {
                // Handle any errors that occur during the update process
                res.status(500).json({ error: 'Failed to update employee account' });
                next(error);
            }
        }
    }

    //POST /employee/:employeeId/delete
    async employeeDeleteAccount(req, res, next) {
        const employee_id = req.params.employeeId;
        if (employee_id == req.session.user.id) {
            res.status(500).json({message: "You can't delete yourself!"});
        }

        if (req.session.user.role === 2 || req.session.user.role === 4) {
            try {
                const employee = await Employee.findOne(
                    {
                        where: {
                            employeeId: employee_id,
                            branchId: user.branchId,
                        }
                    }
                )
                if (!employee) {
                    res.status(500).json({message: "Employee doesn't exist!"})
                } else {
                    await employee.destroy();
                }   
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete employee account' });
                next(error);  
            }
        }

        if (req.session.user.role === 1 || req.session.user.role === "admin") {
            try {
                const employee_id = req.params.employeeId;
                const employee = await Employee.findOne(
                    {
                        where: {
                            employeeId: employee_id,
                        }
                    }
                )
                if (!employee) {
                    res.status(500).json({message: "Employee doesn't exist!"})
                } else {
                    await employee.destroy();
                }   
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete employee account' });
                next(error);  
            }
        }
    }

    //GET /employee
    async getAllEmployee(req, res, next) {
        return res.status(200).json(
            await Employee.findAll({
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: Role,
                        required: true,
                    },
                ],
            })
        );
    }
    //GET /employee/manager
    async getAllManager(req, res, next) {
        return res.status(200).json(
            await Employee.findAll({
                where: {
                    [Op.or]: [
                        {roleId: 2},
                        {roleId: 3}
                    ]
                },
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: Role,
                        required: true,
                    },
                ],
            })
        );
    }

    //GET /employee/manager/branch
    async getAllBranchManager(req, res, next) {
        return res.status(200).json(
            await Employee.findAll({
                where: {
                    roleId: 2,
                },
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: Role,
                        required: true,
                    },
                ],
            })
        ); 
    }
    //GET /employee/manager/hub
    async getAllHubManager(req, res, next) {
        return res.status(200).json(
            await Employee.findAll({
                where: {
                    roleId: 3,
                },
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: Role,
                        required: true,
                    },
                ],
            })
        );
    }

    //GET /employee/:employeeId
    async getEmployeeById(req, res, next) {
        const idSchema = Joi.number().integer().min(1);
        const result = idSchema.validate(req.params.id);
        if (result.error) {
            return res.status(400).send("Bad request");
        }
        const employee_id = req.params.employeeId;
        const employee = await Employee.findOne({
            where: {
                employeeId: employee_id,
            },
            attributes: {
                exclude: ["password"],
            },
            include: [
                {
                    model: Role,
                    required: true,
                }
            ]
        });
        if (!employee) {
            return res.status(404).json({
                status: "Query fail",
                msg: `Employee with id ${employeeId} doesn't exists`,
            });
        }
        return res.status(200).json(employee);
    }
}

module.exports = new EmployeeControler();