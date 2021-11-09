const Sequelize = require('sequelize');
const sequelize = new Sequelize("postgres://postgres:Sophia@localhost:5432/work-out-log");
module.exports = sequelize;