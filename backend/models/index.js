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

db.models.Role = require("./role")(sequelize, Sequelize);
db.models.Parcel = require("./parcel")(sequelize, Sequelize);
db.models.Order = require("./order")(sequelize, Sequelize);
db.models.Employee = require("./employee")(sequelize, Sequelize);
db.models.Delivery = require("./delivery")(sequelize, Sequelize);
db.models.Customer = require("./customer")(sequelize, Sequelize);
db.models.Branch = require("./branch")(sequelize, Sequelize);
db.models.Status = require("./status")(sequelize, Sequelize);
db.models.ParcelType = require("./parcelType")(sequelize, Sequelize);

db.models.Employee.belongsTo(db.models.Role, {foreignKey: "role_id"});
db.models.Role.hasMany(db.models.Employee, {foreignKey: "role_id"});

db.models.Order.belongsTo(db.models.Customer, {foreignKey: "customer_id"});
db.models.Employee.hasMany(db.models.Order, {foreignKey: "customer_id"});

db.models.Order.belongsTo(db.models.Employee, {foreignKey: "employee_id"});
db.models.Employee.hasMany(db.models.Order, {foreignKey: "employee_id"});

db.models.Branch.belongsTo(db.models.Employee, {foreignKey: "manager_id"});
db.models.Employee.hasOne(db.models.Branch, {foreignKey: "manager_id"});

db.models.Employee.belongsTo(db.models.Branch, {foreignKey: "branch_id"});
db.models.Branch.hasMany(db.models.Employee, {foreignKey: "branch_id"});

db.models.Branch.belongsTo(db.models.Branch, {foreignKey: "hub_id"});
db.models.Branch.hasMany(db.models.Branch, {foreignKey: "hub_id"});

db.models.Order.belongsTo(db.models.Delivery, {foreignKey: "delivery_id"});
db.models.Delivery.hasOne(db.models.Order, {foreignKey: "delivery_id"});

db.models.Delivery.belongsTo(db.models.Branch, {foreignKey: "sender_id"});
db.models.Branch.hasMany(db.models.Delivery, {foreignKey: "sender_id"});

db.models.Delivery.belongsTo(db.models.Branch, {foreignKey: "receiver_id"});
db.models.Branch.hasMany(db.models.Delivery, {foreignKey: "receiver_id"});

db.models.Order.belongsTo(db.models.Parcel, {foreignKey: "parcel_id"});
db.models.Parcel.hasOne(db.models.Order, {foreignKey: "parcel_id"});

db.models.Parcel.belongsTo(db.models.Branch, {foreignKey: "branch_id"});
db.models.Branch.hasMany(db.models.Parcel, {foreignKey: "branch_id"});

db.models.Delivery.belongsTo(db.models.Status, {foreignKey: "status_id"});
db.models.Status.hasMany(db.models.Delivery, {foreignKey: "status_id"});

db.models.Parcel.belongsTo(db.models.ParcelType, {foreignKey: "type_id"});
db.models.ParcelType.hasMany(db.models.Parcel, {foreignKey: "type_id"});

module.exports = db;
