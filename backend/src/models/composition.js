const { DataTypes } = require("sequelize");
const { sequelize } = require("../datasource.js");

const Composition = sequelize.define("Composition", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 30],
    },
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 30],
    },
  },
});

module.exports = { Composition };
