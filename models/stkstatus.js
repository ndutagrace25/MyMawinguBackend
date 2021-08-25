'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StkStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  StkStatus.init({
    account: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StkStatus',
  });
  return StkStatus;
};