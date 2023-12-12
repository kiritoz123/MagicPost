const Role = function (sequelize, Sequelize) {
    return sequelize.define("role", {
        roleId: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        roleName: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        tableName: "role",
        timestamps:false,
        indexes: [
            {
                name: "rolePrimaryIndex",
                unique: true,
                using: "BTREE",
                fields: [
                    {name: "roleId",},
                ]
            },
        ]
    })
};

module.exports = Role;