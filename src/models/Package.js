const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('package', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        video: {
            type: DataTypes.STRING,
            // allowNull: true
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        score: {
            type: DataTypes.STRING,
            allowNull: false
        },  
        duration: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}