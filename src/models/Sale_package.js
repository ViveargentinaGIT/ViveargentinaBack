const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "sale_package",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      image: {
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
      price: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: "package",
        // allowNull: false,
      },
      total: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
    },
    { timestamps: false }
  );
};
