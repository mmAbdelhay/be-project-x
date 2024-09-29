"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AuditLog.init(
    {
      modelName: DataTypes.STRING,
      action: DataTypes.STRING,
      data: DataTypes.JSON,
      description: DataTypes.STRING,
      causerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "AuditLog",
    }
  );
  return AuditLog;
};
