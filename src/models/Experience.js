const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "experience",
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
      subTitle: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT("medium"),
        allowNull: false,
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
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score: {
        type: DataTypes.FLOAT,
        validate: {
          min: 1,
          max: 5,
        },
        allowNull: false,
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        // allowNull: false
      },
    },
    { timestamps: false }
  );
};
