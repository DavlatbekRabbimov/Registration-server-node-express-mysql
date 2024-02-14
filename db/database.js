const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_host = process.env.DB_HOST;

const sequelize = new Sequelize(db_name, db_user, db_password, {
    host: db_host,
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
