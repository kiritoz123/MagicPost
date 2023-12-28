const Admin = (sequelize, Sequelize) => {
    return sequelize.define(
        "admin", {
            username: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
        }, 
        {
            sequelize,
            tableName: "admin",
            timestamps: false,
        }
    ) 
}

module.exports = Admin;