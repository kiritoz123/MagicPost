const Delivery = function (sequelize, Sequelize) {
    return sequelize.define(
        "delivery", {
            deliveryId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            orderId: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: "order",
                    key: "orderId",
                }
            },
            senderId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "branch",
                    key: "branchId",
                },
            },
            receiverId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "branch",
                    key: "branchId",
                },
            },
            sendDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            receiveDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "delivery",
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    using: "BTREE",
                    unique: true,
                    fields: [
                        {
                            name: "deliveryId"
                        }
                    ]
                },
                {
                    name: "deliverySenderId",
                    using: "BTREE",
                    fields: [
                        {
                            name: "senderId"
                        }
                    ]
                },
                {
                    name: "deliveryReceiverId",
                    using: "BTREE",
                    fields: [
                        {
                            name: "receiverId"
                        }
                    ]
                },
            ]
        }
    )
}

module.exports = Delivery