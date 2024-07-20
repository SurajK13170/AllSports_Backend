const {sequelize, DataTypes} = require('../db');
const { Product } = require('./Product.model');
const Category = sequelize.define("Category",{
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});
Category.associate = function (models) {
  Category.hasMany(models.Product, { foreignKey: 'categoryId' });
};
module.exports = {Category};
