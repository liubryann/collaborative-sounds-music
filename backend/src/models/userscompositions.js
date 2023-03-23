const { DataTypes } = require("sequelize");
const { sequelize } = require("../datasource.js");
const { Composition } = require("./composition.js");
const { User } = require("./user.js");

const UsersCompositions = sequelize.define("UsersCompositions", {
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  CompositionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Composition,
      key: "id",
    },
  },
});

Composition.belongsToMany(User, {
  through: UsersCompositions,
});
User.belongsToMany(Composition, {
  through: UsersCompositions,
});
User.hasMany(UsersCompositions);
UsersCompositions.belongsTo(User);
Composition.hasMany(UsersCompositions, { onDelete: "CASCADE" });
UsersCompositions.belongsTo(Composition);

module.exports = { UsersCompositions };
