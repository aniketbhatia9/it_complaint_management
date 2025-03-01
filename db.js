const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ComplaintManagement', 'postgres', 'Aniket@09', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5433, // Use port 5433 as specified
});

module.exports = sequelize;
