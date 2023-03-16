import { DataTypes } from "sequelize";
import { sequelize } from "../datasource.js";
import { Composition } from "./composition.js";
import { User } from "./user.js";

export const UsersCompositions = sequelize.define("UsersCompositions", {
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
