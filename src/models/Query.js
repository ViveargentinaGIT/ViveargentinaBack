const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('query', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.STRING,  //corregir el string acá y en los otros
            // allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Unread'
            // allowNull: false
        }
    })}