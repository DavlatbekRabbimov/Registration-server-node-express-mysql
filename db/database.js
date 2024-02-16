const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const db_name = 'user_db';
const db_user = 'root';
const db_password = 'test123';
const db_host = 'localhost';

const sequelize = new Sequelize(db_name, db_user, db_password, {
    host: db_host,
    dialect: 'mysql'
});

const User = sequelize.define('User', {
    'username': DataTypes.STRING,
    'position': DataTypes.STRING,
    'email': {type: DataTypes.STRING, unique: true},
    'password': DataTypes.STRING,
    'lastLogin': DataTypes.DATE,
    'status' : DataTypes.STRING
}, {
    timestamps: false
});

sequelize.sync();

module.exports = { User };
