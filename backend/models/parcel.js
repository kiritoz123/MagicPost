const Parcel = function (sequelize, Sequelize) {
    return sequelize.define(
        "parcel", {
            parcelId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            branchId: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "branch",
                    key: "branchId",
                }
            },
            weight: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            typeId: {
                type: Sequelize.TINYINT(1),
                allowNull: false,
            },
            details: {
                type: Sequelize.STRING,
                allowNull: false,    
            }
        },
        {
            sequelize,
            tableName: "parcel",
            timestamps: false,
            indexes: [
                {
                    name: "parcelPrimaryIndex",
                    using: "BTREE",
                    unique: true,
                    fields: [
                        {
                            name: "parcelId"
                        }
                    ]
                },
                {
                    name: "parcelBranchId",
                    using: "BTREE",
                    unique: false,
                    fields: [
                        {
                            name: "branchId"
                        }
                    ]
                }
            ]
        }
    )
}

module.exports = Parcel