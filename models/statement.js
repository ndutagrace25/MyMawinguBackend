"use strict";
module.exports = (sequelize, DataTypes) => {
  const Statement = sequelize.define(
    "Statement",
    {
      customer_no: {
        type: DataTypes.STRING,
      },
      entry_no: {
        type: DataTypes.STRING,
      },
      posting_date: {
        type: DataTypes.DATE,
      },
      document_no: {
        type: DataTypes.STRING,
        defaultValue: 0,
      },
      external_document_no: {
        type: DataTypes.STRING,
      },
      original_amount: {
        type: DataTypes.DECIMAL,
      },
      remaining_amount: {
        type: DataTypes.DECIMAL,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Date.now,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Date.now,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "statements",
      operatorsAliases: false,
    }
  );
  Statement.associate = function (models) {
    // associations can be defined here
  };
  return Statement;
};
