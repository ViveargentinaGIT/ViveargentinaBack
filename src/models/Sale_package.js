const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("sale_package", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    dates: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    passengers: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    total: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
  });
};
