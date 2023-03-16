import { DataTypes } from "sequelize";
import { sequelize } from "../datasource.js";
import { UsersCompositions } from "./userscompositions.js";
import { User } from "./user.js";

export const Composition = sequelize.define("Composition", {
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

Composition.belongsToMany(User, {
  through: UsersCompositions,
});
