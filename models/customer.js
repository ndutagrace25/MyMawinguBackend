"use strict";
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      customer_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      customer_phone: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      customer_balance: {
        allowNull: true,
        type: DataTypes.DECIMAL,
      },
      customer_email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      churned_date: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      connection_expiry_date: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      status: {
        allowNull: true,
        type: DataTypes.TINYINT,
      },
      customer_special: {
        allowNull: true,
        type: DataTypes.TINYINT,
      },
      splynx_id: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      connection_status: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      nav_last_date_modified: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      last_payment_date: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      created_by: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      modified_by: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      created_at: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "customers",
      operatorsAliases: false,
    }
  );
  Customer.associate = function (models) {
    // associations can be defined here
    // Customer.hasMany(models.Payment, {
    //     foreignKey: "customer_id",
    //     onDelete: "CASCADE",
    //     as: "customer_payments",
    // });
  };

  return Customer;
};
