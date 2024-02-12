'use strict';
const {Model} = require('sequelize');
const {authMiddleware} = require("../../middlewares/authMiddleware");

module.exports = (sequelize, DataTypes) => {
    class Project extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Project.belongsTo(models.User, {foreignKey: 'userId'});
            Project.belongsTo(models.Environment, {foreignKey: 'environmentId'});
        }
    }

    Project.init({
        name: {
            type: DataTypes.STRING,
        },
        githubUsername: {
            type: DataTypes.STRING,
        },
        githubEmail: {
            type: DataTypes.STRING,
        },
        haveBackend: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Project',
    });

    return Project;
};