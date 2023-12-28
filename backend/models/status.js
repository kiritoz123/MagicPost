const Status = function (sequelize, Sequelize) {
    return sequelize.define("status",{
        statusId:{
            type:Sequelize.TINYINT(1).UNSIGNED,
            allowNull: false,
            primaryKey: true,
        },
        statusDetail:{
            type: Sequelize.STRING,
            allowNull: false,
        },
    },{
        sequelize,
        tableName: "status",
        timestamps: false,
        indexes:[
            {
                name:"statusPrimaryIndex",
                using:"BTREE",
                unique:true,
                fields:[
                    {name: "statusId",},
                ],
            },
        ],
    });
}

module.exports = Status;
