const dbConfig = require("../config/db.config.js");
const {Sequelize} = require("sequelize");


const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
        port: dbConfig.port,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        },
        define: {
            timestamp: false,
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.models = {};

db.models.Admin = require("./admin")(sequelize, Sequelize);
db.models.Role = require("./role")(sequelize, Sequelize);
db.models.Parcel = require("./parcel")(sequelize, Sequelize);
db.models.Order = require("./order")(sequelize, Sequelize);
db.models.Employee = require("./employee")(sequelize, Sequelize);
db.models.Delivery = require("./delivery")(sequelize, Sequelize);
db.models.Customer = require("./customer")(sequelize, Sequelize);
db.models.Branch = require("./branch")(sequelize, Sequelize);
db.models.Status = require("./status")(sequelize, Sequelize);
db.models.ParcelType = require("./parcelType")(sequelize, Sequelize);

db.models.Employee.belongsTo(db.models.Role, {foreignKey: "roleId"});
db.models.Role.hasMany(db.models.Employee, {foreignKey: "roleId"});

db.models.Order.belongsTo(db.models.Customer, {foreignKey: "customerId"});
db.models.Employee.hasMany(db.models.Order, {foreignKey: "customerId"});

db.models.Order.belongsTo(db.models.Employee, {foreignKey: "employeeId"});
db.models.Employee.hasMany(db.models.Order, {foreignKey: "employeeId"});

db.models.Branch.belongsTo(db.models.Employee, {foreignKey: "managerId"});
db.models.Employee.hasOne(db.models.Branch, {foreignKey: "managerId"});

db.models.Employee.belongsTo(db.models.Branch, {foreignKey: "branchId"});
db.models.Branch.hasMany(db.models.Employee, {foreignKey: "branchId"});

db.models.Branch.belongsTo(db.models.Branch, {foreignKey: "hubId"});
db.models.Branch.hasMany(db.models.Branch, {foreignKey: "hubId"});

db.models.Order.belongsTo(db.models.Customer, {foreignKey: "customerId"});
db.models.Customer.hasMany(db.models.Order, {foreignKey: "customerId"});

db.models.Delivery.belongsTo(db.models.Order, {foreignKey: "deliveryId"});
db.models.Order.hasMany(db.models.Delivery, {foreignKey: "deliveryId"});

db.models.Order.belongsTo(db.models.Branch, {foreignKey: "branchId"});
db.models.Branch.hasMany(db.models.Order, {foreignKey: "branchId"});

db.models.Delivery.belongsTo(db.models.Branch, {foreignKey: "senderId"});
db.models.Branch.hasMany(db.models.Delivery, {foreignKey: "senderId"});

db.models.Delivery.belongsTo(db.models.Branch, {foreignKey: "receiverId"});
db.models.Branch.hasMany(db.models.Delivery, {foreignKey: "receiverId"});

db.models.Delivery.belongsTo(db.models.Order, {foreignKey: "orderId"});
db.models.Order.hasMany(db.models.Delivery, {foreignKey: "orderId"});

db.models.Order.belongsTo(db.models.Parcel, {foreignKey: "parcelId"});
db.models.Parcel.hasOne(db.models.Order, {foreignKey: "parcelId"});

db.models.Parcel.belongsTo(db.models.Branch, {foreignKey: "branchId"});
db.models.Branch.hasMany(db.models.Parcel, {foreignKey: "branchId"});

db.models.Order.belongsTo(db.models.Status, {foreignKey: "statusId"});
db.models.Status.hasMany(db.models.Order, {foreignKey: "statusId"});

db.models.Parcel.belongsTo(db.models.ParcelType, {foreignKey: "typeId"});
db.models.ParcelType.hasMany(db.models.Parcel, {foreignKey: "typeId"});

module.exports = db;