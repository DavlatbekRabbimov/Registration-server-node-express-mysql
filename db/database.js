const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.SQL_DB, process.env.SQL_USER, process.env.SQL_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
});

const User = sequelize.define('User', {
    'username': DataTypes.STRING,
    'position': DataTypes.STRING,
    'email': DataTypes.STRING,
    'password': DataTypes.STRING,
    'lastLogin': DataTypes.DATE,
    'status' : DataTypes.STRING
}, {
    timestamps: false
});

sequelize.sync();

module.exports = { User };
