"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.User, { foreignKey: "userId" });
      Project.belongsTo(models.Environment, { foreignKey: "environmentId" });
    }
  }

  Project.init(
    {
      name: DataTypes.STRING,
      githubUsername: DataTypes.STRING,
      githubEmail: DataTypes.STRING,
      haveBackend: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      hooks: {
        afterCreate: async (project, options) => {
          await sequelize.models.AuditLog.create({
            modelName: "Project",
            action: "CREATE",
            data: project.dataValues,
            causerId: globalUserId,
          });
        },
        afterDestroy: async (project, options) => {
          await sequelize.models.AuditLog.create({
            modelName: "Project",
            action: "DELETE",
            data: project.dataValues,
            causerId: globalUserId,
          });
        },
      },
      sequelize,
      modelName: "Project",
    }
  );

  return Project;
};
