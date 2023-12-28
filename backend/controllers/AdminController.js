const dotenv = require("dotenv").config()
const joi = require("joi")
const bcrypt = require("bcrypt")
const { models: {Admin }} = require("../models")

class AdminController {

    //POST /admin/create
    async adminCreateAccount(req, res, next) {
        const adminCreateSchema = createJoiObject(
            {
                username: joi.string().alphanum().required().min(5).max(255),
                password: joi.string().required()
            }
        );
        const {error} = adminCreateSchema.validate(req.body)
        if(error){
            return res.status(400).json({
                msg: "Invalid request!"
            })
        }
        const adminUsername = req.body.username;
        const adminPassword = req.body.password;
        if (!adminUsername || !adminPassword) {
            return res.status(400).json({
                msg: "Missing username or password!",
            })
        }
        const adminExist = await Admin.findOne({
            where: {
                username: adminUsername
            }
        });
        if (adminExist) {
            return res.status(400).json({
                msg: "Admin account already exists!",
            })
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(adminPassword, salt);
        const admin = await Admin.create({
            username: adminUsername,
            password: hash
        })
        return res.status(200).json({
            msg: "Create admin account successfully!",
            admin,
        })
    }

    //POST /admin/login
    async adminLogIn(req, res, next) {
        const adminLoginSchema = createJoiObject(
            {
                username: joi.string().alphanum().required().min(5).max(255),
                password: joi.string().required()
            }
        );
        const {error} = adminLoginSchema.validate(req.body)
        if(error){
            return res.status(400).json({
                msg: "Invalid request!"
            })
        }
        const adminUsername = req.body.username;
        const adminPassword = req.body.password;
        const admin = await Admin.findOne({
            where: {
                username: adminUsername
            }
        });
        if (!admin) {
            return res.status(401).json({
                msg: "Your admin account does not exist!",
            })
        }
        const checkedPassword = bcrypt.compareSync(adminPassword, admin.password);
        if (!checkedPassword) {
            return res.status(401).json({
                msg: "Wrong password!",
            })
        }

        req.session.user = {
            username: adminUsername,
            role: "admin",
        }

        return res.status(200).json({
            msg: "Log in successfully!",
        })
    }

    //POST /admin/logout
    async adminLogOut(req, res, next) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({
                    msg: "Error logging out",
                });
            } else {
                res.clearCookie("connect.sid");
                return res.status(200).json({
                    msg: "Logout successfully",
                })
            }
        })
        next();
    }
}

module.exports = new AdminController()