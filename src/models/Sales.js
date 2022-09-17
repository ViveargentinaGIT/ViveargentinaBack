const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("sales", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      //  allowNull: false
    },
    extra: {
      type: DataTypes.STRING,
      //  allowNull: false
    },
    total: {
      type: DataTypes.INTEGER,
      //  allowNull: false
    },
  });
};
