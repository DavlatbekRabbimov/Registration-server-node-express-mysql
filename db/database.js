const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('user_db', 'root', 'test123', {
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
