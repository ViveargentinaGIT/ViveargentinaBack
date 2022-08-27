const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "region",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
