const Order = function (sequelize, Sequelize) {
    return sequelize.define(
        "order", {
            orderId: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            customId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "customer",
                    key: "customerId",
                }
            },
            deliveryId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "delivery",
                    key: "deliveryId",
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
            orderDate: {
                type: Sequelize.DATE,
                allowNull: false,
            }
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