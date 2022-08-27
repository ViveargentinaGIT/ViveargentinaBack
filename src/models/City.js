const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("city", {
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
    subTitle: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      // allowNull: false,
    },
    score: {
      type: DataTypes.FLOAT,
      validate: {
          min: 1,
          max: 5
      },
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    video: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
  }, {timestamps: false});
};
