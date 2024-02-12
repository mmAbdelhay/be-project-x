'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Projects', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,

            },
            githubUsername: {
                type: Sequelize.STRING,
                allowNull: false,

            },
            githubEmail: {
                type: Sequelize.STRING,
                allowNull: false,

            },
            haveBackend: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            }
        });

        await queryInterface.addColumn('Projects', 'userId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'Users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        await queryInterface.addColumn('Projects', 'environmentId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'Environments',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Projects');
    }
};