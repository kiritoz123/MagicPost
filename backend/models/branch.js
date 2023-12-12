const Branch = function (sequelize, Sequelize) {
    return sequelize.define(
        "branch", {
            branchId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            managerId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "employee",
                    key: "employeeId",
                },
            },
            hubId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: true,
                references: {
                    model: "branch",
                    key: "branchId",
                },
            },
            branchName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            location: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            isHub: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            tableName: "branch",
            timestamps: false,
            indexes: [
                {
                    name: "branchPrimaryIndex",
                    using: "BTREE",
                    unique: true,
                    fields: [
                        {
                            name: "branchId"
                        }
                    ]
                },
                {
                    name: "branchHubId",
                    using: "BTREE",
                    unique: false,
                    fields: [
                        {
                            name: "hubId"
                        }
                    ]
                }
            ]
        }
    )
}

module.exports = Branch
