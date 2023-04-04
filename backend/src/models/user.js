const { DataTypes } = require("sequelize");
const { sequelize } = require("../datasource.js");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [4, 30],
    },
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 20],
    },
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 20],
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 8,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  mailing: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = { User };
