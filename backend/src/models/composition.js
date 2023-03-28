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
    references: {
      model: "Users",
      key: "username",
    },
  },
  pageUuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
  },
});

module.exports = { Composition };
