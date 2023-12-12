const Employee = function (sequelize, Sequelize) {
    return sequelize.define(
        "employee", {
            employeeId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            firstName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            dateOfBirth: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            roleId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "role",
                    key: "roleId",
                },
            },
            branchId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: true,
                references: {
                    model: "branch",
                    key: "branchId",
                },
            }
        },
        {
            sequelize,
            tableName: "employee",
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    using: "BTREE",
                    unique: true,
                    fields: [
                        {
                            name: "employeeId"
                        }
                    ]
                },
                {
                    name: "employeeRoleId",
                    using: "BTREE",
                    fields: [
                        {
                            name: "roleId"
                        },
                    ]
                },
                {
                    name: "employeeBranchId",
                    using: "BTREE",
                    fields: [
                        {
                            name: "branchId"
                        },
                    ]
                }
            ]
        }
    )
}

module.exports = Employee