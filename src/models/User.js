const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(250),
        // allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        //  allowNull: false,
      },
      birth_date: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      photo: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      administrator: {
        type: DataTypes.BOOLEAN,
        // allowNull: false,
        defaultValue: false,
      },
      provider: {
        type: DataTypes.BOOLEAN,
        // allowNull: false,
        defaultValue: false,
      },
      provider_requested: {
        type: DataTypes.BOOLEAN,
        // allowNull: false,
        defaultValue: false,
      },
    },
    { timestamps: false }
  );
};
