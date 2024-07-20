const {Sequelize, DataTypes} = require('sequelize')
require("dotenv").config()
const Password_sql = process.env.Password_sql
const host = process.env.host
const sequelize = new Sequelize('ecommerce', "avnadmin", Password_sql, {
    host: host,
    dialect: "mysql",
    port: 21206
})


module.exports = {sequelize, DataTypes}
