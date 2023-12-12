const Customer = function (sequelize, Sequelize) {
    return sequelize.define(
        "customer", {
            customerId: {
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
            address: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "customer",
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    using: "BTREE",
                    unique: true,
                    fields: [
                        {
                            name: "customerId"
                        }
                    ]
                }
            ]
        }
    )
}

module.exports = Customer;