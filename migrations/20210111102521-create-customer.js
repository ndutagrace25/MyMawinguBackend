'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('customers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id: {
                type: Sequelize.STRING
            },
            customer_name: {
                type: Sequelize.STRING
            },
            customer_phone: {
                type: Sequelize.STRING
            },
            customer_balance: {
                type: Sequelize.DECIMAL
            },
            customer_email: {
                type: Sequelize.STRING
            },
            churned_date: {
                type: Sequelize.DATE
            },
            connection_expiry_date: {
                type: Sequelize.DATE
            },
            status: {
                type: Sequelize.TINYINT
            },
            customer_special: {
                type: Sequelize.TINYINT
            },
            splynx_id: {
                type: Sequelize.STRING
            },
            connection_status: {
                type: Sequelize.STRING
            },
            nav_last_date_modified: {
                type: Sequelize.DATE
            },
            last_payment_date: {
                type: Sequelize.DATE
            },
            created_by: {
                type: Sequelize.INTEGER
            },
            modified_by: {
                type: Sequelize.INTEGER
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('customers');
    }
};