const Order = function (sequelize, Sequelize) {
    return sequelize.define(
        "order", {
            orderId: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            customerId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "customer",
                    key: "customerId",
                }
            },
            parcelId:  {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "parcel",
                    key: "parcelId",
                }
            },
            employeeId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "employee",
                    key: "employeeId",
                }
            },
            statusId: {
                type: Sequelize.TINYINT(1).UNSIGNED,
                allowNull: false,
                defaultValue: 1,
                references: {
                    model: "status",
                    key: "statusId",
                }
            },
            branchId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "branch",
                    key: "branchId",
                }
            },
            orderDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            receiverName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            receiverPhone: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            receiverAddress: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "order",
            timestamps: false,
            indexes: [
                {
                    name: "orderPrimaryIndex",
                    using: "BTREE",
                    unique: true,
                    fields: [
                        {
                            name: "orderId"
                        }
                    ]
                }
            ]
        }
    )
}

module.exports = Order;