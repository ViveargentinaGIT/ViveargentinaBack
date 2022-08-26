const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("experience", {
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
    price: {
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    video: {
      type: DataTypes.STRING,
      // allowNull: true
    },
    duration: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    score: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      // allowNull: false
    },
  });
};
