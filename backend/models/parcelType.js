const ParcelType = function (sequelize, Sequelize) {
    return sequelize.define("parcelType", {
        typeId: {
            type: Sequelize.TINYINT(1),
            allowNull: false,
            primaryKey: true,
        },
        typeName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: "parcelType",
        timestamps: false,
        indexes: [
            {
                name: 'parcelTypePrimaryIndex',
                using: "BTREE",
                unique: true,
                fields: [
                    {
                        name: "typeId",
                    },
                ],
            }
        ]
    });
}

module.exports = ParcelType;