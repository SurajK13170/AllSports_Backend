const { FOREIGNKEYS } = require('sequelize/lib/query-types')
const {sequelize, DataTypes} = require('../db')

const {Category} = require('./Category.model')
const Product = sequelize.define("Product",{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: Category,
          key: 'id'
        },
    }
})

Product.belongsTo(Category, {foreignKey: "categoryId"})

module.exports = {Product}