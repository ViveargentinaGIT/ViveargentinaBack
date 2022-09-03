const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "package",
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
        //  allowNull: false,
      },
      description: {
        type: DataTypes.TEXT("medium"),
        //  allowNull: false,
      },
      image: {
        type: DataTypes.TEXT("medium"),
        // allowNull: false
      },

      duration: {
        type: DataTypes.STRING,
        //  allowNull: false,
      },
      available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      score: {
        type: DataTypes.FLOAT,
        validate: {
          min: 1,
          max: 5,
        },
        //  allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        // allowNull: false
      },
      dates: {
        type: DataTypes.STRING,
        // allowNull: false
      },
    },
    { timestamps: false }
  );
};
