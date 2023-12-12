const Delivery = function (sequelize, Sequelize) {
    return sequelize.define(
        "delivery", {
            deliveryId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
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
            status: {
                type: Sequelize.TINYINT(1),
                allowNull: false, // 1: pending, 2: delivering, 3: delivered, 4: return
                defaultValue: 1,
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
                {
                    name: "deliveryStatus",
                    using: "BTREE",
                    fields: [
                        {
                            name: "status"
                        }
                    ]
                }
            ]
        }
    )
}

module.exports = Delivery